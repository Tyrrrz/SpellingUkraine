import c from 'classnames';
import NextLink from 'next/link';
import { FC, PropsWithChildren } from 'react';

type LinkProps = PropsWithChildren<{
  variant?: 'normal' | 'discreet' | 'hidden';
  color?: 'blue' | 'yellow';
  href: string;
}>;

const Link: FC<LinkProps> = ({ variant = 'normal', color = 'blue', href, children }) => {
  const absolute = /^[a-z][a-z\d+\-.]*:/iu.test(href);

  const link = (
    <a
      className={c({
        'text-ukraine-blue': variant === 'normal' && color === 'blue',
        'text-ukraine-yellow': variant === 'normal' && color === 'yellow',
        'hover:underline': variant === 'normal',
        'hover:text-ukraine-blue': variant === 'discreet' && color === 'blue',
        'hover:text-ukraine-yellow': variant === 'discreet' && color === 'yellow'
      })}
      href={href}
      target={absolute ? '_blank' : undefined}
      rel="noreferrer"
    >
      {children}
    </a>
  );

  return absolute ? (
    link
  ) : (
    <NextLink href={href} passHref>
      {link}
    </NextLink>
  );
};

export default Link;
