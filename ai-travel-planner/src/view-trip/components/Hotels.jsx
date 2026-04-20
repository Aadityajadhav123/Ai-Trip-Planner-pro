import React from 'react'
import HotelCardItem from './HotelCardItem'

function Hotels({ trip }) {
  const hotels = trip?.tripData?.hotels;

  if (!hotels || hotels.length === 0) {
    return (
      <div className='mt-12 mb-8'>
        <h2 className='text-2xl md:text-3xl font-bold gradient-text mb-2'>Recommended Hotels</h2>
        <p className='text-gray-400'>No hotel recommendations available for this trip.</p>
      </div>
    );
  }

  return (
    <div className='mt-12 mb-8'>
      <h2 className='text-2xl md:text-3xl font-bold gradient-text mb-6'>Recommended Hotels</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {hotels.map((hotel, index) => (
          <HotelCardItem key={index} hotel={hotel} />
        ))}
      </div>
    </div>
  )
}

export default Hotels