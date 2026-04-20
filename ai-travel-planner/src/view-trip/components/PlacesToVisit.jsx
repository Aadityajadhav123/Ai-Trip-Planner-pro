import React from 'react'
import PlaceCardItem from './PlaceCardItem'

function PlacesToVisit({trip}) {
  if (!trip?.tripData?.itinerary) return null;

  return (
    <div className='mt-12'>
      <h2 className='text-2xl md:text-3xl font-bold gradient-text mb-8'>Daily Itinerary</h2>
      <div className='space-y-8'>
        {trip.tripData.itinerary.map((item, index) => (
          <div key={index} className='relative'>
            {/* Day header with gradient badge */}
            <div className='flex items-center gap-4 mb-6'>
              <div className='relative'>
                <div className='absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-sm opacity-70'></div>
                <div className='relative bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-lg font-bold shadow-lg shadow-purple-500/30'>
                  {item.day}
                </div>
              </div>
            </div>

            {/* Places grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 ml-4'>
              {item.plane?.map((place, idx) => (
                <PlaceCardItem key={idx} Place={place} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PlacesToVisit