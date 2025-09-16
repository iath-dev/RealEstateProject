import React, { useState } from 'react';

import { ImageOff } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ fallback, className, ...props }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      fallback || (
        <div className={twMerge(`bg-gray-100 flex items-center justify-center`, className)}>
          <ImageOff className="text-gray-400" size={20} />
        </div>
      )
    );
  }
  return <img className={className} onError={() => setError(true)} {...props} />;
};

export default ImageWithFallback;
