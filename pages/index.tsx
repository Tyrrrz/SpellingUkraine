import classNames from 'classnames';
import type { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { FiFrown, FiInfo, FiLoader, FiSearch } from 'react-icons/fi';
import { Box } from '../components/box';
import { HStack } from '../components/hstack';
import { Link } from '../components/link';
import { useVocabularySearch } from '../components/useVocabularySearch';
import { getVocabulary, VocabularyEntry } from '../data/vocabulary';
import { transliterate } from '../utils/translit';

interface StaticProps {
  vocabulary: VocabularyEntry[];
}

const HomePage: NextPage<StaticProps> = ({ vocabulary }) => {
  const router = useRouter();
  const search = useVocabularySearch(vocabulary);
  const transliterated = transliterate(search.query);

  const tip = React.useMemo(() => {
    const tips = [
      'Press ENTER to instantly navigate to the first result',
      'You can search using incorrect translations too',
      'You can search in different languages where applicable',
      'You can install this app as PWA on your phone or computer',
      'This app caches data and works offline',
      'Thank you for using this website 💙💛',
      `There are ${vocabulary.entries.length} entries in our vocabulary`,
      'All vocabulary entries have been carefully reviewed by a human',
      'Not sure what to search for? Try "Kyiv"',
      'Not sure what to search for? Try "Ukraine"',
      'Not sure what to search for? Try "Kharkiv"',
      'Not sure what to search for? Try "Lviv"',
      'Not sure what to search for? Try "Mykolaiv"'
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  }, [vocabulary.entries.length]);

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
              'bg-transparent',
              'leading-wide'
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

      {!search.query && !search.processing && (
        <Box classes={['flex', 'my-2', 'place-content-center', 'text-light']}>
          <HStack>
            <FiInfo />
            <Box>{tip}</Box>
          </HStack>
        </Box>
      )}

      <Box classes={['mt-6']}>
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
                    'rounded',
                    'hover:border-blue-500'
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

        {search.results.length <= 0 && search.query && !search.processing && (
          <Box classes={['p-6', 'border-2', 'border-neutral-400', 'rounded', 'bg-neutral-100']}>
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
