import c from 'classnames';
import NextLink from 'next/link';
import { FC, PropsWithChildren } from 'react';

type RawLinkProps = PropsWithChildren<{
  className?: string;
  href: string;
}>;

const RawLink: FC<RawLinkProps> = ({ className, href, children }) => {
  const isAbsolute = /^[a-z][a-z\d+\-.]*:/iu.test(href);

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

type LinkProps = PropsWithChildren<{
  variant?: 'normal' | 'discreet' | 'hidden';
  color?: 'blue' | 'yellow';
  href: string;
}>;

const Link: FC<LinkProps> = ({ variant = 'normal', color = 'blue', href, children }) => {
  return (
    <RawLink
      className={c({
        'text-ukraine-blue': variant === 'normal' && color === 'blue',
        'text-ukraine-yellow': variant === 'normal' && color === 'yellow',
        'hover:underline': variant === 'normal',
        'hover:text-ukraine-blue': variant === 'discreet' && color === 'blue',
        'hover:text-ukraine-yellow': variant === 'discreet' && color === 'yellow'
      })}
      href={href}
    >
      {children}
    </RawLink>
  );
};

export default Link;
