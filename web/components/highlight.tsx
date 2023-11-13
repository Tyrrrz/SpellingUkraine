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
        'text-neutral-200': color === 'blue',
        'dark:text-neutral-900': color === 'yellow'
      })}
    >
      {children}
    </div>
  );
};

export default Highlight;
