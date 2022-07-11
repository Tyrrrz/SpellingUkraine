export const getRedditCredentials = () => {
  const clientId = process.env.REDDIT_APP_KEY;
  if (!clientId) {
    throw new Error(`Environment variable 'REDDIT_APP_KEY' is not defined`);
  }

  const clientSecret = process.env.REDDIT_APP_SECRET;
  if (!clientSecret) {
    throw new Error(`Environment variable 'REDDIT_APP_SECRET' is not defined`);
  }

  const username = process.env.REDDIT_ACCESS_TOKEN;
  if (!username) {
    throw new Error(`Environment variable 'REDDIT_ACCESS_TOKEN' is not defined`);
  }

  const password = process.env.REDDIT_ACCESS_SECRET;
  if (!password) {
    throw new Error(`Environment variable 'REDDIT_ACCESS_SECRET' is not defined`);
  }

  return {
    clientId,
    clientSecret,
    username,
    password
  };
};
