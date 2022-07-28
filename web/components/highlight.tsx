import c from 'classnames';
import { FC, PropsWithChildren } from 'react';

type HighlightProps = PropsWithChildren<{
  color?: 'blue' | 'yellow';
}>;

const Highlight: FC<HighlightProps> = ({ color = 'blue', children }) => {
  return (
    <span
      className={c('px-2', 'py-1', 'rounded', {
        'bg-ukraine-blue': color === 'blue',
        'bg-ukraine-yellow': color === 'yellow',
        'text-white': color === 'blue'
      })}
    >
      {children}
    </span>
  );
};

export default Highlight;
