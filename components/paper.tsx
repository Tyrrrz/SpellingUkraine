import { Box } from './box';

export const Paper: React.FC = ({ children }) => {
  return (
    <Box
      classes={['p-4', 'border-2', 'border-neutral-400', 'rounded', 'bg-neutral-100', 'space-y-4']}
    >
      {children}
    </Box>
  );
};
