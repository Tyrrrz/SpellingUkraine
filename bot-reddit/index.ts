import { loadVocabulary } from 'spelling-ukraine-data';
import { listenToComments, postReply } from './reddit';
import { delay } from './utils/promise';

const vocabulary = loadVocabulary().filter((entry) =>
  ['kyiv', 'lviv', 'kharkiv', 'odesa', 'mykolaiv', 'chornobyl', 'irpin'].includes(entry.id)
);

const sampling = 1;

const subreddits = [
  'ukraine',
  'ukraina',
  'ukraineisverybadass',
  'ukrainianconflict',
  'ukraineconflict',
  '2russophobic4you',
  'europe',
  'yurop',
  'news',
  'worldnews',
  'politics',
  'war',
  'pics',
  'interesting',
  'damnthatsinteresting',
  'thatsinsane'
];

const main = async () => {
  console.log('Reddit bot is starting...');

  const predicates = vocabulary.flatMap((entry) =>
    entry.incorrectSpellings.flatMap((spelling) => ({ entry, keyword: spelling }))
  );

  console.log('Listening to comments', subreddits);

  let consecutiveReplyFailures = 0;
  await listenToComments(subreddits, async (comment) => {
    if (comment.author === 'SpellingUkraine') {
      return;
    }

    // Lowercase, remove u/foo and r/bar mentions
    const textNormalized = comment.text
      .replace(/\b\/?u\/\w+\b/g, '')
      .replace(/\b\/?r\/\w+\b/g, '')
      .toLowerCase();

    const match = predicates.find(
      (predicate) =>
        textNormalized.includes(predicate.keyword.toLowerCase()) &&
        !textNormalized.includes(predicate.entry.correctSpelling.toLowerCase())
    );

    if (!match) {
      return;
    }

    if (Math.random() > sampling) {
      return;
    }

    console.log('Comment', comment);
    console.log('Match', {
      correct: match.entry.correctSpelling,
      incorrect: match.keyword
    });

    try {
      const reply = await postReply(
        comment.id,
        [
          `💡 It's \`${match.entry.correctSpelling}\`, not \`${match.keyword}\`. `,
          `Support Ukraine by using the correct spelling! `,
          `[Learn more](https://spellingukraine.com/i/${match.entry.id}).`,
          `\n\n`,
          `^(Beep boop I'm a bot)`
        ].join('')
      );

      console.log('Reply', reply);
      consecutiveReplyFailures = 0;
    } catch (err) {
      // Replies may fail for various reasons, but not consistently.
      // Throw if we have too many consecutive failures.
      if (++consecutiveReplyFailures >= 5) {
        throw err;
      }

      console.log(`Reply failure (${consecutiveReplyFailures})`, err);
      await delay(1 * 60 * 1000); // 1 minute
    }

    console.log('\n');
  });
};

main().catch((err) => console.error('Error', err));
