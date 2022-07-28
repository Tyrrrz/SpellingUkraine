import c from 'classnames';
import { FC, PropsWithChildren } from 'react';

type InlineProps = PropsWithChildren;

const Inline: FC<InlineProps> = ({ children }) => {
  return <span className={c('inline-flex', 'items-center', 'gap-1')}>{children}</span>;
};

export default Inline;
