import React, { useState } from 'react';

import { Image } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

import ImageWithFallback from '@/components/common/ImageWithFallback';
import { Skeleton } from '@/components/ui/skeleton';
import usePropertyDetails from '@/hooks/usePropertyDetails';

const PropertyImagesCarousel: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const { data: property, isLoading, isError } = usePropertyDetails();

  if (isLoading) return <Skeleton className="w-full rounded-lg aspect-video" />;

  if (!property || isError || property.images.length == 0) return null;

  const { images } = property;

  return (
    <section>
      <figure className="aspect-video w-full overflow-hidden rounded-lg relative">
        <ImageWithFallback
          src={images[currentImage].file}
          alt={`${property.name} image ${images[currentImage].idPropertyImage}`}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
        <figcaption className="absolute left-4 bottom-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 select-none">
          <Image size={14} />
          {currentImage + 1} / {images.length}
        </figcaption>
      </figure>
      <div
        className={twMerge(
          images.length > 1 && 'hidden',
          'flex gap-2 mt-1 relative scroll-smooth snap-x snap-mandatory p-0.5',
          '[&::-webkit-scrollbar]:hidden overflow-x-auto',
          '[anchor-name:--images-carousel]',
          '[&::scroll-button(*):disabled]:opacity-10 [&::scroll-button(*)]:transition-colors [&::scroll-button(*)]:duration-300 [&::scroll-button(*)]:bg-primary/90 [&::scroll-button(*)]:text-white [&::scroll-button(*)]:font-medium [&::scroll-button(*)]:text-center  [&::scroll-button(*)]:inline-flex [&::scroll-button(*)]:items-center  [&::scroll-button(*)]:rounded-full [&::scroll-button(*)]:text-sm [&::scroll-button(*)]:absolute [&::scroll-button(*)]:[position-anchor:--images-carousel] [&::scroll-button(*)]:[align-self:anchor-center] [&::scroll-button(*)]:z-10 [&::scroll-button(*)]:cursor-pointer [&::scroll-button(*)]:border-none',
          "[&::scroll-button(right)]:content-['>'] [&::scroll-button(right)]:[left:calc(anchor(right)-1.2em)]",
          "[&::scroll-button(left)]:content-['<'] [&::scroll-button(left)]:[right:calc(anchor(left)-1.2em)]"
        )}
      >
        {images.map((img, index) => (
          <ImageWithFallback
            key={img.idPropertyImage}
            src={img.file}
            alt={`Image ${index + 1}`}
            className={twMerge(
              'h-20 flex-shrink-0 aspect-video object-cover rounded cursor-pointer snap-center opacity-90 hover:opacity-100 transition-all',
              index === currentImage
                ? 'opacity-100 ring-2 ring-blue-500 shadow-md'
                : 'opacity-70 hover:opacity-90'
            )}
            onClick={() => setCurrentImage(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default PropertyImagesCarousel;
