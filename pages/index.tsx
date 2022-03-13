import classNames from 'classnames';
import type { GetStaticProps, NextPage } from 'next';
import React from 'react';
import { Link } from '../components/link';
import { useDebouncedValue } from '../components/useDebouncedValue';
import { getVocabulary, VocabularyEntry } from '../data/vocabulary';

const EntryCard: React.FC<{ entry: VocabularyEntry }> = ({ entry }) => {
  return (
    <Link href={`/i/${entry.id}`}>
      <div
        className={classNames([
          'min-w-[200px]',
          'p-4',
          'bg-neutral-100',
          'border-2',
          'border-neutral-400',
          'rounded',
          'hover:border-blue-500'
        ])}
      >
        <div className="text-3xl font-bold tracking-wide">{entry.translation}</div>
        <div className="text-xl">
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

  React.useEffect(() => {
    // TODO: Use a trie or something
    const queryNormalized = debouncedQuery.toLowerCase();

    if (!queryNormalized.trim()) {
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

    setResults(matches.sort((a, b) => b.quality - a.quality).map((match) => match.entry));
  }, [vocabulary, debouncedQuery]);

  return (
    <>
      <div>
        <input
          className={classNames([
            'w-full',
            'p-8',
            'shadow',
            'appearance-none',
            'border-2',
            'border-neutral-400',
            'rounded',
            'bg-neutral-100',
            'text-gray-700',
            'text-center',
            'font-medium',
            'leading-tight',
            'hover:border-blue-500',
            'focus:outline-none',
            'focus:shadow-outline'
          ])}
          placeholder="🔎 Start typing to search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      <div className="py-8 flex flex-wrap place-content-center gap-4">
        {results.map((entry) => (
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </div>
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
