export const getTwitterCredentials = () => {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;
  if (!bearerToken) {
    throw new Error(`Environment variable 'TWITTER_BEARER_TOKEN' is not defined`);
  }

  const appKey = process.env.TWITTER_API_KEY;
  if (!appKey) {
    throw new Error(`Environment variable 'TWITTER_API_KEY' is not defined`);
  }

  const appSecret = process.env.TWITTER_API_SECRET;
  if (!appSecret) {
    throw new Error(`Environment variable 'TWITTER_API_SECRET' is not defined`);
  }

  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error(`Environment variable 'TWITTER_ACCESS_TOKEN' is not defined`);
  }

  const accessSecret = process.env.TWITTER_ACCESS_SECRET;
  if (!accessSecret) {
    throw new Error(`Environment variable 'TWITTER_ACCESS_SECRET' is not defined`);
  }

  return {
    bearerToken,
    appKey,
    appSecret,
    accessToken,
    accessSecret
  };
};
