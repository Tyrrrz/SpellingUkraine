import { FC, PropsWithChildren } from "react";

type InlineProps = PropsWithChildren;

const Inline: FC<InlineProps> = ({ children }) => {
  return <div className="inline-flex items-center gap-1">{children}</div>;
};

export default Inline;
