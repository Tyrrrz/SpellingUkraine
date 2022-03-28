export const getTwitterCredentials = () => {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;
  const appKey = process.env.TWITTER_APP_KEY;
  const appSecret = process.env.TWITTER_APP_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.TWITTER_ACCESS_SECRET;

  if (!bearerToken || !appKey || !appSecret || !accessToken || !accessSecret) {
    throw new Error('Twitter credentials are missing');
  }

  return {
    bearerToken,
    appKey,
    appSecret,
    accessToken,
    accessSecret
  };
};
