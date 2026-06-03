import { clsx } from "clsx";
import { FC, PropsWithChildren } from "react";
import { Link as RouterLink } from "react-router-dom";
import { isAbsoluteUrl } from "~/utils/url";

type LinkProps = PropsWithChildren<{
  variant?: "normal" | "discreet" | "hidden";
  color?: "blue" | "yellow";
  href: string;
  external?: boolean;
}>;

const Link: FC<LinkProps> = ({
  variant = "normal",
  color = "blue",
  href,
  external = isAbsoluteUrl(href),
  children,
}) => {
  const className = clsx({
    "text-ukraine-blue": variant === "normal" && color === "blue",
    "dark:text-blue-300": variant === "normal" && color === "blue",
    "text-ukraine-yellow": variant === "normal" && color === "yellow",
    "hover:underline": variant === "normal",
    "hover:text-ukraine-blue": variant === "discreet" && color === "blue",
    "dark:hover:text-blue-300": variant === "discreet" && color === "blue",
    "hover:text-ukraine-yellow": variant === "discreet" && color === "yellow",
  });

  if (external) {
    return (
      <a className={className} href={href} target="_blank" rel="noreferrer noopener">
        {children}
      </a>
    );
  }

  return (
    <RouterLink className={className} to={href}>
      {children}
    </RouterLink>
  );
};

export default Link;
