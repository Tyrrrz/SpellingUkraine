import snoowrap from 'snoowrap';
import { getRedditCredentials } from '~/utils/env';

type User = {
  name: string;
};

type Submission = {
  kind: 'submission';
  id: string;
  url: string;
  author: User;
  title: string;
  text: string;
};

type Comment = {
  kind: 'comment';
  id: string;
  url: string;
  author: User;
  text: string;
};

type Post = Submission | Comment;

const reddit = new snoowrap({
  ...getRedditCredentials(),
  userAgent: 'SpellingUkraine Bot (https://github.com/Tyrrrz/SpellingUkraine)'
});

reddit.config({
  proxies: false,
  requestDelay: 1000,
  continueAfterRatelimitError: true
});

// Workaround for https://github.com/not-an-aardvark/snoowrap/issues/221
const unpromise = async <T>(promise: Promise<T>) => {
  const result = await promise;
  return result as Omit<T, 'then' | 'catch' | 'finally'>;
};

export const getMe = async () => {
  const user: User = {
    name: getRedditCredentials().username
  };

  return user;
};

export const listen = async (
  subreddits: string[],
  callback: (post: Post) => Promise<void> | void
) => {
  const listenToPosts = async (
    subreddit: string,
    callback: (post: Submission) => Promise<void> | void
  ) => {
    let anchorTimestamp = new Date();

    while (true) {
      const submissions = await reddit.getNew(subreddit, { limit: 100 });

      for (const submission of submissions.reverse()) {
        const timestamp = new Date(submission.created_utc * 1000);
        if (timestamp <= anchorTimestamp) {
          continue;
        }

        await callback({
          kind: 'submission',
          id: submission.id,
          url: 'https://reddit.com' + submission.permalink,
          author: {
            name: submission.author.name
          },
          title: submission.title,
          text: submission.selftext
        });

        anchorTimestamp = timestamp;
      }
    }
  };

  const listenToComments = async (
    subreddit: string,
    callback: (comment: Comment) => Promise<void> | void
  ) => {
    let anchorTimestamp = new Date();

    while (true) {
      const comments = await reddit.getNewComments(subreddit, { limit: 100 });

      for (const comment of comments.reverse()) {
        const timestamp = new Date(comment.created_utc * 1000);
        if (timestamp <= anchorTimestamp) {
          continue;
        }

        await callback({
          kind: 'comment',
          id: comment.id,
          url: 'https://reddit.com' + comment.permalink,
          author: {
            name: comment.author.name
          },
          text: comment.body
        });

        anchorTimestamp = timestamp;
      }
    }
  };

  await Promise.all(
    subreddits.flatMap((subreddit) => {
      return [listenToPosts(subreddit, callback), listenToComments(subreddit, callback)];
    })
  );
};

export const reply = async (post: Post, text: string) => {
  const replyToSubmission = async ({ id }: Submission) => {
    const submission = await unpromise(reddit.getSubmission(id));
    const { id: replyId } = await unpromise(submission.reply(text));
    return await unpromise(reddit.getComment(replyId));
  };

  const replyToComment = async ({ id }: Comment) => {
    const comment = await unpromise(reddit.getComment(id));
    const { id: replyId } = await unpromise(comment.reply(text));
    return await unpromise(reddit.getComment(replyId));
  };

  const replyPost =
    post.kind === 'submission' ? await replyToSubmission(post) : await replyToComment(post);

  const result: Comment = {
    kind: 'comment',
    id: replyPost.id,
    url: 'https://reddit.com' + replyPost.permalink,
    author: {
      name: replyPost.author?.name
    },
    text
  };

  return result;
};
