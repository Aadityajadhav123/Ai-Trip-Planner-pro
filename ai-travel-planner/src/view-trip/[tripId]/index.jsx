import { db } from '@/service/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect,useState } from 'react'
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import Hotels from '../components/Hotels';
import InfoSection from '../components/InfoSection';
import PlacesToVisit from '../components/PlacesToVisit';
import Footer from '../components/Footer';

function Viewtrip() {
    const {tripId} = useParams();
    const [trip, setTrip] = useState([]);
    useEffect(() => {
        tripId && GetTripData();
    },[tripId]);

    const GetTripData=async()=>{
        const docRef = doc(db, "AiTrips", tripId);
        const docSnap=await getDoc(docRef);

        if(docSnap.exists()){
            console.log("Document data:", docSnap.data());
            setTrip(docSnap.data());
        }
        else{
            console.log("No such document");
            toast("No such document");
        }
    }
  return (
    <div className='min-h-screen py-8 md:py-12 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-gradient-to-b from-black/50 to-transparent'>
      <div className='max-w-6xl mx-auto space-y-10'>
        {/* Information Section */}
        <InfoSection trip={trip} />

        {/* Hotels Section */}
        <Hotels trip={trip}/>

        {/* Daily Plan */}
        <PlacesToVisit trip={trip}/>

        {/* Footer */}
        <Footer trip={trip}/>
      </div>
    </div>
  )
}

export default Viewtrip