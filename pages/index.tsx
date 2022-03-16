import classNames from 'classnames';
import type { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { FiFrown, FiHeart, FiInfo, FiLoader, FiSearch } from 'react-icons/fi';
import { Box } from '../components/box';
import { HStack } from '../components/hstack';
import { Link } from '../components/link';
import { useRotatingRandom } from '../components/useRotatingRandom';
import { useVocabularySearch } from '../components/useVocabularySearch';
import { getVocabulary, VocabularyEntry } from '../data/vocabulary';
import { transliterate } from '../utils/translit';

interface StaticProps {
  vocabulary: VocabularyEntry[];
}

const HomePage: NextPage<StaticProps> = ({ vocabulary }) => {
  const router = useRouter();
  const search = useVocabularySearch(vocabulary);

  const tip = useRotatingRandom(
    [
      'Press ENTER to instantly navigate to the first result',
      `There are currently ${vocabulary.length} entries in this vocabulary`,
      'All vocabulary entries have been carefully reviewed by humans',
      'You can search by incorrect translations as well (e.g. "Kiev")',
      'You can search in different languages (where applicable)',
      'You can install this app as PWA on your device',
      'Not sure what to search for? Try "Kyiv"',
      'Not sure what to search for? Try "Ukraine"',
      'Not sure what to search for? Try "Kharkiv"',
      'Not sure what to search for? Try "Lviv"',
      'Not sure what to search for? Try "Mykolaiv"'
    ],
    15000
  );

  const transliterated = transliterate(search.query);

  return (
    <>
      <Box
        classes={[
          'border-2',
          'border-neutral-400',
          'hover:border-blue-500',
          'rounded',
          'bg-neutral-100',
          'text-xl'
        ]}
      >
        <HStack>
          <Box classes={['mx-4']}>
            {search.processing ? <FiLoader className={classNames('animate-spin')} /> : <FiSearch />}
          </Box>

          <input
            className={classNames(
              'w-full',
              'py-6',
              'appearance-none',
              'focus:outline-none',
              'bg-transparent'
            )}
            placeholder="Start typing to search"
            value={search.query}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && search.results.length > 0) {
                router.push(`/i/${search.results[0].id}`);
              }
            }}
            onChange={(e) => search.setQuery(e.target.value)}
            autoFocus
          />
        </HStack>
      </Box>

      <Box classes={['flex', 'm-2', 'place-content-center', 'text-neutral-600', 'text-light']}>
        <HStack gap="medium">
          <FiInfo />
          <Box>{tip}</Box>
        </HStack>
      </Box>

      <Box classes={['mt-8']}>
        {search.results.length > 0 && (
          <Box classes={['flex', 'flex-col', 'lg:flex-row', 'flex-wrap', 'gap-4']}>
            {search.results.map((entry) => (
              <Link key={entry.id} href={`/i/${entry.id}`}>
                <Box
                  classes={[
                    'p-4',
                    'bg-neutral-100',
                    'border-2',
                    'border-neutral-400',
                    'hover:border-blue-500',
                    'rounded'
                  ]}
                >
                  <Box classes={['text-xl']}>{entry.translation}</Box>
                  <Box classes={['text-lg', 'font-light']}>
                    {entry.name} • {entry.category}
                  </Box>
                </Box>
              </Link>
            ))}
          </Box>
        )}

        {!search.query && !search.processing && (
          <Box classes={['mx-2', 'space-y-2', 'text-lg']}>
            <Box type="p" classes={['text-xl', 'font-semibold']}>
              Why does it matter?
            </Box>
            <Box type="p">
              Ukrainian language has a long and troubled history. Before it became independent,
              Ukraine had spent many decades occupied by the Russian-speaking Soviet Union and,
              prior to that, the Russian Empire. During this period, Ukrainian faced suppression and
              its speakers were victims of persecution and ridicule. The vast majority of
              educational facilities and businesses at the time mandated the use of Russian, which
              left no opportunities for other languages.
            </Box>
            <Box type="p">
              As a result of this, Ukrainian place names, personal names, as well as many other
              words, have made it into English based on their transliteration from the Russian
              language instead of Ukrainian. Considering Ukraine&apos;s desire to establish its own
              identity, especially in the light of military aggression waged against it by Russia,
              the choice of spelling has become more than just a preference, but a{' '}
              <Box type="span" classes={['font-semibold']}>
                political stance
              </Box>
              .
            </Box>
            <Box type="p">
              While Russia continuously attempts to undermine and, ultimately, erase Ukrainian
              culture, taking a moment of your time to ensure the correct spelling is another way
              that you can{' '}
              <Box type="span" classes={['font-semibold']}>
                #StandWithUkraine
              </Box>{' '}
              in its fight for freedom.{' '}
              <Box type="span" classes={['inline-flex']}>
                <FiHeart strokeWidth={1} fill="#3b82f6" />
                <FiHeart strokeWidth={1} fill="#facc15" />
              </Box>
            </Box>
          </Box>
        )}

        {search.results.length <= 0 && search.query && !search.processing && (
          <Box>
            <Box classes={['text-xl']}>
              <HStack gap="medium">
                <Box>No results found</Box>
                <FiFrown />
              </HStack>
            </Box>

            <Box classes={['text-lg', 'font-light']}>
              {transliterated && transliterated !== search.query && (
                <Box>
                  However, according to the{' '}
                  <Link href="https://github.com/Tyrrrz/SpellingUkraine/tree/master/data/vocabulary#transliteration-system">
                    official Ukrainian transliteration system
                  </Link>
                  , your input should be spelled as{' '}
                  <Box type="span" classes={['font-mono']}>
                    {transliterated}
                  </Box>{' '}
                  in English.
                </Box>
              )}

              <Box>
                If you believe this entry should be added to the vocabulary, please{' '}
                <Link href="https://github.com/Tyrrrz/SpellingUkraine/tree/master/data/vocabulary">
                  submit a pull request
                </Link>
                .
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export const getStaticProps: GetStaticProps<StaticProps> = () => {
  return {
    props: {
      vocabulary: getVocabulary()
    }
  };
};

export default HomePage;
