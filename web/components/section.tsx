import { FC, PropsWithChildren } from "react";

type SectionProps = PropsWithChildren<{
  title: string;
}>;

const Section: FC<SectionProps> = ({ title, children }) => {
  return (
    <div>
      <div className="my-2 flex items-center gap-2">
        <div className="h-px w-5 bg-neutral-400 dark:bg-neutral-600" />
        <div className="text-lg font-light">{title}</div>
        <div className="h-px grow bg-neutral-400 dark:bg-neutral-600" />
      </div>

      <section>{children}</section>
    </div>
  );
};

export default Section;
