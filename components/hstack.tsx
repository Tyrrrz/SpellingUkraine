import { Box } from './box';

interface HStackProps {
  gap?: 'small' | 'medium' | 'large';
}

export const HStack: React.FC<HStackProps> = ({ gap = 'small', children }) => {
  return (
    <Box
      classes={[
        'flex',
        'flex-row',
        'items-center',
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
