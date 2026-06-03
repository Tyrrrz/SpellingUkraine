/**
 * Resolves an asset path by prepending BASE_URL to root-relative paths.
 * Leaves absolute URLs and relative paths unchanged.
 *
 * @param path - The asset path (e.g., "/logo.png", "http://example.com/logo.png", or "logo.png")
 * @returns The resolved path with BASE_URL prepended for root-relative paths
 */
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

/**
 * Converts a potentially relative asset path to an absolute URL for meta tags.
 *
 * @param path - The asset path (e.g., "/logo.png" or "http://example.com/logo.png")
 * @returns An absolute URL suitable for use in meta tags
 */
export function resolveAbsoluteUrl(path: string): string {
  // Already an absolute URL
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Resolve relative/root-relative paths against SITE_URL
  const resolvedPath = resolveAssetPath(path);
  return new URL(resolvedPath, import.meta.env.SITE_URL).toString();
}
