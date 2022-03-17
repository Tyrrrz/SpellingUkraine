import NextImage from 'next/image';
import React from 'react';

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export const Image: React.FC<ImageProps> = ({ src, alt, width, height }) => {
  const [actualWidth, setActualWidth] = React.useState(width);
  const [actualHeight, setActualHeight] = React.useState(height);

  return (
    <NextImage
      src={src}
      alt={alt}
      width={actualWidth || 0}
      height={actualHeight || 0}
      layout="fixed"
      onLoadingComplete={(e) => {
        const ratio = e.naturalWidth / e.naturalHeight;

        if (!actualWidth && actualHeight) {
          setActualWidth(actualHeight * ratio);
        } else if (!actualHeight && actualWidth) {
          setActualHeight(actualWidth / ratio);
        } else if (!actualHeight && !actualWidth) {
          setActualWidth(e.naturalWidth);
          setActualHeight(e.naturalHeight);
        }
      }}
    />
  );
};
