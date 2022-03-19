import levenshtein from 'damerau-levenshtein';
import { getVocabulary } from 'spelling-ukraine-data';
import { TwitterApi } from 'twitter-api-v2';

// Streams require app-only authentication
const twitterApp = new TwitterApi(process.env.TWITTER_TOKEN!).readOnly.v2;

// Account-related actions require user-context authentication
const twitterBot = new TwitterApi({
  appKey: process.env.TWITTER_APP_KEY!,
  appSecret: process.env.TWITTER_APP_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!
}).readWrite.v2;

const streamTweets = async (filter: string) => {
  const rules = await twitterApp.streamRules();

  if (rules.data && rules.data.length > 0) {
    await twitterApp.updateStreamRules({
      delete: {
        ids: rules.data.map((rule) => rule.id)
      }
    });
  }

  await twitterApp.updateStreamRules({ add: [{ value: filter }] });

  const stream = await twitterApp.searchStream({
    autoConnect: true
  });

  stream.autoReconnect = true;

  return stream;
};

const main = async () => {
  // Only include a subset of the vocabulary to reduce tweet volume.
  // Also don't include 'ukraine' because 'the ukraine' triggers many false positives.
  const predicates = getVocabulary()
    .filter((entry) =>
      ['kyiv', 'lviv', 'odesa', 'mykolaiv', 'chornobyl', 'slava_ukraini'].includes(entry.id)
    )
    .flatMap((entry) =>
      entry.mistakes.map((mistake) => ({
        entryId: entry.id,
        correct: entry.translation,
        mistake
      }))
    )
    .filter(
      // Only include significant mistakes, to avoid matching on benign typos
      (predicate) =>
        levenshtein(predicate.correct.toLowerCase(), predicate.mistake.toLowerCase()).relative >=
        0.15
    );

  console.log('Predicates', predicates);

  const stream = await streamTweets(
    [
      'lang:en',
      'sample:5',
      '-is:retweet',
      '-is:quote',
      '-from:SpellingUkraine',
      `(${predicates.map((predicate) => '"' + predicate.mistake + '"').join(' OR ')})`
    ].join(' ')
  );

  for await (const tweet of stream) {
    console.log('Tweet', {
      url: `https://twitter.com/i/web/status/${tweet.data.id}`,
      ...tweet.data
    });

    const matchedPredicate = predicates.find((predicate) =>
      tweet.data.text.toLowerCase().includes(predicate.mistake.toLowerCase())
    );

    if (matchedPredicate) {
      console.log('Matched predicate', matchedPredicate);

      // Don't trigger if the tweet contains both the correct and the incorrect spelling.
      // If that's the case it's probably another tweet correcting the mistake for us.
      if (tweet.data.text.toLowerCase().includes(matchedPredicate.correct.toLowerCase())) {
        console.log('Tweet contains both correct and incorrect spelling, skipping');
        continue;
      }

      const reply = await twitterBot.reply(
        [
          `💡 It's "${matchedPredicate.correct}" and not "${matchedPredicate.mistake}". `,
          `Support Ukraine by using the correct spelling! 🇺🇦`,
          '\n\n',
          `Learn more here: https://spellingukraine.com/i/${matchedPredicate.entryId}`
        ].join(''),
        tweet.data.id
      );

      console.log('Reply', reply.data);
    } else {
      console.log('No match found');
    }

    console.log();
  }
};

main().catch((err) => console.error('Error', err));
