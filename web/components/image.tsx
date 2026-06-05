import { FC } from "react";
import { resolvePath } from "../utils/assets";

type ImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
};

const Image: FC<ImageProps> = ({ src, alt, width, height, priority }) => {
  return (
    <img
      src={resolvePath(src)}
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
