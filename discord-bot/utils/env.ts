export const getDiscordCredentials = () => {
  const token = process.env.DISCORD_TOKEN;
  if (!token) {
    throw new Error(`Environment variable 'DISCORD_TOKEN' is not defined`);
  }

  return {
    token
  };
};
