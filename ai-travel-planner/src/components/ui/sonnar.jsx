import React from 'react';
import { Toaster as Sonner } from 'sonner';

const Toaster = (props) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-gray-900/95 group-[.toaster]:text-white group-[.toaster]:border-white/10 group-[.toaster]:shadow-lg backdrop-blur-xl',
          description: 'group-[.toast]:text-gray-400',
          actionButton:
            'group-[.toast]:bg-gradient-to-r group-[.toast]:from-blue-500 group-[.toast]:to-purple-600 group-[.toast]:text-white',
          cancelButton:
            'group-[.toast]:bg-white/10 group-[.toast]:text-white group-[.toast]:hover:bg-white/20',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
