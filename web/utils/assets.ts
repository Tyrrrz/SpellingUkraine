export function resolveAssetPath(path: string): string {
  // Leave absolute URLs unchanged
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Prepend BASE_URL to root-relative paths
  if (path.startsWith("/")) {
    return import.meta.env.BASE_URL + path.slice(1);
  }

  // Leave relative paths unchanged
  return path;
}

export function resolveAbsoluteUrl(path: string): string {
  // Already an absolute URL
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Resolve relative/root-relative paths against SITE_URL
  const resolvedPath = resolveAssetPath(path);
  return new URL(resolvedPath, import.meta.env.SITE_URL).toString();
}
