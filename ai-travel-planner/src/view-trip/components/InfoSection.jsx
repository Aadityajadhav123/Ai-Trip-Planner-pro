import { Button } from '@/components/ui/button';
import { GetPlacesDetails, PHOTO_REF_URL } from '@/service/GlobelApi';
import { IoIosSend } from "react-icons/io";
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react'


function InfoSection({trip}) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(()=>{
    trip && GetPlacePhoto();
  },[trip])

  const GetPlacePhoto=async()=>{
    const locationLabel = trip?.userSelection?.location?.label || trip?.userSelection?.location;
    if (!locationLabel) return;

    const data={
      textQuery: locationLabel
    }
    try {
      const resp = await GetPlacesDetails(data);
      if (resp?.data?.places?.[0]?.photos?.[3]?.name) {
        const PhotoUrl=PHOTO_REF_URL.replace('{NAME}',resp.data.places[0].photos[3].name);
        setPhotoUrl(PhotoUrl);
      }
    } catch (e) {
      console.log("Photo fetch error (using fallback):", e?.message);
      setPhotoUrl(null);
    }
  }

  return (
    <div className='mb-8'>
      {/* Hero Image with overlay */}
      <div className='relative w-full h-[400px] md:h-[450px] rounded-2xl overflow-hidden mb-6'>
        <img 
          src={photoUrl ? photoUrl : "/travel.jpg"} 
          alt='trip destination' 
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent' />
        <div className='absolute bottom-0 left-0 right-0 p-6 md:p-8'>
          <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-4'>
            {trip?.userSelection?.location?.label || 'Explore the World'}
          </h1>

          {/* Stats badges */}
          <div className='flex flex-wrap gap-3'>
            <div className='stat-badge flex items-center gap-2'>
              <span className='text-blue-400'>📅</span>
              <span>{trip?.userSelection?.noOfDays} Days</span>
            </div>
            <div className='stat-badge flex items-center gap-2'>
              <span className='text-green-400'>💰</span>
              <span>{trip?.userSelection?.budged} Budget</span>
            </div>
            <div className='stat-badge flex items-center gap-2'>
              <span className='text-pink-400'>👥</span>
              <span>{trip?.userSelection?.traveler} Travelers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action button */}
      <div className='flex justify-end'>
        <Link to={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(trip?.userSelection?.location?.label || trip?.userSelection?.location)} target='_blank'>
          <Button variant="gradient" size="lg" className='shadow-lg shadow-purple-500/30'>
            <IoIosSend className='mr-2' />
            Open in Maps
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default InfoSection