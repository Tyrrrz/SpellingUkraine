import classNames from 'classnames';
import NextLink from 'next/link';
import { FC, PropsWithChildren } from 'react';

type LinkProps = PropsWithChildren<{
  href: string;
  emphasize?: boolean;
}>;

const Link: FC<LinkProps> = ({ href, emphasize = true, children }) => {
  const isAbsolute = /^[a-z][a-z\d+\-.]*:/iu.test(href);

  const className = classNames('hover:text-blue-500', 'inline', {
    'font-semibold': emphasize
  });

  if (isAbsolute) {
    return (
      <a className={className} href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  } else {
    return (
      <NextLink href={href} passHref>
        <a className={className}>{children}</a>
      </NextLink>
    );
  }
};

export default Link;
