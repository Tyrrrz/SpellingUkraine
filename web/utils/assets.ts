import { isAbsoluteUrl } from "./url";

export const resolvePath = (path: string) => {
  // Keep non-root-relative paths unchanged
  if (!path.startsWith("/")) {
    return path;
  }

  // Keep absolute URLs and protocol-relative URLs unchanged
  if (isAbsoluteUrl(path) || path.startsWith("//")) {
    return path;
  }

  const baseUrl = import.meta.env.BASE_URL;
  if (baseUrl === "/") {
    return path;
  }

  // Avoid double-prefixing if the path is already base-prefixed
  if (path.startsWith(baseUrl)) {
    return path;
  }

  return baseUrl + path.slice(1);
};

export const resolveAbsoluteUrl = (path: string) => {
  if (isAbsoluteUrl(path) || path.startsWith("//")) {
    return path;
  }

  return new URL(resolvePath(path), import.meta.env.SITE_URL).toString();
};
