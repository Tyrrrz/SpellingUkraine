import { loadVocabularyEntry } from 'spelling-ukraine-data';
import { getMe, listen, reply } from '~/discord';
import { delay } from '~/utils/promise';

const sampling = 1;
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

const main = async () => {
  console.log('Discord bot is starting...');

  const me = await getMe();
  console.log('Logged in as:', me.name);

  const vocabulary = await Promise.all(entries.map(async (id) => await loadVocabularyEntry(id)));
  const predicates = vocabulary.flatMap((entry) =>
    entry.incorrectSpellings.flatMap((spelling) => ({ entry, keyword: spelling }))
  );

  console.log(
    'Predicates:',
    predicates.map((predicate) => predicate.keyword)
  );

  console.log('Listening to messages...');

  let consecutiveReplyFailures = 0;
  await listen(async (message) => {
    if (message.author.id === me.id) {
      return;
    }

    // Scrub mentions, URLs, block quotes
    const textNormalized = message.text
      .replace(/\b(https?:\/\/)[^\s]*\b/g, '')
      .replace(/^>.*$/gm, '');

    const match = predicates.find(
      (predicate) =>
        new RegExp(`\\b${predicate.keyword}\\b`, 'gi').test(textNormalized) &&
        !new RegExp(`\\b${predicate.entry.correctSpelling}\\b`, 'gi').test(textNormalized)
    );

    if (!match) {
      return;
    }

    if (Math.random() > sampling) {
      return;
    }

    console.log('Message:', message);
    console.log('Match:', {
      correct: match.entry.correctSpelling,
      incorrect: match.keyword
    });

    try {
      const replyMessage = await reply(
        message,
        [
          `💡 It's \`${match.entry.correctSpelling}\`, not \`${match.keyword}\`. `,
          `Support Ukraine by using the correct spelling!`,
          '\n\n',
          `Learn more: https://spellingukraine.com/i/${match.entry.id}`
        ].join('')
      );

      console.log('Reply message:', replyMessage);
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
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
