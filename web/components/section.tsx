import c from 'classnames';
import { FC, PropsWithChildren } from 'react';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

const Section: FC<SectionProps> = ({ title, children }) => {
  return (
    <div>
      <div className={c('flex', 'my-2', 'items-center', 'gap-2')}>
        <div className={c('w-5', 'h-px', 'bg-neutral-400', 'dark:bg-neutral-600')} />
        <div className={c('text-lg', 'font-light')}>{title}</div>
        <div className={c('grow', 'h-px', 'bg-neutral-400', 'dark:bg-neutral-600')} />
      </div>

      <section>{children}</section>
    </div>
  );
};

export default Section;
