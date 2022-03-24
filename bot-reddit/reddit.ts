import snoowrap from 'snoowrap';
import { getRedditCredentials } from './utils/env';
import { delay } from './utils/promise';

const reddit = new snoowrap({
  ...getRedditCredentials(),
  userAgent: 'SpellingUkraine Bot (https://github.com/Tyrrrz/SpellingUkraine)'
});

reddit.config({ proxies: false });

interface Comment {
  id: string;
  url: string;
  author: string;
  text: string;
}

export const listenToComments = async (
  subreddits: string[],
  callback: (comment: Comment) => Promise<void> | void
) => {
  // Only yield comments created after this function was called
  const startTimestamp = new Date();

  await Promise.all(
    subreddits.map(async (subreddit) => {
      let after = '';

      while (true) {
        const comments = await reddit.getNewComments(subreddit, {
          // Request only 1 comment on the initial iteration just to get the after value
          limit: after ? 100 : 1,
          after
        });

        for (const comment of comments.reverse()) {
          const timestamp = new Date(comment.created_utc * 1000);
          if (timestamp <= startTimestamp) {
            continue;
          }

          await callback({
            id: comment.id,
            url: 'https://reddit.com' + comment.permalink,
            author: comment.author.name,
            text: comment.body
          });

          after = comment.name;
        }

        // Request new content every 5 minutes
        await delay(5 * 60 * 1000);
      }
    })
  );
};

export const postReply = async (commentId: string, text: string) => {
  /// @ts-expect-error (https://github.com/not-an-aardvark/snoowrap/issues/221)
  const comment: snoowrap.Comment = await reddit.getComment(commentId);

  /// @ts-expect-error (https://github.com/not-an-aardvark/snoowrap/issues/221)
  const reply: snoowrap.Comment = await comment.reply(text);

  const result: Comment = {
    id: reply.id,
    url: 'https://reddit.com' + reply.permalink,
    author: reply.author.name,
    text: reply.body
  };

  return result;
};
