import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { SelectBudgetOptions, SelectTravelesList, AI_PROMPT } from '@/constants/option';
import { Toaster } from '@/components/ui/sonnar';
import { chatSession } from '@/service/AIModel';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';


function CreateTrip() {
  const [place, setPlace] = useState();
  const [locationInput, setLocationInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const debounceRef = useRef(null);

  const searchLocations = async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }
    setLoadingSuggestions(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
        {
          headers: {
            'User-Agent': 'AI-Trip-Planner/1.0',
          },
        }
      );
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleLocationInput = (e) => {
    const value = e.target.value;
    setLocationInput(value);
    setPlace(null);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      searchLocations(value);
    }, 300);
  };

  const handleSelectSuggestion = (suggestion) => {
    setLocationInput(suggestion.display_name);
    setPlace(suggestion);
    handleInputChange('location', suggestion.display_name);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error),
  });

  const onGenrateTrip = async () => {
    const user = localStorage.getItem('user');

    if (!user) {
      setOpenDialog(true);
      return;
    }
    if (!formData?.noofDays || !formData?.location || !formData?.budget || !formData?.traveler) {
      toast('Please fill all the fields');
      return;
    }
    setLoading(true);
    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', formData.location)
      .replace('{noofDays}', formData.noofDays)
      .replace('{budget}', formData.budget)
      .replace('{traveler}', formData.traveler)
      .replace('{totalDays}', formData.noofDays);

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      await SaveAiTrip(result?.response?.text());
    } catch (error) {
      console.error('Error generating trip:', error);

      const errorStr = error.toString();
      if (errorStr.includes('429') || errorStr.includes('quota')) {
        const retryMatch = errorStr.match(/retry in ([\d.]+)s/);
        const retrySeconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : 60;

        toast(`API quota exceeded. Retrying in ${retrySeconds} seconds...`, { duration: 5000 });
        setLoading(true);

        await new Promise(resolve => setTimeout(resolve, retrySeconds * 1000));

        try {
          const result = await chatSession.sendMessage(FINAL_PROMPT);
          await SaveAiTrip(result?.response?.text());
          return;
        } catch (retryError) {
          console.error('Retry failed:', retryError);
          toast('API quota exhausted. Please enable billing at https://aistudio.google.com/app/billing');
          setLoading(false);
          return;
        }
      }

      toast('Error generating trip. Please try again.');
      setLoading(false);
    }
  };

  const SaveAiTrip = async (TripData) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const docId = Date.now().toString();

      const cleanData = TripData.replace(/```json/g, '').replace(/```/g, '').trim();

      await setDoc(doc(db, "AiTrips", docId), {
        userSelection: formData,
        TripData: JSON.parse(cleanData),
        userEmail: user?.email,
        id: docId,
      });
      setLoading(false);
      navigate(`/view-trip/${docId}`);
    } catch (error) {
      console.error('Error saving trip:', error);
      toast('Error saving trip. Please try again.');
      setLoading(false);
    }
  };

  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'application/json',
      },
    }).then((resp) => {
      localStorage.setItem('user', JSON.stringify(resp.data));
      setOpenDialog(false);
      onGenrateTrip();
    }).catch((error) => {
      console.error('Error fetching user profile:', error);
    });
  };

  return (
    <div className='min-h-screen pt-10 pb-20'>
      <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-3xl md:text-4xl font-bold gradient-text mb-4'>
            Tell us Your Travel Preferences
          </h1>
          <p className='text-gray-400 text-lg'>
            Just provide some basic info, and our AI will generate a customized itinerary tailored to your interests.
          </p>
        </div>

        {/* Form Container */}
        <div className='glass-card p-6 md:p-8 space-y-8'>

          {/* Destination */}
          <div className='space-y-3'>
            <label className='text-sm uppercase tracking-wider text-gray-400 font-semibold'>
              What is your destination?
            </label>
            <div className='relative'>
              <input
                type='text'
                value={locationInput}
                onChange={handleLocationInput}
                placeholder='Search for a city or place...'
                className='w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all'
              />
              {loadingSuggestions && (
                <div className='absolute right-3 top-3 text-gray-400'>
                  <AiOutlineLoading3Quarters className='animate-spin h-5 w-5' />
                </div>
              )}
              {showSuggestions && suggestions.length > 0 && (
                <ul className='absolute z-20 w-full bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl mt-1 shadow-xl max-h-60 overflow-y-auto'>
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className='px-4 py-3 hover:bg-white/5 cursor-pointer text-gray-300 transition-colors border-b border-white/5 last:border-b-0'
                    >
                      {suggestion.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Number of Days */}
          <div className='space-y-3'>
            <label className='text-sm uppercase tracking-wider text-gray-400 font-semibold'>
              How many days?
            </label>
            <input
              type='number'
              min='1'
              max='30'
              placeholder='e.g., 5'
              className='w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all'
              onChange={(e) => handleInputChange('noofDays', e.target.value)}
            />
          </div>

          {/* Budget Selection */}
          <div className='space-y-3'>
            <label className='text-sm uppercase tracking-wider text-gray-400 font-semibold'>
              What is your budget?
            </label>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
              {SelectBudgetOptions.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleInputChange('budget', item.title)}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    formData.budget === item.title
                      ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/30'
                      : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className='text-4xl mb-3'>{item.icon}</div>
                  <h3 className='font-bold text-white text-lg'>{item.title}</h3>
                  <p className='text-gray-400 text-sm mt-1'>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Travelers Selection */}
          <div className='space-y-3'>
            <label className='text-sm uppercase tracking-wider text-gray-400 font-semibold'>
              Who are you traveling with?
            </label>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
              {SelectTravelesList.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleInputChange('traveler', item.people)}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    formData.traveler === item.people
                      ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/30'
                      : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className='text-4xl mb-3'>{item.icon}</div>
                  <h3 className='font-bold text-white text-lg'>{item.title}</h3>
                  <p className='text-gray-400 text-sm mt-1'>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className='flex justify-end pt-4'>
            <Button
              disabled={loading}
              onClick={onGenrateTrip}
              variant="gradient"
              size="lg"
              className='shadow-lg shadow-purple-500/40 px-8'
            >
              {loading ? (
                <>
                  <AiOutlineLoading3Quarters className='animate-spin h-5 w-5' />
                  <span>Generating...</span>
                </>
              ) : (
                'Generate Trip'
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Google Sign-in Dialog */}
      <Dialog open={openDialog}>
        <DialogContent className='bg-gray-900/95 backdrop-blur-xl border border-white/10'>
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription className='flex flex-col items-center gap-6 py-6'>
              <img src='/logo.svg' alt='login' className='w-24' />
              <div className='text-center space-y-2'>
                <h2 className='font-bold text-xl gradient-text'>Sign in with Google</h2>
                <span className='text-sm text-gray-400'>Sign in securely with Google Authentication</span>
              </div>
              <Button
                onClick={login}
                variant="outline"
                className='w-full max-w-xs flex gap-3 items-center justify-center border border-white/20 hover:bg-white/5 py-6'
              >
                <FcGoogle className='text-2xl' />
                <span className='font-medium'>Sign in with Google</span>
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}

export default CreateTrip;