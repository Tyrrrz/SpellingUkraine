import classNames from 'classnames';
import LocalLink from 'next/link';

interface LinkProps {
  href: string;
}

export const Link: React.FC<LinkProps> = ({ href, children, ...props }) => {
  const isAbsolute = /^[a-z][a-z\d+\-.]*:/iu.test(href);

  const className = classNames(['hover:text-blue-500']);

  if (isAbsolute) {
    return (
      <a {...props} className={className} href={href}>
        {children}
      </a>
    );
  } else {
    return (
      <LocalLink href={href} passHref>
        <a {...props} className={className}>
          {children}
        </a>
      </LocalLink>
    );
  }
};
