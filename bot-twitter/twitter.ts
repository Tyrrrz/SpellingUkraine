import { ApiResponseError, TwitterApi } from 'twitter-api-v2';
import { getTwitterCredentials } from './utils/env';

// Streams require app-only authentication
const twitterApp = new TwitterApi(getTwitterCredentials().bearerToken).readOnly.v2;

// Account-related actions require user-context authentication
const twitterBot = new TwitterApi(getTwitterCredentials()).readWrite.v2;

const stream = async (filter: string) => {
  const rules = await twitterApp.streamRules();

  if (rules.data && rules.data.length > 0) {
    await twitterApp.updateStreamRules({
      delete: {
        ids: rules.data.map((rule) => rule.id)
      }
    });
  }

  await twitterApp.updateStreamRules({ add: [{ value: filter }] });

  const stream = await twitterApp.searchStream({
    autoConnect: true
  });

  stream.autoReconnect = true;

  return stream;
};

const reply = async (tweetId: string, text: string) => {
  try {
  return await twitterBot.reply(text, tweetId);
  } catch (err) {
    const apiError = err as ApiResponseError;

    // Skip failures due to privacy settings
    if (apiError.data.detail?.includes('You are not allowed to reply to this Tweet')) {
      return null;
    }

    throw err;
  }
};

export default { stream, reply };
