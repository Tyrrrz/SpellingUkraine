import classNames from 'classnames';
import type { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import FadeIn from 'react-fade-in';
import {
  FiCornerDownLeft,
  FiFrown,
  FiHeart,
  FiLoader,
  FiSearch,
  FiTarget,
  FiX
} from 'react-icons/fi';
import { loadVocabulary, VocabularyEntry } from 'spelling-ukraine-data';
import Box from '../components/box';
import Link from '../components/link';
import Stack from '../components/stack';
import useSessionState from '../components/useSessionState';
import useVocabularySearch, { SearchResult } from '../components/useVocabularySearch';
import { getRandomItem } from '../utils/array';

const SearchResults: React.FC<{ results: SearchResult[] }> = ({ results }) => {
  if (results.length > 0) {
    return (
      <FadeIn className={classNames('flex', 'flex-col', 'sm:flex-row', 'flex-wrap', 'gap-4')}>
        {results.map((result) => (
          <Box key={result.entry.id} classes={['h-full']}>
            <Link href={`/i/${result.entry.id}`}>
              <Box
                classes={[
                  'flex',
                  'flex-col',
                  'h-full',
                  'p-4',
                  'border',
                  'border-neutral-600',
                  'hover:border-blue-500',
                  'rounded',
                  'bg-white',
                  'hover:bg-blue-50',
                  'place-content-center'
                ]}
              >
                <Box classes={['text-xl']}>{result.entry.correctSpelling}</Box>

                <Box classes={['text-lg', 'font-light']}>
                  {result.entry.sourceSpelling} • {result.entry.category}
                </Box>

                {result.match !== result.entry.correctSpelling &&
                  result.match !== result.entry.sourceSpelling && (
                    <Box classes={['mt-1', 'text-sm', 'font-light']}>
                      <Stack orientation="horizontal">
                        <FiTarget strokeWidth={1} />
                        <Box>Matched on {result.match}</Box>
                      </Stack>
                    </Box>
                  )}
              </Box>
            </Link>
          </Box>
        ))}
      </FadeIn>
    );
  }

  return (
    <FadeIn>
      <Box>
        <Box classes={['text-xl']}>
          <Stack orientation="horizontal" gap="medium">
            <Box>No results found</Box>
            <FiFrown />
          </Stack>
        </Box>

        <Box classes={['text-lg', 'font-light']}>
          If you believe this entry should be added to the vocabulary, please{' '}
          <Link href="https://github.com/Tyrrrz/SpellingUkraine/tree/master/data/vocabulary">
            submit a pull request
          </Link>
          .
        </Box>
      </Box>
    </FadeIn>
  );
};

interface HomePageProps {
  vocabulary: VocabularyEntry[];
}

const HomePage: NextPage<HomePageProps> = ({ vocabulary }) => {
  const router = useRouter();

  const querySuggestion = React.useMemo(
    () =>
      getRandomItem(
        vocabulary
          .filter((entry) => entry.incorrectSpellings.length >= 2)
          .map((entry) => entry.correctSpelling)
      ),
    [vocabulary]
  );

  const [query, setQuery] = useSessionState('searchQuery', '');
  const search = useVocabularySearch(vocabulary, query);

  return (
    <>
      <Box
        classes={[
          'm-1',
          'text-center',
          'sm:text-right',
          'text-sm',
          'text-light',
          'text-neutral-600'
        ]}
      >
        Need to transliterate arbitrary text? <Link href="/translit">Click here</Link>
      </Box>

      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (!search.isProcessing && search.results.length > 0) {
            router.push(`/i/${search.results[0].entry.id}`);
          }
        }}
      >
        <Box
          classes={[
            'flex',
            'border',
            'border-neutral-600',
            'hover:border-blue-500',
            'rounded',
            'bg-white',
            'items-center',
            'text-xl'
          ]}
        >
          <Box classes={['mx-4']}>
            {search.isProcessing ? (
              <FiLoader className={classNames('animate-spin')} />
            ) : query ? (
              <button
                type="button"
                className={classNames('flex')}
                onClick={() => setQuery('')}
                title="Reset search (press Escape)"
              >
                <FiX />
              </button>
            ) : (
              <FiSearch />
            )}
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
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setQuery('');
              }
            }}
            autoFocus
          />

          {search.results.length > 0 && (
            <button
              type="submit"
              className={classNames('flex', 'px-4')}
              title="Go to the first result (press Enter)"
            >
              <FiCornerDownLeft />
            </button>
          )}
        </Box>
      </form>

      {!search.isProcessing && (
        <Box classes={['mt-10']}>
          {query ? (
            <SearchResults results={search.results} />
          ) : (
            <FadeIn>
              <Box classes={['space-y-4', 'text-lg']}>
                <Box classes={['space-y-2']}>
                  <Box
                    type="p"
                    classes={[
                      'w-fit',
                      'px-2',
                      'py-1',
                      'rounded',
                      'bg-ukraine-blue',
                      'text-white',
                      'text-xl',
                      'font-semibold'
                    ]}
                  >
                    What does this app do?
                  </Box>
                  <Box type="p">
                    Use this app to quickly look up the correct English spelling of any Ukrainian
                    place name, personal name, or other word. You can search by typing in Ukrainian,
                    English, or another relevant language — many entries will also match on outdated
                    or incorrect spellings too. Currently, this vocabulary contains{' '}
                    {vocabulary.length} items, all carefully reviewed by humans.
                  </Box>
                  <Box type="p">
                    Not sure what to search for? Try{' '}
                    <button
                      className={classNames('inline-block')}
                      onClick={() => setQuery(querySuggestion)}
                    >
                      <Box type="span" classes={['font-semibold']}>
                        {querySuggestion}
                      </Box>
                    </button>
                    .
                  </Box>
                </Box>

                <Box classes={['space-y-2']}>
                  <Box
                    type="p"
                    classes={[
                      'w-fit',
                      'px-2',
                      'py-1',
                      'rounded',
                      'bg-ukraine-blue',
                      'text-white',
                      'text-xl',
                      'font-semibold'
                    ]}
                  >
                    Why does spelling matter?
                  </Box>
                  <Box type="p">
                    The Ukrainian language has a long and troubled history. Before it became
                    independent, Ukraine had spent many decades occupied by the Russian-speaking
                    Soviet Union and, prior to that, the Russian Empire. During this period, the
                    Ukrainian language was suppressed and its speakers were persecuted and
                    ridiculed. The vast majority of institutions at the time mandated the use of
                    Russian, which severely limited opportunities for other languages to thrive.
                  </Box>
                  <Box type="p">
                    Because of this, nearly all Ukrainian names initially made it into English based
                    on their transliteration from the Russian language, instead of Ukrainian.
                    Nowadays, as Ukraine strives to assert its own identity, the use of
                    Ukrainian-based spelling is becoming more prevalent and, as never before, more
                    important.
                  </Box>
                  <Box type="p">
                    In the face of Russia&apos;s military aggression and continuous attempts to
                    undermine and, ultimately, erase Ukrainian culture, the choice of spelling is no
                    longer a matter of preference, but a{' '}
                    <Box type="span" classes={['font-semibold']}>
                      political stance
                    </Box>
                    . Taking a moment of your time to ensure that you are writing correctly is yet
                    another small way that you can{' '}
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
              </Box>
            </FadeIn>
          )}
        </Box>
      )}
    </>
  );
};

export const getStaticProps: GetStaticProps<HomePageProps> = () => {
  return {
    props: {
      vocabulary: loadVocabulary()
    }
  };
};

export default HomePage;
