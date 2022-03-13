export const getBuildId = () => {
  return process.env.NEXT_PUBLIC_BUILD_ID;
};

export const getSiteUrl = () => {
  return process.env.NEXT_PUBLIC_VERCEL_URL;
};

export const getAbsoluteUrl = (path: string) => {
  const siteUrl = getSiteUrl();

  if (siteUrl) {
    return new URL(path, getSiteUrl()).toString();
  }

  return path;
};
