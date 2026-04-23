export const getEnvironment = () => {
  return process.env.NODE_ENV;
};

export const isProduction = () => {
  return getEnvironment() === 'production';
};

export const getBuildId = () => process.env.BUILD_ID || 'unknown_build_id';

export const getSiteUrl = (path?: string) => {
  const value = process.env.SITE_URL || 'http://localhost:3000';

  if (path) {
    return new URL(path, value).toString();
  }

  return value;
};
