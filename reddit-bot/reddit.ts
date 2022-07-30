import { getRedditCredentials } from '@/utils/env';
import { delay } from '@/utils/promise';
import snoowrap from 'snoowrap';

const reddit = new snoowrap({
  ...getRedditCredentials(),
  userAgent: 'SpellingUkraine Bot (https://github.com/Tyrrrz/SpellingUkraine)'
});

reddit.config({ proxies: false });

// Workaround for https://github.com/not-an-aardvark/snoowrap/issues/221
const unpromise = async <T>(promise: Promise<T>) => {
  const result = await promise;
  return result as Omit<T, 'then' | 'catch' | 'finally'>;
};

export type Submission = {
  kind: 'submission';
  id: string;
  url: string;
  author: string;
  title: string;
  text: string;
};

export type Comment = {
  kind: 'comment';
  id: string;
  url: string;
  author: string;
  text: string;
};

export type Content = Submission | Comment;

export const listenToPosts = async (
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
        author: submission.author.name,
        title: submission.title,
        text: submission.selftext
      });

      anchorTimestamp = timestamp;
    }

    // Request new content with delay
    await delay(1 * 60 * 1000); // 1 minute
  }
};

export const listenToComments = async (
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
        author: comment.author.name,
        text: comment.body
      });

      anchorTimestamp = timestamp;
    }

    // Request new content with delay
    await delay(1 * 60 * 1000); // 1 minute
  }
};

export const listenToContent = async (
  subreddit: string,
  callback: (content: Content) => Promise<void> | void
) => {
  await Promise.all([listenToPosts(subreddit, callback), listenToComments(subreddit, callback)]);
};

export const postReply = async (content: Content, text: string) => {
  const postReplyToSubmission = async ({ id }: Submission) => {
    const submission = await unpromise(reddit.getSubmission(id));
    const { id: replyId } = await unpromise(submission.reply(text));
    return await unpromise(reddit.getComment(replyId));
  };

  const postReplyToComment = async ({ id }: Comment) => {
    const comment = await unpromise(reddit.getComment(id));
    const { id: replyId } = await unpromise(comment.reply(text));
    return await unpromise(reddit.getComment(replyId));
  };

  const reply =
    content.kind === 'submission'
      ? await postReplyToSubmission(content)
      : await postReplyToComment(content);

  const result: Comment = {
    kind: 'comment',
    id: reply.id,
    url: 'https://reddit.com' + reply.permalink,
    author: 'SpellingUkraine',
    text
  };

  return result;
};
