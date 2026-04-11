'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface ImageSliderProps {
  images: SliderImage[];
  interval?: number;
  showIndicators?: boolean;
}

export interface SliderImage {
  url: string;
  alt: string;
  filter?: string;
}

/**
 * Image slider component with auto-play functionality
 * @param images - Array of images to display
 * @param interval - Auto-slide interval in milliseconds (default: 5000)
 * @param showIndicators - Show navigation dots (default: true)
 */
export const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  interval = 5000,
  showIndicators = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  useAutoSlide(goToNext, interval);

  return (
    <>
      <SliderImages images={images} currentIndex={currentIndex} />
      {showIndicators && (
        <SliderIndicators
          total={images.length}
          currentIndex={currentIndex}
          onSelect={goToSlide}
        />
      )}
    </>
  );
};

// Custom hook for auto-sliding functionality
function useAutoSlide(callback: () => void, interval: number): void {
  useEffect(() => {
    const timer = setInterval(callback, interval);
    return () => clearInterval(timer);
  }, [callback, interval]);
}

// Slider images container
const SliderImages: React.FC<{
  images: SliderImage[];
  currentIndex: number;
}> = ({ images, currentIndex }) => (
  <div className='absolute inset-0 z-0'>
    {images.map((image, index) => (
      <SliderImageItem
        key={index}
        image={image}
        isActive={index === currentIndex}
      />
    ))}
  </div>
);

// Individual slider image
const SliderImageItem: React.FC<{
  image: SliderImage;
  isActive: boolean;
}> = ({ image, isActive }) => {
  const opacityClass = isActive ? 'opacity-100' : 'opacity-0';

  return (
    <div
      className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${opacityClass}`}
      style={{
        backgroundImage: `url("${image.url}")`,
        filter: image.filter || 'none',
      }}
      aria-label={image.alt}
      role='img'
    />
  );
};

// Slider navigation indicators (dots)
const SliderIndicators: React.FC<{
  total: number;
  currentIndex: number;
  onSelect: (index: number) => void;
}> = ({ total, currentIndex, onSelect }) => (
  <div className='absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-2'>
    {Array.from({ length: total }).map((_, index) => (
      <IndicatorDot
        key={index}
        isActive={index === currentIndex}
        onClick={() => onSelect(index)}
      />
    ))}
  </div>
);

// Individual indicator dot
const IndicatorDot: React.FC<{
  isActive: boolean;
  onClick: () => void;
}> = ({ isActive, onClick }) => {
  const activeClass = isActive
    ? 'bg-white w-8'
    : 'bg-white/50 w-2 hover:bg-white/75';

  return (
    <button
      onClick={onClick}
      className={`h-2 rounded-full transition-all duration-300 ${activeClass}`}
      aria-label='Go to slide'
    />
  );
};
