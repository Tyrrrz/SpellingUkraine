import classNames from 'classnames';

interface HStackProps {
  gap?: 'small' | 'medium' | 'large';
}

export const HStack: React.FC<HStackProps> = ({ gap, children }) => {
  const className = classNames([
    'flex',
    'flex-row',
    'items-center',
    {
      'gap-1': !gap || gap === 'small',
      'gap-2': gap === 'medium',
      'gap-3': gap === 'large'
    }
  ]);

  return <div className={className}>{children}</div>;
};
