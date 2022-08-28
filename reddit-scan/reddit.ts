import snoowrap from 'snoowrap';

type RedditCredentials = {
  clientId?: string;
  clientSecret?: string;
  username?: string;
  password?: string;
};

type Submission = {
  kind: 'submission';
  id: string;
  url: string;
  author: string;
  title: string;
  text: string;
};

type Comment = {
  kind: 'comment';
  id: string;
  url: string;
  author: string;
  text: string;
};

// Workaround for https://github.com/not-an-aardvark/snoowrap/issues/221
const unpromise = async <T>(promise: Promise<T>) => {
  const result = await promise;
  return result as Omit<T, 'then' | 'catch' | 'finally'>;
};

const createClient = (credentials: RedditCredentials) => {
  const reddit = new snoowrap({
    ...credentials,
    userAgent: 'SpellingUkraine Bot (https://github.com/Tyrrrz/SpellingUkraine)'
  });

  reddit.config({
    proxies: false,
    requestDelay: 1000,
    continueAfterRatelimitError: true
  });

  const getMe = async () => await unpromise(reddit.getMe());

  const getLatestSubmissions = async function* (subreddit: string, after: Date, before: Date) {
    let anchor = after;

    while (true) {
      const items = await reddit.getNew(subreddit, { limit: 100 });
      if (items.length === 0) {
        break;
      }

      for (const item of items.reverse()) {
        const timestamp = new Date(item.created_utc * 1000);

        if (timestamp <= anchor) {
          continue;
        }

        if (timestamp > before) {
          return;
        }

        const submission: Submission = {
          kind: 'submission',
          id: item.id,
          url: 'https://reddit.com' + item.permalink,
          author: item.author.name,
          title: item.title,
          text: item.selftext
        };

        yield submission;

        anchor = timestamp;
      }
    }
  };

  const getLatestComments = async function* (subreddit: string, after: Date, before: Date) {
    let anchor = after;

    while (true) {
      const items = await reddit.getNewComments(subreddit, { limit: 100 });
      if (items.length === 0) {
        break;
      }

      for (const item of items.reverse()) {
        const timestamp = new Date(item.created_utc * 1000);

        if (timestamp <= anchor) {
          continue;
        }

        if (timestamp > before) {
          return;
        }

        const comment: Comment = {
          kind: 'comment',
          id: item.id,
          url: 'https://reddit.com' + item.permalink,
          author: item.author.name,
          text: item.body
        };

        yield comment;

        anchor = timestamp;
      }
    }
  };

  const getLatestPosts = async function* (subreddit: string, after: Date, before: Date) {
    yield* getLatestSubmissions(subreddit, after, before);
    yield* getLatestComments(subreddit, after, before);
  };

  const postReply = async (content: Submission | Comment, text: string) => {
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
      author: reply.author.name,
      text
    };

    return result;
  };

  return {
    getMe,
    getLatestSubmissions,
    getLatestComments,
    getLatestPosts,
    postReply
  };
};

export default createClient;
