import classNames from 'classnames';
import type { GetStaticProps, NextPage } from 'next';
import React from 'react';
import { FiFrown, FiLoader, FiSearch } from 'react-icons/fi';
import { HStack } from '../components/hstack';
import { Link } from '../components/link';
import { useDebouncedValue } from '../components/useDebouncedValue';
import { getVocabulary, VocabularyEntry } from '../data/vocabulary';

const EntryCard: React.FC<{ entry: VocabularyEntry }> = ({ entry }) => {
  return (
    <Link href={`/i/${entry.id}`}>
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
  );
};

interface StaticProps {
  vocabulary: VocabularyEntry[];
}

const HomePage: NextPage<StaticProps> = ({ vocabulary }) => {
  const [results, setResults] = React.useState([] as VocabularyEntry[]);
  const [query, setQuery] = React.useState('');
  const debouncedQuery = useDebouncedValue(query, 500);

  const searching = query && query !== debouncedQuery;

  React.useEffect(() => {
    // TODO: Use a trie or something
    const queryNormalized = debouncedQuery.toLowerCase();
    if (!queryNormalized) {
      setResults([]);
      return;
    }

    const matches = [] as { entry: VocabularyEntry; quality: number }[];

    for (const entry of vocabulary) {
      const keys = [
        entry.name.toLowerCase(),
        entry.translation.toLowerCase(),
        ...entry.mistranslations.map((item) => item.toLocaleLowerCase()),
        ...entry.aliases.map((item) => item.toLocaleLowerCase())
      ];

      for (const key of keys) {
        if (key.includes(queryNormalized)) {
          // Quality is determined by how many characters are matched
          // and how close to the beginning of the key the match happened.
          const quality =
            queryNormalized.length / key.length - key.indexOf(queryNormalized) / key.length;

          matches.push({ entry, quality });
          break;
        }
      }
    }

    setResults(
      matches
        .sort((a, b) => b.quality - a.quality)
        .slice(0, 10)
        .map((match) => match.entry)
    );
  }, [vocabulary, debouncedQuery]);

  return (
    <>
      <div
        className={classNames(
          'border-2',
          'border-neutral-400',
          'hover:border-sky-500',
          'rounded',
          'bg-neutral-100',
          'text-xl',
          'text-gray-700'
        )}
      >
        <HStack>
          <div className={classNames('px-4')}>
            {searching ? <FiLoader className={classNames('animate-spin')} /> : <FiSearch />}
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
            value={query}
            onChange={(e) => setQuery(e.target.value.trim())}
            autoFocus
          />
        </HStack>
      </div>

      {results.length > 0 && (
        <div className="py-8 flex flex-col lg:flex-row flex-wrap gap-4">
          {results.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}

      {results.length <= 0 && debouncedQuery && (
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
