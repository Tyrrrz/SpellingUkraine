import Box from './box';

const Paper: React.FC = ({ children }) => {
  return (
    <Box classes={['p-4', 'border-2', 'border-neutral-400', 'rounded', 'bg-neutral-100']}>
      {children}
    </Box>
  );
};

export default Paper;
