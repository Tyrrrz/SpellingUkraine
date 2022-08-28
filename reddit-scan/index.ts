import createRedditClient from '@/reddit';
import { array, command, flag, multioption, number, option, run, string } from 'cmd-ts';
import { loadVocabularyEntry } from 'spelling-ukraine-data';

const app = command({
  name: 'spelling-ukraine-reddit-scan',

  args: {
    clientId: option({ long: 'client-id', description: 'Reddit client ID' }),
    clientSecret: option({ long: 'client-secret', description: 'Reddit client secret' }),
    username: option({ long: 'username', description: 'Reddit username' }),
    password: option({ long: 'password', description: 'Reddit password' }),
    subreddits: multioption({
      long: 'sub',
      description: 'Subreddits to scan',
      type: array(string)
    }),
    entryIds: multioption({
      long: 'entry',
      description: 'Vocabulary entries to check',
      type: array(string)
    }),
    interval: option({
      long: 'interval',
      description: 'Lookbehind interval (seconds)',
      type: number,
      defaultValue: () => 600
    }),
    submissionSampling: option({
      long: 'submission-sampling',
      description: 'Sampling rate for submissions',
      type: number,
      defaultValue: () => 0.85
    }),
    commentSampling: option({
      long: 'comment-sampling',
      description: 'Sampling rate for comments',
      type: number,
      defaultValue: () => 0.5
    }),
    dryRun: flag({
      long: 'dry-run',
      description: 'If set, no replies will be actually sent'
    })
  },

  handler: async ({
    clientId,
    clientSecret,
    username,
    password,
    subreddits,
    entryIds,
    interval,
    submissionSampling,
    commentSampling,
    dryRun
  }) => {
    console.log('Subreddits:', subreddits);
    console.log('Vocabulary:', entryIds);
    console.log('Submission sampling:', submissionSampling);
    console.log('Comment sampling:', commentSampling);
    console.log('Dry run:', dryRun);

    const before = new Date();
    const after = new Date(before.getTime() - interval * 1000);
    console.log('Scanning for messages in range:', { after, before });

    const vocabulary = await Promise.all(entryIds.map(async (id) => await loadVocabularyEntry(id)));

    const predicates = vocabulary.flatMap((entry) =>
      entry.incorrectSpellings.flatMap((spelling) => ({ entry, keyword: spelling }))
    );

    const reddit = createRedditClient({ clientId, clientSecret, username, password });

    const me = await reddit.getMe();
    console.log('Logged in as:', me.name);

    let postsProcessed = 0;
    let postsRepliedTo = 0;

    console.log('Scanning subreddits...');
    await Promise.all(
      subreddits.map(async (subreddit) => {
        for await (const post of reddit.getLatestPosts(subreddit, after, before)) {
          try {
            console.log('Post', { id: post.id, timestamp: post.timestamp });

            if (post.author === me.name) {
              continue;
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

              const correctSpellingPattern = new RegExp(
                `\\b${predicate.entry.correctSpelling}\\b`,
                'gi'
              );

              return (
                (keywordPattern.test(titleNormalized) &&
                  !correctSpellingPattern.test(titleNormalized)) ||
                (keywordPattern.test(textNormalized) &&
                  !correctSpellingPattern.test(textNormalized))
              );
            });

            if (!match) {
              continue;
            }

            const sampling = post.kind === 'submission' ? submissionSampling : commentSampling;
            if (Math.random() > sampling) {
              continue;
            }

            console.log('Content:', post);
            console.log('Match:', {
              correct: match.entry.correctSpelling,
              incorrect: match.keyword
            });

            if (!dryRun) {
              const reply = await reddit.postReply(
                post,
                [
                  `💡 It's \`${match.entry.correctSpelling}\`, not \`${match.keyword}\`. `,
                  `Support Ukraine by using the correct spelling! `,
                  `[Learn more](https://spellingukraine.com/i/${match.entry.id}).`,
                  `\n\n___\n\n`,
                  `[^(Why spelling matters)](https://spellingukraine.com) `,
                  `^(|) `,
                  `[^(Stand with Ukraine)](https://stand-with-ukraine.pp.ua) `,
                  `^(|) `,
                  `^(I'm a bot, sorry if I'm missing context)`
                ].join('')
              );

              console.log('Reply:', reply);
            }

            postsRepliedTo++;
          } finally {
            if (++postsProcessed % 10 === 0) {
              console.log(`Processed ${postsProcessed} posts`);
            }
          }
        }
      })
    );

    console.log('Finished scanning');
    console.log('Posts processed:', postsProcessed);
    console.log('Posts replied to:', postsRepliedTo);
  }
});

run(app, process.argv.slice(2));
