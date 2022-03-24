export const getRedditCredentials = () => {
  const clientId = process.env.REDDIT_APP_KEY;
  const clientSecret = process.env.REDDIT_APP_SECRET;
  const username = process.env.REDDIT_ACCESS_TOKEN;
  const password = process.env.REDDIT_ACCESS_SECRET;

  if (!clientId || !clientSecret || !username || !password) {
    throw new Error('Reddit credentials are missing');
  }

  return {
    clientId,
    clientSecret,
    username,
    password
  };
};
