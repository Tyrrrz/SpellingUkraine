import classNames from 'classnames';
import NextLink from 'next/link';

interface LinkProps {
  href: string;
  block?: boolean;
  emphasize?: boolean;
}

const Link: React.FC<LinkProps> = ({
  href,
  block = false,
  emphasize = true,
  children,
  ...props
}) => {
  const isAbsolute = /^[a-z][a-z\d+\-.]*:/iu.test(href);

  const className = classNames('hover:text-blue-500', {
    'inline-block': !block,
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
