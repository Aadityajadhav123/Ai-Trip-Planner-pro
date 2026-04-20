import { GetPlacesDetails, PHOTO_REF_URL } from '@/service/GlobelApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function UserTripCardItem({ trip }) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    trip && GetPlacePhoto();
  }, [trip]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: trip.userSelection.location.label,
    };

    try {
      const resp = await GetPlacesDetails(data);
      if (resp?.data?.places?.[0]?.photos?.[0]?.name) {
        const photoName = resp.data.places[0].photos[0].name;
        const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', photoName);
        setPhotoUrl(PhotoUrl);
      }
    } catch (error) {
      console.error('Error fetching place photo:', error);
    }
  };

  return (
    <Link to={`/view-trip/${trip.id}`}>
      <div className='glass-card overflow-hidden group cursor-pointer hover:shadow-purple-500/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
        {/* Image */}
        <div className='relative overflow-hidden rounded-t-2xl h-48'>
          <img
            src={photoUrl ? photoUrl : '/travel.jpg'}
            alt={trip?.userSelection?.location?.label}
            className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />

          {/* Trip duration badge */}
          <div className='absolute bottom-3 left-3'>
            <div className='bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg'>
              {trip?.userSelection?.noOfDays} Days
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='p-4'>
          <h3 className='font-bold text-white text-lg mb-2 truncate group-hover:text-blue-300 transition-colors'>
            {trip?.userSelection?.location?.label}
          </h3>
          <p className='text-gray-400 text-sm'>
            <span className='flex items-center gap-2'>
              <span>💰</span>
              <span>{trip?.userSelection?.budget} budget</span>
            </span>
            <span className='flex items-center gap-2 mt-1'>
              <span>👥</span>
              <span>{trip?.userSelection?.traveler} travelers</span>
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
}

export default UserTripCardItem;