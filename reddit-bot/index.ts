import { listenToContent, postReply } from '@/reddit';
import { getRedditCredentials } from '@/utils/env';
import { delay } from '@/utils/promise';
import { loadVocabularyEntry } from 'spelling-ukraine-data';

const submissionSampling = 1;
const commentSampling = 0.75;

const subreddits = ['ukraine', 'ukraina', 'ukraineconflict', 'yurop'];
const entries = ['kyiv', 'lviv', 'kharkiv', 'odesa', 'mykolaiv', 'chornobyl', 'irpin', 'chernihiv'];

const main = async () => {
  console.log('Reddit bot is starting...');

  const me = { username: getRedditCredentials().username };
  console.log('Logged in as:', me.username);

  console.log('Listening to subreddits:', subreddits);

  const vocabulary = await Promise.all(entries.map(async (id) => await loadVocabularyEntry(id)));

  const predicates = vocabulary.flatMap((entry) =>
    entry.incorrectSpellings.flatMap((spelling) => ({ entry, keyword: spelling }))
  );

  console.log(
    'Predicates:',
    predicates.map((predicate) => predicate.keyword)
  );

  let consecutiveReplyFailures = 0;
  await Promise.all(
    subreddits.map(async (subreddit) => {
      await listenToContent(subreddit, async (content) => {
        if (content.author === me.username) {
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

        console.log('Content:', content);
        console.log('Match:', {
          correct: match.entry.correctSpelling,
          incorrect: match.keyword
        });

        try {
          const reply = await postReply(
            content,
            [
              `💡 It's \`${match.entry.correctSpelling}\`, not \`${match.keyword}\`. `,
              `Support Ukraine by using the correct spelling! `,
              `[Learn more](https://spellingukraine.com/i/${match.entry.id})`,
              `\n\n___\n\n`,
              `[^(Why spelling matters)](https://spellingukraine.com) `,
              `^(|) `,
              `[^(Ways to support Ukraine)](https://stand-with-ukraine.pp.ua) `,
              `^(|) `,
              `^(I'm a bot, sorry if I'm missing context) `,
              `^(|) `,
              `[^(Source)](https://github.com/Tyrrrz/SpellingUkraine) `,
              `^(|) `,
              `[^(Author)](https://twitter.com/tyrrrz)`
            ].join('')
          );

          console.log('Reply:', reply);
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

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
