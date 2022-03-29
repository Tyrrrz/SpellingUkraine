import classNames from 'classnames';
import type { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
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
import HStack from '../components/hstack';
import Link from '../components/link';
import useSessionState from '../components/useSessionState';
import useVocabularySearch from '../components/useVocabularySearch';
import { getRandomItem } from '../utils/array';

interface HomePageProps {
  vocabulary: VocabularyEntry[];
}

const HomePage: NextPage<HomePageProps> = ({ vocabulary }) => {
  const router = useRouter();

  const suggestedQuery = React.useMemo(
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
            {search.processing ? (
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

                  {result.match !== result.entry.correctSpelling &&
                    result.match !== result.entry.sourceSpelling && (
                      <Box classes={['mt-1', 'text-sm', 'font-light']}>
                        <HStack>
                          <FiTarget strokeWidth={1} />
                          <Box>Matched on {result.match}</Box>
                        </HStack>
                      </Box>
                    )}
                </Box>
              </Link>
            ))}
          </Box>
        )}

        {!query && !search.processing && (
          <Box classes={['mx-2', 'space-y-4', 'text-lg']}>
            <Box classes={['space-y-2']}>
              <Box type="p" classes={['text-xl', 'font-semibold']}>
                What does this do?
              </Box>
              <Box type="p">
                Use this app to quickly look up the correct English spelling of any Ukrainian place
                name, personal name, or other word. You can search by typing in Ukrainian, English,
                or another relevant language — many entries will also match on outdated or incorrect
                spellings too. Currently, this vocabulary contains {vocabulary.length} items, all
                carefully reviewed by humans. Not sure what to search for? Try{' '}
                <button onClick={() => setQuery(suggestedQuery)}>
                  <Box classes={['font-semibold']}>{suggestedQuery}</Box>
                </button>
                .
              </Box>
            </Box>

            <Box classes={['space-y-2']}>
              <Box type="p" classes={['text-xl', 'font-semibold']}>
                Why does the spelling matter?
              </Box>
              <Box type="p">
                The Ukrainian language has a long and troubled history. Before it became
                independent, Ukraine had spent many decades occupied by the Russian-speaking Soviet
                Union and, prior to that, the Russian Empire. During this period, the Ukrainian
                language was suppressed and its speakers were persecuted and ridiculed. The vast
                majority of institutions at the time mandated the use of Russian, which severely
                limited opportunities for other languages to thrive.
              </Box>
              <Box type="p">
                Because of this, nearly all Ukrainian names initially made it into English based on
                their transliteration from the Russian language, instead of Ukrainian. Nowadays, as
                Ukraine strives to assert its own identity, the use of Ukrainian-based spelling is
                becoming more prevalent and, as never before, more important.
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

export const getStaticProps: GetStaticProps<HomePageProps> = () => {
  return {
    props: {
      vocabulary: loadVocabulary()
    }
  };
};

export default HomePage;

