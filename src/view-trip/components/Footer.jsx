import React from 'react';

function Footer({trip}) {
  return (
    <footer className='mt-16 py-8 border-t border-white/10'>
      <div className='text-center'>
        <p className='text-gray-400 text-sm'>
          Created with <span className='text-red-500'>♥</span> by{' '}
          <span className='gradient-text font-semibold'>AI Trip Planner</span>
        </p>
        <p className='text-gray-500 text-xs mt-2'>
          © {new Date().getFullYear()} All rights reserved
        </p>
      </div>
    </footer>
  );
}

export default Footer;