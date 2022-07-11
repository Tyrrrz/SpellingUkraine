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

export const getSiteUrl = (path?: string) => {
  const value = process.env.SITE_URL;
  if (!value) {
    throw new Error(`Environment variable 'SITE_URL' is not defined`);
  }

  if (path) {
    return new URL(path, value).toString();
  }

  return value;
};

export const getGoogleAnalyticsId = () => {
  return process.env.GOOGLE_ANALYTICS_ID;
};

export const getRedditCredentials = () => {
  const clientId = process.env.REDDIT_CLIENT_ID;
  if (!clientId) {
    throw new Error(`Environment variable 'REDDIT_CLIENT_ID' is not defined`);
  }

  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  if (!clientSecret) {
    throw new Error(`Environment variable 'REDDIT_CLIENT_SECRET' is not defined`);
  }

  const username = process.env.REDDIT_USERNAME;
  if (!username) {
    throw new Error(`Environment variable 'REDDIT_USERNAME' is not defined`);
  }

  const password = process.env.REDDIT_PASSWORD;
  if (!password) {
    throw new Error(`Environment variable 'REDDIT_PASSWORD' is not defined`);
  }

  return {
    clientId,
    clientSecret,
    username,
    password
  };
};
