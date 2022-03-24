import { TwitterApi } from 'twitter-api-v2';
import { getTwitterCredentials } from './utils/env';

// Streams require app-only authentication
const twitterApp = new TwitterApi(getTwitterCredentials().bearerToken).readOnly.v2;

// Account-related actions require user-context authentication
const twitterBot = new TwitterApi(getTwitterCredentials()).readWrite.v2;

interface Tweet {
  id: string;
  url: string;
  text: string;
}

const getTweetUrl = (id: string) => `https://twitter.com/i/web/status/${id}`;

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

  for await (const item of stream) {
    await callback({
      id: item.data.id,
      url: getTweetUrl(item.data.id),
      text: item.data.text
    });
  }
};

export const postReply = async (tweetId: string, text: string) => {
  const reply = await twitterBot.reply(text, tweetId);

  const result: Tweet = {
    id: reply.data.id,
    url: getTweetUrl(reply.data.id),
    text: reply.data.text
  };

  return result;
};
