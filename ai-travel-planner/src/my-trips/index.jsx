import { db } from '@/service/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserTripCardItem from './components/UserTripCardItem';

function MyTrips() {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);

  useEffect(() => {
    GetUserTrip();
  }, []);

  const GetUserTrip = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      navigate('/');
      return;
    }

    const q = query(collection(db, "AiTrips"), where("userEmail", "==", user?.email));
    const querySnapshot = await getDocs(q);
    setUserTrips([]);
    const trips = [];
    querySnapshot.forEach((doc) => {
      trips.push(doc.data());
    });
    setUserTrips(trips);
  };

  return (
    <div className='min-h-screen py-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16'>
      <div className='max-w-6xl mx-auto'>
        <h2 className='text-3xl md:text-4xl font-bold gradient-text mb-8'>
          My Trips
        </h2>

        {userTrips?.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {userTrips.map((trip, index) => (
              <UserTripCardItem key={trip.id || index} trip={trip} />
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <div key={index} className='animate-pulse bg-white/5 border border-white/10 rounded-2xl h-[320px]' />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTrips;