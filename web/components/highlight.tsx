import c from 'classnames';
import { FC, PropsWithChildren } from 'react';

type HighlightProps = PropsWithChildren<{
  color?: 'blue' | 'yellow';
}>;

const Highlight: FC<HighlightProps> = ({ color = 'blue', children }) => {
  return (
    <div
      className={c('w-fit', 'px-2', 'py-1', 'rounded', {
        'bg-ukraine-blue': color === 'blue',
        'bg-ukraine-yellow': color === 'yellow',
        'text-white': color === 'blue'
      })}
    >
      {children}
    </div>
  );
};

export default Highlight;
