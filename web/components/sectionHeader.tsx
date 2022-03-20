import Box from './box';

const SectionHeader: React.FC = ({ children }) => {
  return (
    <>
      <Box classes={['flex', 'my-2', 'items-center', 'gap-2', 'text-lg', 'font-light']}>
        <Box classes={['w-5', 'h-px', 'bg-neutral-400']} />

        {children}

        <Box classes={['flex-grow', 'h-px', 'bg-neutral-400']} />
      </Box>
    </>
  );
};

export default SectionHeader;
