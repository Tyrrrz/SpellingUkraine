import classNames from 'classnames';

interface HStackProps {
  spacing?: number;
}

export const HStack: React.FC<HStackProps> = ({ spacing = 1, children }) => {
  return (
    <div className={classNames(['flex', 'flex-row', 'items-center', `gap-x-${spacing}`])}>
      {children}
    </div>
  );
};
