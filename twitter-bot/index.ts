import { loadVocabularyEntry } from 'spelling-ukraine-data';
import { listenToTweets, postReply } from './twitter';
import { delay } from './utils/promise';

const sampling = 0.01;

const main = async () => {
  console.log('Twitter bot is starting...');

  const vocabulary = await Promise.all(
    [
      'kyiv',
      'lviv',
      'kharkiv',
      /*'odesa',*/
      'mykolaiv',
      /*'chornobyl',*/
      'irpin',
      'chernihiv'
    ].map(async (id) => await loadVocabularyEntry(id))
  );

  const predicates = vocabulary.flatMap((entry) =>
    entry.incorrectSpellings.flatMap((spelling) => ({ entry, keyword: spelling }))
  );

  const filters = [
    `lang:en`,
    `sample:${Math.floor(100 * sampling)}`,
    `-is:retweet`,
    `-is:quote`,
    `-from:SpellingUkraine`,
    `(${predicates.map((predicate) => '"' + predicate.keyword + '"').join(' OR ')})`
  ];

  console.log('Listening to tweets', filters);

  let consecutiveReplyFailures = 0;
  await listenToTweets(filters.join(' '), async (tweet) => {
    // Scrub mentions, URLs
    const textNormalized = tweet.text
      .replace(/\b@\w+\b/g, '')
      .replace(/\b(https?:\/\/)[^\s]*\b/g, '');

    const match = predicates.find(
      (predicate) =>
        new RegExp(`\\b${predicate.keyword}\\b`, 'gi').test(textNormalized) &&
        !new RegExp(`\\b${predicate.entry.correctSpelling}\\b`, 'gi').test(textNormalized)
    );

    if (!match) {
      return;
    }

    console.log('Tweet', tweet);
    console.log('Match', {
      correct: match.entry.correctSpelling,
      incorrect: match.keyword
    });

    try {
      const reply = await postReply(
        tweet,
        [
          `💡 It's "${match.entry.correctSpelling}", not "${match.keyword}". `,
          `Support Ukraine by using the correct spelling! 🇺🇦`,
          `\n\n`,
          `Learn more: https://spellingukraine.com/i/${match.entry.id}. `,
          `I'm a bot, sorry if I'm missing context.`
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
  });
};

main().catch((err) => console.error('Error', err));
