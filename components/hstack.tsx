import { Box } from './box';

interface HStackProps {
  align?: 'top' | 'center' | 'bottom';
  gap?: 'small' | 'medium' | 'large';
}

export const HStack: React.FC<HStackProps> = ({ align = 'center', gap = 'small', children }) => {
  return (
    <Box
      classes={[
        'flex',
        'flex-row',
        {
          'items-start': align === 'top',
          'items-center': align === 'center',
          'items-end': align === 'bottom'
        },
        {
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
