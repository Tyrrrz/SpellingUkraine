import c from 'classnames';
import { FC, PropsWithChildren } from 'react';

type HeadingProps = PropsWithChildren;

const Heading: FC<HeadingProps> = ({ children }) => {
  return <h1 className={c('my-2', 'text-3xl', 'tracking-wide')}>{children}</h1>;
};

export default Heading;
