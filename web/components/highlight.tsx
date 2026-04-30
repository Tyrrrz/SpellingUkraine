import { clsx } from "clsx";
import { FC, PropsWithChildren } from "react";

type HighlightProps = PropsWithChildren<{
  color?: "blue" | "yellow";
}>;

const Highlight: FC<HighlightProps> = ({ color = "blue", children }) => {
  return (
    <div
      className={clsx("w-fit rounded px-2 py-1", {
        "bg-ukraine-blue text-neutral-200": color === "blue",
        "bg-ukraine-yellow dark:text-neutral-900": color === "yellow",
      })}
    >
      {children}
    </div>
  );
};

export default Highlight;
