import c from 'classnames';
import { FC, PropsWithChildren } from 'react';

type ParagraphProps = PropsWithChildren;

const Paragraph: FC<ParagraphProps> = ({ children }) => {
  return <p className={c('my-2')}>{children}</p>;
};

export default Paragraph;
