import { loadVocabulary, VocabularyEntry } from 'spelling-ukraine-data';
import twitter from './twitter';

// Only include a subset of the vocabulary to reduce tweet volume.
// Also don't include 'ukraine' because 'the ukraine' triggers many false positives.
const vocabulary = loadVocabulary().filter((entry) =>
  ['kyiv', 'lviv', 'odesa', 'mykolaiv', 'chornobyl', 'slava_ukraini', 'heroiam_slava'].includes(
    entry.id
  )
);

const resolveMatch = (entry: VocabularyEntry, text: string) => {
  for (const mistake of entry.mistakes) {
    // Don't trigger if the tweet contains both the correct and the incorrect spelling.
    // If that's the case it's probably another tweet correcting the mistake for us.
    if (
      text.toLowerCase().includes(mistake.toLowerCase()) &&
      !text.toLowerCase().includes(entry.translation.toLowerCase())
    ) {
      return {
        entry,
        mistake
      };
    }
  }

  return null;
};

const formatMatchReply = ({ entry, mistake }: { entry: VocabularyEntry; mistake: string }) => {
  // Include a variety of reply templates to avoid looking like spam
  const replies = [
    [
      `💡 It's "${entry.translation}" and not "${mistake}". `,
      `Support Ukraine by using the correct spelling 🇺🇦`,
      '\n\n',
      `Learn more here: https://spellingukraine.com/i/${entry.id}`
    ].join(''),

    [
      `👋 Hey there! The correct spelling is "${entry.translation}" instead of "${mistake}". `,
      `Language is political, transliterate correctly 🇺🇦`,
      '\n\n',
      `Read more here: https://spellingukraine.com/i/${entry.id}`
    ].join(''),

    [
      `💡 Consider using "${entry.translation}" instead of the outdated "${mistake}". `,
      `Spelling matters 🇺🇦`,
      '\n\n',
      `More about this here: https://spellingukraine.com/i/${entry.id}`
    ].join(''),

    [
      `👀 I noticed you wrote "${mistake}". `,
      `This is an outdated spelling and the preferred one is "${entry.translation}". `,
      'Support Ukrainian language by using the correct transliteration 🇺🇦',
      '\n\n',
      `More info: https://spellingukraine.com/i/${entry.id}`
    ].join(''),

    [
      `👆 It's "${entry.translation}", not "${mistake}". `,
      `Using correct, Ukrainian-based spelling is another way that you can #StandWithUkraine 🇺🇦`,
      '\n\n',
      `Read more: https://spellingukraine.com/i/${entry.id}`
    ].join('')
  ];

  return replies[Math.floor(Math.random() * replies.length)];
};

const main = async () => {
  console.log('Twitter bot is starting...');

  const tweetFilter = [
    'lang:en',
    'sample:5',
    '-is:retweet',
    '-is:quote',
    '-from:SpellingUkraine',
    `(${vocabulary
      .flatMap((entry) => entry.mistakes)
      .map((mistake) => '"' + mistake + '"')
      .join(' OR ')})`
  ].join(' ');

  for await (const tweet of await twitter.stream(tweetFilter)) {
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');

    console.log('Tweet', {
      url: `https://twitter.com/i/web/status/${tweet.data.id}`,
      ...tweet.data
    });

    const match = vocabulary
      .map((entry) => resolveMatch(entry, tweet.data.text))
      .find((match) => !!match);

    if (match) {
      console.log('Matched', {
        mistake: match.mistake,
        correct: match.entry.translation
      });

      const reply = await twitter.reply(tweet.data.id, formatMatchReply(match));

      if (reply) {
        console.log('Reply', reply.data);
      } else {
        console.log('Reply failed');
      }
    } else {
      console.log('No match found');
    }

    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
  }
};

main().catch((err) => console.error('Error', err));
