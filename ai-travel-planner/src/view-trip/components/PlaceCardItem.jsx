import { GetPlacesDetails, PHOTO_REF_URL } from '@/service/GlobelApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function PlaceCardItem({ Place }) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    Place && GetPlacePhoto();
  }, [Place]);

  const GetPlacePhoto = async () => {
    if (!Place?.placeName) return;

    const data = {
      textQuery: Place.placeName,
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

  if (!Place) return null;

  return (
    <Link
      to={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(Place.placeName)}
      target='_blank'
      rel='noopener noreferrer'
      className='group block'
    >
      <div className='glass-card overflow-hidden hover:shadow-purple-500/20 hover:shadow-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-l-purple-500'>
        <div className='flex flex-col md:flex-row gap-0 md:gap-4'>
          {/* Image */}
          <div className='relative w-full md:w-32 h-40 md:h-auto flex-shrink-0 overflow-hidden rounded-t-xl md:rounded-l-xl md:rounded-t-none'>
            <img
              src={photoUrl ? photoUrl : "/travel.jpg"}
              alt={Place.placeName}
              className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
          </div>

          {/* Content */}
          <div className='flex-1 p-4 flex flex-col justify-between'>
            <div>
              <h3 className='font-bold text-white text-lg mb-1 group-hover:text-blue-300 transition-colors'>
                {Place.placeName}
              </h3>
              {Place.placeDetails && (
                <p className='text-gray-400 text-sm line-clamp-2 leading-relaxed'>
                  {Place.placeDetails}
                </p>
              )}
            </div>

            {Place.timeToTravel && (
              <div className='flex items-center gap-2 mt-3 text-sm'>
                <span className='bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-md'>
                  🕛 {Place.timeToTravel}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PlaceCardItem;