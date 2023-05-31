import c from 'classnames';
import { FC, PropsWithChildren } from 'react';

type InlineProps = PropsWithChildren;

const Inline: FC<InlineProps> = ({ children }) => {
  return <div className={c('inline-flex', 'items-center', 'gap-1')}>{children}</div>;
};

export default Inline;
