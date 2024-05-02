import { loadVocabularyEntry } from 'spelling-ukraine-data';
import { getMe, listen, reply } from '~/reddit';
import { retry } from '~/utils/retry';

const submissionSampling = 1;
const commentSampling = 0.75;
const subreddits = ['ukraine', 'ukraina', 'ukraineconflict', 'yurop'];
const entries = [
  'kyiv',
  'lviv',
  'kharkiv',
  'odesa',
  'mykolaiv',
  'chornobyl',
  'irpin',
  'chernihiv',
  'zaporizhzhia'
];

// Keep track of posts that have already been replied to.
// This shouldn't be necessary because our approach involves
// listening to new posts only, but sometimes the API may
// resolve duplicates, so we need to be extra safe to avoid spam.
const repliedPosts = new Set<string>();

const main = async () => {
  console.log('Reddit bot is starting...');

  const me = await getMe();
  console.log('Logged in as:', me.name);
  console.log('Listening to subreddits:', subreddits);

  const vocabulary = await Promise.all(entries.map(async (id) => await loadVocabularyEntry(id)));
  const predicates = vocabulary.flatMap((entry) =>
    entry.incorrectSpellings.flatMap((spelling) => ({ entry, keyword: spelling }))
  );

  console.log(
    'Predicates:',
    predicates.map((predicate) => predicate.keyword)
  );

  await listen(subreddits, async (post) => {
    if (post.author.name === me.name) {
      return;
    }

    if (repliedPosts.has(post.id)) {
      return;
    }

    const titleNormalized = post.kind === 'submission' ? post.title : '';

    // Scrub mentions, URLs, block quotes
    const textNormalized = post.text
      .replace(/\b\/?u\/\w+\b/g, '')
      .replace(/\b\/?r\/\w+\b/g, '')
      .replace(/\b(https?:\/\/)[^\s]*\b/g, '')
      .replace(/^>.*$/gm, '');

    const match = predicates.find((predicate) => {
      const keywordPattern = new RegExp(`\\b${predicate.keyword}\\b`, 'gi');

      const correctSpellingPattern = new RegExp(`\\b${predicate.entry.correctSpelling}\\b`, 'gi');

      return (
        (keywordPattern.test(titleNormalized) && !correctSpellingPattern.test(titleNormalized)) ||
        (keywordPattern.test(textNormalized) && !correctSpellingPattern.test(textNormalized))
      );
    });

    if (!match) {
      return;
    }

    const sampling = post.kind === 'submission' ? submissionSampling : commentSampling;
    if (Math.random() > sampling) {
      return;
    }

    console.log('Post:', post);
    console.log('Match:', {
      correct: match.entry.correctSpelling,
      incorrect: match.keyword
    });

    const replyPost = await reply(
      post,
      [
        `💡 It's \`${match.entry.correctSpelling}\`, not \`${match.keyword}\`. `,
        `Support Ukraine by using the correct spelling! `,
        `[Learn more](https://spellingukraine.com/i/${match.entry.id})`,
        `\n\n___\n\n`,
        `[^(Why spelling matters)](https://spellingukraine.com) `,
        `^(|) `,
        `[^(Ways to support Ukraine)](https://tyrrrz.me/ukraine) `,
        `^(|) `,
        `^(I'm a bot, sorry if I'm missing context) `,
        `^(|) `,
        `[^(Source)](https://github.com/Tyrrrz/SpellingUkraine) `,
        `^(|) `,
        `[^(Author)](https://twitter.com/tyrrrz)`
      ].join('')
    );

    console.log('Reply post:', replyPost);

    // Don't overflow the cache
    if (repliedPosts.size > 10000) {
      repliedPosts.clear();
    }

    repliedPosts.add(post.id);
  });
};

retry(main, 5, 60000).catch((err) => {
  console.error(err);
  process.exit(1);
});
