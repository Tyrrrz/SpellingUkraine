import c from 'classnames';
import type { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { FC } from 'react';
import FadeIn from 'react-fade-in';
import { FiCornerDownLeft, FiHeart, FiLoader, FiSearch, FiTarget, FiX } from 'react-icons/fi';
import { loadVocabulary, VocabularyEntry } from 'spelling-ukraine-data';
import Highlight from '~/components/highlight';
import Inline from '~/components/inline';
import Link from '~/components/link';
import Paragraph from '~/components/paragraph';
import useDebounce from '~/hooks/useDebounce';
import useHydrated from '~/hooks/useHydrated';
import useSessionState from '~/hooks/useSessionState';
import useVocabularySearch, { SearchResult } from '~/hooks/useVocabularySearch';
import { bufferIterable } from '~/utils/async';
import { getRepoFileUrl } from '~/utils/repo';
import { translit } from '~/utils/translit';

type HomePageProps = {
  vocabulary: VocabularyEntry[];
};

const SearchResults: FC<{ results: SearchResult[] }> = ({ results }) => {
  return (
    <FadeIn className={c('flex', 'flex-col', 'sm:flex-row', 'flex-wrap', 'gap-4')}>
      {results.map((result) => (
        <Link key={result.entry.id} variant="hidden" href={`/i/${result.entry.id}`}>
          <section
            className={c(
              'flex',
              'flex-col',
              'h-full',
              'p-4',
              'border',
              'border-neutral-400',
              'hover:border-ukraine-blue',
              'rounded',
              'bg-white',
              'hover:bg-blue-50',
              'place-content-center'
            )}
          >
            <div className={c('text-xl')}>{result.entry.correctSpelling}</div>

            <div className={c('text-lg', 'font-light')}>
              {result.entry.sourceSpelling} • {result.entry.category}
            </div>

            {result.match !== result.entry.correctSpelling &&
              result.match !== result.entry.sourceSpelling && (
                <div className={c('mt-1', 'text-sm', 'font-light')}>
                  <Inline>
                    <FiTarget strokeWidth={1} />
                    <span>Matched on {result.match}</span>
                  </Inline>
                </div>
              )}
          </section>
        </Link>
      ))}
    </FadeIn>
  );
};

const NotFound: FC<{ query: string }> = ({ query }) => {
  const queryTranslit = translit(query);

  return (
    <FadeIn>
      <section>
        <div className={c('text-xl')}>
          {queryTranslit && queryTranslit !== query && queryTranslit.length <= 50 ? (
            <span>
              Direct transliteration: <span className={c('font-semibold')}>{queryTranslit}</span>
            </span>
          ) : (
            <span>No results found</span>
          )}
        </div>

        <div className={c('text-lg')}>
          If you believe this entry should be added to the vocabulary, please{' '}
          <Link href={getRepoFileUrl('data/vocabulary')}>submit a pull request</Link>.
        </div>
      </section>
    </FadeIn>
  );
};

const Placeholder: FC<{ vocabulary: VocabularyEntry[] }> = ({ vocabulary }) => {
  return (
    <FadeIn className={c('space-y-6', 'text-lg')}>
      <section>
        <div className={c('text-xl', 'font-semibold')}>
          <Highlight>What does this app do?</Highlight>
        </div>
        <Paragraph>
          Use this app to quickly look up the correct English spelling of any Ukrainian toponym,
          personal name, or other word. You can search by typing in Ukrainian, English, or another
          relevant language — many entries will also match on outdated or incorrect spellings too.
          Currently, this vocabulary contains {vocabulary.length} items, all carefully reviewed by
          humans.
        </Paragraph>
      </section>

      <section>
        <div className={c('text-xl', 'font-semibold')}>
          <Highlight>Why does spelling matter?</Highlight>
        </div>
        <Paragraph>
          Before becoming an independent country, Ukraine spent many decades occupied by the Soviet
          Union and, prior to that, the Russian Empire. During that period, the Ukrainian language
          was systemically suppressed, while Ukrainian speakers often found themselves victims of
          ridicule and persecution. State policies at the time mandated the use of the Russian
          language in all nomenclature, which lead to the adoption of Russian spelling for Ukrainian
          names, including in English.
        </Paragraph>
        <Paragraph>
          Nowadays, Ukraine strives to assert its own identity, and language remains a crucial part
          of that struggle. The use of Ukrainian-based transliteration is gradually becoming more
          prevalent and, as never before, more important.
        </Paragraph>
        <Paragraph>
          In the face of Russia&apos;s military aggression and continuous attempts to undermine and,
          ultimately, erase the Ukrainian culture, the choice of spelling is no longer a matter of
          preference, but a <span className={c('font-semibold')}>political stance</span>. Taking a
          moment of your time to ensure that you are writing correctly is yet another small way that
          you can <span className={c('font-semibold')}>#StandWithUkraine</span> in its fight for
          freedom.{' '}
          <Inline>
            <FiHeart className={c('fill-ukraine-blue')} strokeWidth={1} />
            <FiHeart className={c('fill-ukraine-yellow')} strokeWidth={1} />
          </Inline>
        </Paragraph>
      </section>
    </FadeIn>
  );
};

const HomePage: NextPage<HomePageProps> = ({ vocabulary }) => {
  const router = useRouter();

  const [query, setQuery] = useSessionState('searchQuery', '');
  const queryDebounced = useHydrated(useDebounce(query, 500));

  const isLoading = queryDebounced !== query;
  const results = useVocabularySearch(vocabulary, queryDebounced || '');

  return (
    <>
      <div className={c('m-1', 'text-center', 'sm:text-right', 'text-sm', 'text-light')}>
        ✨ New: you can now also <Link href="/translit">transliterate arbitrary text</Link>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (isLoading) {
            return;
          }

          const firstResult = results[0];
          if (!firstResult) {
            return;
          }

          router.push(`/i/${firstResult.entry.id}`);
        }}
      >
        <div
          className={c(
            'flex',
            'border',
            'border-neutral-400',
            'hover:border-ukraine-blue',
            'rounded',
            'bg-white',
            'items-center',
            'text-xl'
          )}
        >
          <div className={c('mx-4')}>
            {isLoading ? (
              <FiLoader className={c('animate-spin')} />
            ) : query ? (
              <button
                type="button"
                className={c('flex')}
                onClick={() => setQuery('')}
                title="Reset search (press Escape)"
              >
                <FiX />
              </button>
            ) : (
              <FiSearch />
            )}
          </div>

          <input
            className={c(
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

          {results.length > 0 && (
            <button
              type="submit"
              className={c('flex', 'px-4')}
              title="Go to the first result (press Enter)"
            >
              <FiCornerDownLeft />
            </button>
          )}
        </div>
      </form>

      <div className={c('mt-6')}>
        {!queryDebounced ? (
          <Placeholder vocabulary={vocabulary} />
        ) : results.length > 0 ? (
          <SearchResults results={results} />
        ) : (
          <NotFound query={queryDebounced} />
        )}
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const vocabulary = await bufferIterable(loadVocabulary());

  return {
    props: {
      vocabulary
    }
  };
};

export default HomePage;
