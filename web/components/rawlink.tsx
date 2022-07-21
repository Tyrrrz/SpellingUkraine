import NextLink from 'next/link';
import { FC, PropsWithChildren } from 'react';

type RawLinkProps = PropsWithChildren<{
  href: string;
}>;

const RawLink: FC<RawLinkProps> = ({ href, children }) => {
  const isAbsolute = /^[a-z][a-z\d+\-.]*:/iu.test(href);

  if (isAbsolute) {
    return (
      <a href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  } else {
    return (
      <NextLink href={href} passHref>
        <a>{children}</a>
      </NextLink>
    );
  }
};

export default RawLink;
