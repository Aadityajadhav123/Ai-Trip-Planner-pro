import { GetPlacesDetails, PHOTO_REF_URL } from '@/service/GlobelApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function HotelCardItem({ hotel }) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    hotel && GetPlacePhoto();
  }, [hotel]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: hotel?.hotelName,
    };
    try {
      const resp = await GetPlacesDetails(data);
      if (resp?.data?.places?.[0]?.photos?.[3]?.name) {
        const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', resp.data.places[0].photos[3].name);
        setPhotoUrl(PhotoUrl);
      }
    } catch (e) {
      console.error('Photo fetch error:', e);
      setPhotoUrl(null);
    }
  };

  return (
    <Link 
      to={'https://www.google.com/maps/search/?api=1&query=' + hotel.hotelName + "," + hotel?.hotelAddress} 
      target='_blank'
      rel='noopener noreferrer'
      className='group block'
    >
      <div className='glass-card overflow-hidden hover:shadow-purple-500/30 hover:shadow-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1'>
        {/* Image container with price badge */}
        <div className='relative overflow-hidden rounded-t-2xl'>
          <img 
            src={photoUrl ? photoUrl : "/default-travel.svg"} 
            alt={hotel?.hotelName} 
            className='w-full h-[180px] object-cover transition-transform duration-300 group-hover:scale-110'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />

          {/* Price badge - top right */}
          <div className='absolute top-3 right-3'>
            <div className='bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-purple-500/30'>
              {hotel?.price}
            </div>
          </div>

          {/* Rating badge */}
          <div className='absolute top-3 left-3 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1'>
            <span className='text-yellow-400 text-sm'>★</span>
            <span className='text-white text-sm font-semibold'>{hotel?.rating}</span>
          </div>
        </div>

        {/* Content */}
        <div className='p-4 space-y-2'>
          <h3 className='font-semibold text-white text-lg leading-tight group-hover:text-blue-300 transition-colors'>
            {hotel?.hotelName}
          </h3>
          <p className='text-gray-400 text-sm flex items-center gap-1.5'>
            <span>📍</span>
            <span className='truncate'>{hotel?.hotelAddress}</span>
          </p>
          <div className='flex items-center justify-between pt-1'>
            <div className='flex items-center gap-1 text-yellow-500'>
              {'★'.repeat(Math.min(5, Math.floor(hotel?.rating || 0)))}
              {'☆'.repeat(5 - Math.min(5, Math.floor(hotel?.rating || 0)))}
            </div>
            <span className='text-blue-400 text-sm font-medium'>View details →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default HotelCardItem;