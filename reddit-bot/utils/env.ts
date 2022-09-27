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
