import classNames from 'classnames';

export const HStack: React.FC = ({ children }) => {
  return (
    <div className={classNames(['flex', 'flex-row', 'items-center', 'gap-x-1'])}>{children}</div>
  );
};
