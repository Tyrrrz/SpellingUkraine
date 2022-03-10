import classNames from 'classnames';
import type { GetStaticProps, NextPage } from 'next';
import React from 'react';
import { getVocabulary, VocabularyEntry } from '../data/vocabulary';
import { Link } from '../shared/link';

const EntryCard: React.FC<{ entry: VocabularyEntry }> = ({ entry }) => {
  return (
    <Link href={`/${entry.id}`}>
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
  const [entries, setEntries] = React.useState(() => vocabulary.sort(() => 0.5 - Math.random()));
  const [filter, setFilter] = React.useState('');

  React.useEffect(() => {
    setEntries(
      vocabulary.filter(
        (entry) =>
          entry.name.toLowerCase().includes(filter.toLowerCase()) ||
          entry.translation.toLowerCase().includes(filter.toLowerCase()) ||
          entry.aliases?.some((v) => v.toLowerCase().includes(filter.toLowerCase())) ||
          entry.mistranslations.some((v) => v.toLowerCase().includes(filter.toLowerCase()))
      )
    );
  }, [vocabulary, filter]);

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
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          autoFocus
        />
      </div>

      <div className="py-8 flex flex-wrap space-x-4">
        {entries.map((entry) => (
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
