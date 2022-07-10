import NextImage from 'next/image';
import React, { FC, useState } from 'react';

type ImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

const Image: FC<ImageProps> = ({ src, alt, width, height }) => {
  const [actualWidth, setActualWidth] = useState(width || 0);
  const [actualHeight, setActualHeight] = useState(height || 0);

  return (
    <NextImage
      src={src}
      alt={alt}
      width={actualWidth}
      height={actualHeight}
      layout={width || height ? 'intrinsic' : 'responsive'}
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

export default Image;
