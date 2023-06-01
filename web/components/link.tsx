import c from 'classnames';
import NextLink from 'next/link';
import { FC, PropsWithChildren } from 'react';
import { isAbsoluteUrl } from '~/utils/url';

type LinkProps = PropsWithChildren<{
  variant?: 'normal' | 'discreet' | 'hidden';
  color?: 'blue' | 'yellow';
  href: string;
  external?: boolean;
}>;

const Link: FC<LinkProps> = ({
  variant = 'normal',
  color = 'blue',
  href,
  external = isAbsoluteUrl(href),
  children
}) => {
  const Proxy = external ? 'a' : NextLink;

  return (
    <Proxy
      className={c({
        'text-ukraine-blue': variant === 'normal' && color === 'blue',
        'text-ukraine-yellow': variant === 'normal' && color === 'yellow',
        'hover:underline': variant === 'normal',
        'hover:text-ukraine-blue': variant === 'discreet' && color === 'blue',
        'hover:text-ukraine-yellow': variant === 'discreet' && color === 'yellow'
      })}
      href={href}
      target={external ? '_blank' : undefined}
      rel="noreferrer"
    >
      {children}
    </Proxy>
  );
};

export default Link;
