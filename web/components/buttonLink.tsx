import c from 'classnames';
import { FC, PropsWithChildren } from 'react';

type ButtonLinkProps = PropsWithChildren<{
  variant?: 'normal' | 'discreet' | 'hidden';
  color?: 'blue' | 'yellow';
  submit?: boolean;
  disabled?: boolean;
  title?: string;
  onClick?: () => void;
}>;

const ButtonLink: FC<ButtonLinkProps> = ({
  variant = 'normal',
  color = 'blue',
  submit = false,
  disabled = false,
  title,
  onClick,
  children
}) => {
  return (
    <button
      type={submit ? 'submit' : 'button'}
      className={c({
        'text-ukraine-blue': variant === 'normal' && color === 'blue',
        'dark:text-blue-300': variant === 'normal' && color === 'blue',
        'text-ukraine-yellow': variant === 'normal' && color === 'yellow',
        'hover:underline': variant === 'normal',
        'hover:text-ukraine-blue': variant === 'discreet' && color === 'blue',
        'dark:hover:text-blue-300': variant === 'discreet' && color === 'blue',
        'hover:text-ukraine-yellow': variant === 'discreet' && color === 'yellow'
      })}
      disabled={disabled}
      title={title}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ButtonLink;
