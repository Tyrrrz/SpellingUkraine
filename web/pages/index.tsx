import classNames from 'classnames';
import type { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { FiCornerDownLeft, FiFrown, FiHeart, FiLoader, FiSearch, FiTarget } from 'react-icons/fi';
import { loadVocabulary, VocabularyEntry } from 'spelling-ukraine-data';
import Box from '../components/box';
import HStack from '../components/hstack';
import Link from '../components/link';
import useSessionState from '../components/useSessionState';
import useVocabularySearch from '../components/useVocabularySearch';

interface StaticProps {
  vocabulary: VocabularyEntry[];
}

const HomePage: NextPage<StaticProps> = ({ vocabulary }) => {
  const router = useRouter();

  const [query, setQuery] = useSessionState('searchQuery', '');
  const search = useVocabularySearch(vocabulary, query);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (!search.processing && search.results.length > 0) {
            router.push(`/i/${search.results[0].entry.id}`);
          }
        }}
      >
        <Box
          classes={[
            'flex',
            'border-2',
            'border-neutral-400',
            'hover:border-blue-500',
            'rounded',
            'bg-neutral-100',
            'items-center',
            'text-xl'
          ]}
        >
          <Box classes={['mx-4']}>
            {search.processing ? <FiLoader className={classNames('animate-spin')} /> : <FiSearch />}
          </Box>

          <input
            className={classNames(
              'flex-grow',
              'py-6',
              'appearance-none',
              'focus:outline-none',
              'bg-transparent'
            )}
            placeholder="Start typing to search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />

          {search.results.length > 0 && (
            <button
              type="submit"
              className={classNames('flex', 'px-4')}
              title="Go to the first result"
            >
              <FiCornerDownLeft />
            </button>
          )}
        </Box>
      </form>

      <Box
        classes={[
          'm-1',
          'text-center',
          'lg:text-right',
          'text-sm',
          'text-light',
          'text-neutral-600'
        ]}
      >
        Need to transliterate arbitrary text? <Link href="/translit">Click here</Link>
      </Box>

      <Box classes={['mt-8']}>
        {search.results.length > 0 && (
          <Box classes={['flex', 'flex-col', 'lg:flex-row', 'flex-wrap', 'gap-4']}>
            {search.results.map((result) => (
              <Link key={result.entry.id} href={`/i/${result.entry.id}`}>
                <Box
                  classes={[
                    'flex',
                    'flex-col',
                    'h-full',
                    'p-4',
                    'border-2',
                    'border-neutral-400',
                    'hover:border-blue-500',
                    'rounded',
                    'bg-neutral-100',
                    'place-content-center'
                  ]}
                >
                  <Box classes={['text-xl']}>{result.entry.correctSpelling}</Box>

                  <Box classes={['text-lg', 'font-light']}>
                    {result.entry.sourceSpelling} • {result.entry.category}
                  </Box>

                  {result.matchedValue !== result.entry.correctSpelling &&
                    result.matchedValue !== result.entry.sourceSpelling && (
                      <Box classes={['mt-1', 'text-sm', 'font-light']}>
                        <HStack>
                          <FiTarget strokeWidth={1} />
                          <Box>Matched on {result.matchedValue}</Box>
                        </HStack>
                      </Box>
                    )}
                </Box>
              </Link>
            ))}
          </Box>
        )}

        {!query && !search.processing && (
          <Box classes={['mx-2', 'space-y-2', 'text-lg']}>
            <Box type="p" classes={['text-xl', 'font-semibold']}>
              Why does it matter?
            </Box>
            <Box type="p">
              Ukrainian language has a long and troubled history. Before it became independent,
              Ukraine had spent many decades occupied by the Russian-speaking Soviet Union and,
              prior to that, the Russian Empire. During this period, the Ukrainian language faced
              suppression and its speakers were victims of persecution and ridicule. The vast
              majority of educational facilities and businesses at the time mandated the use of
              Russian, which left no opportunities for other languages.
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

        {query && !search.processing && search.results.length <= 0 && (
          <Box>
            <Box classes={['text-xl']}>
              <HStack gap="medium">
                <Box>No results found</Box>
                <FiFrown />
              </HStack>
            </Box>

            <Box classes={['text-lg', 'font-light']}>
              If you believe this entry should be added to the vocabulary, please{' '}
              <Link href="https://github.com/Tyrrrz/SpellingUkraine/tree/master/data/vocabulary">
                submit a pull request
              </Link>
              .
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
      vocabulary: loadVocabulary()
    }
  };
};

export default HomePage;
