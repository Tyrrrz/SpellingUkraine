import { TwitterApi } from 'twitter-api-v2';
import { getTwitterCredentials } from './utils/env';

// Streams require app-only authentication
const twitterApp = new TwitterApi(getTwitterCredentials().bearerToken).readOnly.v2;

// Account-related actions require user-context authentication
const twitterBot = new TwitterApi(getTwitterCredentials()).readWrite.v2;

export type Tweet = {
  id: string;
  url: string;
  text: string;
};

export const getTweetUrl = (id: string) => `https://twitter.com/i/web/status/${id}`;

export const listenToTweets = async (
  filter: string,
  callback: (tweet: Tweet) => Promise<void> | void
) => {
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

  for await (const { data } of stream) {
    await callback({
      id: data.id,
      url: getTweetUrl(data.id),
      text: data.text
    });
  }
};

export const postReply = async (tweet: Tweet, text: string) => {
  const { data } = await twitterBot.reply(text, tweet.id);

  const reply: Tweet = {
    id: data.id,
    url: getTweetUrl(data.id),
    text: data.text
  };

  return reply;
};
