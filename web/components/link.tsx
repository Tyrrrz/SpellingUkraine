import classNames from 'classnames';
import NextLink from 'next/link';
import { FC, ReactNode } from 'react';

interface LinkProps {
  href: string;
  emphasize?: boolean;
  children?: ReactNode;
}

const Link: FC<LinkProps> = ({ href, emphasize = true, children, ...props }) => {
  const isAbsolute = /^[a-z][a-z\d+\-.]*:/iu.test(href);

  const className = classNames('hover:text-blue-500', 'inline', {
    'font-semibold': emphasize
  });

  if (isAbsolute) {
    return (
      <a {...props} className={className} href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  } else {
    return (
      <NextLink href={href} passHref>
        <a {...props} className={className}>
          {children}
        </a>
      </NextLink>
    );
  }
};

export default Link;
