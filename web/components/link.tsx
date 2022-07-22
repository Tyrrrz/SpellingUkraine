import { FC, PropsWithChildren } from 'react';
import Box from './box';
import RawLink from './rawLink';

type LinkProps = PropsWithChildren<{
  href: string;
}>;

const Link: FC<LinkProps> = ({ href, children }) => {
  return (
    <Box type="span" classes={['text-ukraine-blue', 'hover:underline']}>
      <RawLink href={href}>{children}</RawLink>
    </Box>
  );
};

export default Link;
