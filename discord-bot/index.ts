import { loadVocabularyEntry } from 'spelling-ukraine-data';
import { getMe, listen, reply } from '~/discord';
import { retry } from '~/utils/retry';

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

// Keep track of messages that have already been replied to.
// This shouldn't be necessary because our approach involves
// listening to new messages only, but sometimes the API may
// resolve duplicates, so we need to be extra safe to avoid spam.
const repliedMessages = new Set<string>();

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

  await listen(async (message) => {
    if (message.author.id === me.id) {
      return;
    }

    if (repliedMessages.has(message.id)) {
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

    // Don't overflow the cache
    if (repliedMessages.size > 10000) {
      repliedMessages.clear();
    }

    repliedMessages.add(message.id);
  });
};

retry(main, 5, 60000).catch((err) => {
  console.error(err);
  process.exit(1);
});
