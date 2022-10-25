import { isAbsoluteUrl } from '@/utils/url';
import c from 'classnames';
import NextLink from 'next/link';
import { FC, PropsWithChildren } from 'react';

type LinkProps = PropsWithChildren<{
  href: string;
  external?: boolean;
  variant?: 'normal' | 'discreet' | 'hidden';
  color?: 'blue' | 'yellow';
}>;

const Link: FC<LinkProps> = ({
  href,
  external = isAbsoluteUrl(href),
  variant = 'normal',
  color = 'blue',
  children
}) => {
  const RawLink = external ? 'a' : NextLink;

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
      target={external ? '_blank' : undefined}
      rel="noreferrer"
    >
      {children}
    </RawLink>
  );
};

export default Link;
