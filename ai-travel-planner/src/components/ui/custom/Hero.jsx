import React from 'react'
import { Button } from '../button'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div className='relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden'>
      {/* Background image with overlay gradient */}
      <div className='absolute inset-0 z-0'>
        <img 
          src="/travel.jpg" 
          alt="Travel hero" 
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80' />
        <div className='absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20' />
      </div>

      {/* Content */}
      <div className='relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
        <h1 className='font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight'>
          <span className='gradient-text'>
            Discover Your Next Adventure With AI
          </span>
          <br />
          <span className='text-white'>Personalized Itineraries at Your Fingertips</span>
        </h1>
        
        <p className='text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed'>
          Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
        </p>

        <Link to={'/create-trip'}>
          <Button 
            variant="gradient" 
            size="lg"
            className='shadow-lg shadow-purple-500/40 text-base px-8 py-6'
          >
            Get Started, It's Free
          </Button>
        </Link>

        {/* Floating decoration elements */}
        <div className='mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto'>
          <div className='glass-card p-6'>
            <div className='text-3xl font-bold gradient-text'>10K+</div>
            <div className='text-sm text-gray-400 mt-1'>Trips Planned</div>
          </div>
          <div className='glass-card p-6'>
            <div className='text-3xl font-bold gradient-text'>150+</div>
            <div className='text-sm text-gray-400 mt-1'>Destinations</div>
          </div>
          <div className='glass-card p-6'>
            <div className='text-3xl font-bold gradient-text'>98%</div>
            <div className='text-sm text-gray-400 mt-1'>Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero