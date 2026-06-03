import { FC } from "react";

type ImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
};

const Image: FC<ImageProps> = ({ src, alt, width, height, priority }) => {
  // Prepend BASE_URL to root-relative paths for proper resolution under non-root base paths
  const resolvedSrc = src.startsWith("/") ? import.meta.env.BASE_URL + src.slice(1) : src;

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      width={width}
      height={height}
      style={{
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
      }}
    />
  );
};

export default Image;
