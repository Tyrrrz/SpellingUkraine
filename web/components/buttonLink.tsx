import classNames from 'classnames';
import { FC, MouseEventHandler, PropsWithChildren } from 'react';

type ButtonLinkProps = PropsWithChildren<{
  onClick: MouseEventHandler<HTMLButtonElement>;
}>;

const ButtonLink: FC<ButtonLinkProps> = ({ onClick, children }) => {
  return (
    <button className={classNames('text-ukraine-blue', 'hover:underline')} onClick={onClick}>
      {children}
    </button>
  );
};

export default ButtonLink;
