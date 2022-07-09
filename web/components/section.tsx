import { FC, ReactNode } from 'react';
import Box from './box';

interface SectionProps {
  title: string;
  children?: ReactNode;
}

const Section: FC<SectionProps> = ({ title, children }) => {
  return (
    <Box>
      <Box classes={['flex', 'my-2', 'items-center', 'gap-2', 'text-lg', 'font-light']}>
        <Box classes={['w-5', 'h-px', 'bg-neutral-400']} />

        <Box>{title}</Box>

        <Box classes={['flex-grow', 'h-px', 'bg-neutral-400']} />
      </Box>

      <Box>{children}</Box>
    </Box>
  );
};

export default Section;
