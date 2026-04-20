import React, { useEffect, useState } from 'react';
import { Button } from '../button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';
import { Link } from 'react-router-dom';


function Header() {

  const user=JSON.parse(localStorage.getItem('user'));

const [openDialog, setOpenDialog] = useState(false);
  useEffect(() => {
    console.log(user);
  },[]);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error),
  });

  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'application/json',
      },
    }).then((resp) => {
      console.log(resp);
      localStorage.setItem('user', JSON.stringify(resp.data));
      setOpenDialog(false);
      window.location.reload();
    });
  };

  return (
    <div className='sticky top-0 z-50 w-full bg-black/50 backdrop-blur-lg border-b border-white/10'>
      <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <Link to="/" className="flex items-center gap-2">
            <img src='/logo.svg' alt="logo img" className='h-10' />
            <span className='gradient-text font-bold text-xl hidden sm:block'>AI Trip Planner</span>
          </Link>

          <div className='flex items-center gap-3'>
            {user ? (
              <>
                <Link to="/create-trip">
                  <Button variant="outline" className='rounded-full'>+ Create Trip</Button>
                </Link>
                <Link to="/my-trips">
                  <Button variant="outline" className='rounded-full'>My Trips</Button>
                </Link>
                <Popover>
                  <PopoverTrigger>
                    <img src={user?.picture || '/default-avatar.svg'} className='h-9 w-9 rounded-full border-2 border-purple-500/50' alt="profile" />
                  </PopoverTrigger>
                  <PopoverContent className='bg-gray-900/95 backdrop-blur-xl border border-white/10'>
                    <h2 className='cursor-pointer py-2 hover:text-purple-400 transition-colors' onClick={()=>{
                      googleLogout();
                      localStorage.clear();
                      window.location.reload();
                    }}>Logout</h2>
                  </PopoverContent>
                </Popover>
              </>
            ) : (
              <Button variant="gradient" onClick={()=>setOpenDialog(true)} className='shadow-lg shadow-purple-500/30'>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>

      <Dialog open={openDialog} >
        <DialogContent className='bg-gray-900/95 backdrop-blur-xl border border-white/10'>
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription className='flex flex-col items-center gap-4 py-4'>
              <img src='/logo.svg' alt='login' className='w-24' />
              <div className='text-center space-y-2'>
                <h2 className='font-bold text-xl gradient-text'>Sign in with Google</h2>
                <span className='text-sm text-gray-400'>Sign in to the App with Google Authentication securely</span>
              </div>
              <Button
                onClick={login}
                variant="outline"
                className='w-full my-2 flex gap-4 items-center justify-center border border-white/20 hover:bg-white/5'>
                <FcGoogle className='text-2xl' />
                <span>Sign in with Google</span>
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}


export default Header;
