import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-gray-100 animate-pulse" />
        
        <div className="flex space-x-3 relative z-10">
          <div className="w-4 h-4 bg-gray-500 rounded-full animate-bounce" 
               style={{ animationDelay: "0ms" }} />
          <div className="w-4 h-4 bg-gray-500 rounded-full animate-bounce" 
               style={{ animationDelay: "150ms" }} />
          <div className="w-4 h-4 bg-gray-500 rounded-full animate-bounce" 
               style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;