export const getEnvironment = () => {
  return process.env.NODE_ENV;
};

export const isProduction = () => {
  return getEnvironment() === 'production';
};

export const getBuildId = () => {
  const value = process.env.BUILD_ID;
  if (!value) {
    throw new Error(`Environment variable 'BUILD_ID' is not defined`);
  }

  return value;
};

export const getSiteUrl = () => {
  const value = process.env.SITE_URL;
  if (!value) {
    throw new Error(`Environment variable 'SITE_URL' is not defined`);
  }

  return value;
};

export const getAbsoluteUrl = (path: string) => {
  return new URL(path, getSiteUrl()).toString();
};

export const getGoogleAnalyticsId = () => {
  return process.env.GOOGLE_ANALYTICS_ID;
};
