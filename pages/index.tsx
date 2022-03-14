import classNames from 'classnames';
import type { GetStaticProps, NextPage } from 'next';
import React from 'react';
import { FiFrown, FiLoader, FiSearch } from 'react-icons/fi';
import { HStack } from '../components/hstack';
import { Link } from '../components/link';
import { useVocabularySearch } from '../components/useVocabularySearch';
import { getVocabulary, VocabularyEntry } from '../data/vocabulary';

interface StaticProps {
  vocabulary: VocabularyEntry[];
}

const HomePage: NextPage<StaticProps> = ({ vocabulary }) => {
  const search = useVocabularySearch(vocabulary);

  return (
    <>
      <div
        className={classNames(
          'border-2',
          'border-neutral-400',
          'hover:border-sky-500',
          'rounded',
          'bg-neutral-100',
          'text-xl'
        )}
      >
        <HStack>
          <div className={classNames('px-4')}>
            {search.processing ? <FiLoader className={classNames('animate-spin')} /> : <FiSearch />}
          </div>

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
            onChange={(e) => search.setQuery(e.target.value.trim())}
            autoFocus
          />
        </HStack>
      </div>

      {search.results.length > 0 && (
        <div className="py-8 flex flex-col lg:flex-row flex-wrap gap-4">
          {search.results.map((entry) => (
            <Link key={entry.id} href={`/i/${entry.id}`}>
              <div
                className={classNames(
                  'p-4',
                  'bg-neutral-100',
                  'border-2',
                  'border-neutral-400',
                  'rounded',
                  'hover:border-blue-500'
                )}
              >
                <div className="text-xl font-bold tracking-wide">{entry.translation}</div>
                <div className="text-lg">
                  <span className="tracking-wide">{entry.name}</span>
                  <span> • </span>
                  <span className="font-light">{entry.category}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {search.results.length <= 0 && search.query && !search.processing && (
        <div className={classNames('py-8')}>
          <div className={classNames('text-xl')}>
            <HStack gap="medium">
              <div>No results found</div>
              <FiFrown strokeWidth={1} />
            </HStack>
          </div>

          <div className={classNames('font-light')}>
            Double check that your search query is correct. If the entry you are looking for is
            missing, you can add it by{' '}
            <Link href="https://github.com/Tyrrrz/SpellingUkraine/tree/master/data/vocabulary">
              submitting a pull request
            </Link>
            .
          </div>
        </div>
      )}
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
