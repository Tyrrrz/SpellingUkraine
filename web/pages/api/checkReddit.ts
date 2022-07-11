import snoowrap from 'snoowrap';
import { loadVocabulary } from 'spelling-ukraine-data';
import { getRedditCredentials } from '../../utils/env';
import { post } from '../../utils/server';

const submissionSampling = 0.85;
const commentSampling = 0.5;

const vocabulary = loadVocabulary().filter((entry) =>
  [
    'kyiv',
    'lviv',
    'kharkiv',
    /*'odesa',*/
    'mykolaiv',
    /*'chornobyl',*/
    'irpin',
    'chernihiv'
  ].includes(entry.id)
);

const predicates = vocabulary.flatMap((entry) =>
  entry.incorrectSpellings.flatMap((spelling) => ({ entry, keyword: spelling }))
);

const findMatch = (text: string) => {
  // Scrub mentions, URLs, block quotes
  const normalizedText = text
    .replace(/\b\/?u\/\w+\b/g, '')
    .replace(/\b\/?r\/\w+\b/g, '')
    .replace(/\b(https?:\/\/)[^\s]*\b/g, '')
    .replace(/^>.*$/gm, '');

  return predicates.find((predicate) => {
    return (
      new RegExp(`\\b${predicate.keyword}\\b`, 'gi').test(normalizedText) &&
      !new RegExp(`\\b${predicate.entry.correctSpelling}\\b`, 'gi').test(normalizedText)
    );
  });
};

// Workaround for https://github.com/not-an-aardvark/snoowrap/issues/221
const unpromise = async <T>(promise: Promise<T>) => {
  const result = await promise;
  return result as Omit<T, 'then' | 'catch' | 'finally'>;
};

const checkSubmissions = async (subreddit: string, after: Date) => {
  const reddit = new snoowrap({
    ...getRedditCredentials(),
    userAgent: 'SpellingUkraine (https://github.com/Tyrrrz/SpellingUkraine)'
  });

  const self = await unpromise(reddit.getMe());

  const submissions = await reddit.getNew(subreddit, { limit: 100 });
  for (const submission of submissions.reverse()) {
    if (submission.author.name === self.name) {
      continue;
    }

    const timestamp = new Date(submission.created_utc * 1000);
    if (timestamp <= after) {
      continue;
    }

    const match = findMatch(submission.title + '\n' + submission.selftext);
    if (!match) {
      continue;
    }

    if (Math.random() > submissionSampling) {
      continue;
    }

    console.log('Match', {
      submission: {
        id: submission.id,
        url: 'https://reddit.com' + submission.permalink,
        title: submission.title,
        text: submission.selftext
      },
      correct: match.entry.correctSpelling,
      incorrect: match.keyword
    });

    console.log('Dry run reply');
    return;

    /*
    await unpromise(
      submission.reply(
        [
          `💡 It's \`${match.entry.correctSpelling}\`, not \`${match.keyword}\`. `,
          `Support Ukraine by using the correct spelling! `,
          `[Learn more](https://spellingukraine.com/i/${match.entry.id}).`,
          `\n\n___\n\n`,
          `[^(Why spelling matters)](https://spellingukraine.com) `,
          `^(|) `,
          `[^(Merch for charity)](https://merch4ukraine.org) `,
          `^(|) `,
          `[^(Stand with Ukraine)](https://stand-with-ukraine.pp.ua) `,
          `^(|) `,
          `^(I'm a bot, sorry if I'm missing context)`
        ].join('')
      )
    );*/
  }
};

const checkComments = async (subreddit: string, after: Date) => {
  const reddit = new snoowrap({
    ...getRedditCredentials(),
    userAgent: 'SpellingUkraine (https://github.com/Tyrrrz/SpellingUkraine)'
  });

  const self = await unpromise(reddit.getMe());

  const comments = await reddit.getNewComments(subreddit, { limit: 100 });
  for (const comment of comments.reverse()) {
    if (comment.author.name === self.name) {
      continue;
    }

    const timestamp = new Date(comment.created_utc * 1000);
    if (timestamp <= after) {
      continue;
    }

    const match = findMatch(comment.body);
    if (!match) {
      continue;
    }

    if (Math.random() > commentSampling) {
      continue;
    }

    console.log('Match', {
      comment: {
        id: comment.id,
        url: 'https://reddit.com' + comment.permalink,
        text: comment.body
      },
      correct: match.entry.correctSpelling,
      incorrect: match.keyword
    });

    console.log('Dry run reply');
    return;

    /*

    await unpromise(
      comment.reply(
        [
          `💡 It's \`${match.entry.correctSpelling}\`, not \`${match.keyword}\`. `,
          `Support Ukraine by using the correct spelling! `,
          `[Learn more](https://spellingukraine.com/i/${match.entry.id}).`,
          `\n\n___\n\n`,
          `[^(Why spelling matters)](https://spellingukraine.com) `,
          `^(|) `,
          `[^(Merch for charity)](https://merch4ukraine.org) `,
          `^(|) `,
          `[^(Stand with Ukraine)](https://stand-with-ukraine.pp.ua) `,
          `^(|) `,
          `^(I'm a bot, sorry if I'm missing context)`
        ].join('')
      )
    );*/
  }
};

const checkRedditEndpoint = post(async (req, res) => {
  const { subreddit, after } = req.body;

  if (!subreddit || typeof subreddit !== 'string') {
    res.status(400).send('Subreddit not provided');
    return;
  }

  if (!after || (typeof after !== 'string' && typeof after !== 'number')) {
    res.status(400).send('After timestamp not provided');
    return;
  }

  console.log('Reddit check requested', {
    subreddit,
    after
  });

  await Promise.allSettled([
    checkSubmissions(subreddit, new Date(typeof after === 'string' ? after : 1000 * after)),
    checkComments(subreddit, new Date(typeof after === 'string' ? after : 1000 * after))
  ]);

  console.log('Reddit check completed');
  res.status(200);
});

export default checkRedditEndpoint;
