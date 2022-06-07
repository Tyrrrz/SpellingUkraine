import { loadVocabulary } from 'spelling-ukraine-data';
import { listenToContent, postReply } from './reddit';
import { delay } from './utils/promise';

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

const submissionSampling = 0.85;
const commentSampling = 0.5;

const subreddits = ['ukraine', 'ukraina', 'ukrainianconflict', 'ukraineconflict'];

const main = async () => {
  console.log('Reddit bot is starting...');

  const predicates = vocabulary.flatMap((entry) =>
    entry.incorrectSpellings.flatMap((spelling) => ({ entry, keyword: spelling }))
  );

  console.log('Listening to subreddits', subreddits);

  let consecutiveReplyFailures = 0;
  await Promise.all(
    subreddits.map(async (subreddit) => {
      // Random stagger to avoid hitting the API for each subreddit at the same time
      await delay(60 * Math.random() * 1000);

      await listenToContent(subreddit, async (content) => {
        if (content.author === 'SpellingUkraine') {
          return;
        }

        const titleNormalized = content.kind === 'submission' ? content.title : '';

        // Scrub mentions, URLs, block quotes
        const textNormalized = content.text
          .replace(/\b\/?u\/\w+\b/g, '')
          .replace(/\b\/?r\/\w+\b/g, '')
          .replace(/\b(https?:\/\/)[^\s]*\b/g, '')
          .replace(/^>.*$/gm, '');

        const match = predicates.find((predicate) => {
          const keywordPattern = new RegExp(`\\b${predicate.keyword}\\b`, 'gi');

          const correctSpellingPattern = new RegExp(
            `\\b${predicate.entry.correctSpelling}\\b`,
            'gi'
          );

          return (
            (keywordPattern.test(titleNormalized) &&
              !correctSpellingPattern.test(titleNormalized)) ||
            (keywordPattern.test(textNormalized) && !correctSpellingPattern.test(textNormalized))
          );
        });

        if (!match) {
          return;
        }

        const sampling = content.kind === 'submission' ? submissionSampling : commentSampling;
        if (Math.random() > sampling) {
          return;
        }

        console.log('Content', content);
        console.log('Match', {
          correct: match.entry.correctSpelling,
          incorrect: match.keyword
        });

        try {
          const reply = await postReply(
            content,
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
          await delay(5 * 60 * 1000); // 5 minutes
        }
      });
    })
  );
};

main().catch((err) => console.error('Error', err));
