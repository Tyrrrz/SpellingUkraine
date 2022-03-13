import classNames from 'classnames';
import LocalLink from 'next/link';

interface LinkProps {
  href: string;
  emphasize?: boolean;
}

export const Link: React.FC<LinkProps> = ({ href, emphasize = true, children, ...props }) => {
  const isAbsolute = /^[a-z][a-z\d+\-.]*:/iu.test(href);

  const className = classNames('hover:text-blue-500', { 'font-semibold': emphasize });

  if (isAbsolute) {
    return (
      <a {...props} className={className} href={href} target="_blank" rel="noreferrer">
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
