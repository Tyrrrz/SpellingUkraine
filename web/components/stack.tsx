import Box from './box';

interface StackProps {
  orientation?: 'horizontal' | 'vertical';
  wrap?: boolean;
  align?: 'top' | 'center' | 'bottom';
  gap?: 'small' | 'medium' | 'large';
  children?: React.ReactNode;
}

const Stack: React.FC<StackProps> = ({
  orientation = 'vertical',
  wrap = false,
  align = 'center',
  gap = 'small',
  children
}) => {
  return (
    <Box
      classes={[
        'flex',
        {
          'flex-row': orientation === 'horizontal',
          'flex-col': orientation === 'vertical',
          'flex-wrap': wrap,
          'items-start': align === 'top',
          'items-center': align === 'center',
          'items-end': align === 'bottom',
          'gap-1': gap === 'small',
          'gap-2': gap === 'medium',
          'gap-3': gap === 'large'
        }
      ]}
    >
      {children}
    </Box>
  );
};

export default Stack;
