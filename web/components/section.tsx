import { FC, PropsWithChildren } from 'react';
import Box from './box';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

const Section: FC<SectionProps> = ({ title, children }) => {
  return (
    <Box>
      <Box classes={['flex', 'my-2', 'items-center', 'gap-2']}>
        <Box classes={['w-5', 'h-px', 'bg-neutral-400']} />
        <Box classes={['text-lg', 'font-light']}>{title}</Box>
        <Box classes={['grow', 'h-px', 'bg-neutral-400']} />
      </Box>

      <Box>{children}</Box>
    </Box>
  );
};

export default Section;
