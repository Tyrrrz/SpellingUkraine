import type { GetStaticProps, NextPage } from 'next';
import { getVocabulary, VocabularyEntry } from '../data/vocabulary';
import Link from 'next/link';
import React from 'react';

const EntryCard: React.FC<{ entry: VocabularyEntry }> = ({ entry }) => {
  return (
    <Link href={`/${entry.id}`} passHref>
      <a className="min-w-[200px] p-4 bg-white border-2 border-neutral-400 rounded hover:border-blue-500">
        <div>
          <div className="text-3xl font-bold tracking-wide">{entry.eng}</div>
          <div className="text-xl">
            <span className="tracking-wide">{entry.ukr}</span>
            <span> • </span>
            <span className="font-light">{entry.category}</span>
          </div>
        </div>
      </a>
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
          entry.ukr.toLowerCase().includes(filter.toLowerCase()) ||
          entry.eng.toLowerCase().includes(filter.toLowerCase()) ||
          entry.aliases?.some((v) => v.toLowerCase().includes(filter.toLowerCase())) ||
          entry.mistakes.some((v) => v.toLowerCase().includes(filter.toLowerCase()))
      )
    );
  }, [filter, vocabulary]);

  return (
    <>
      <div>
        <input
          className="w-full p-8 shadow appearance-none border-2 border-neutral-400 rounded text-xl text-gray-700 text-center font-medium leading-tight hover:border-blue-500 focus:outline-none focus:shadow-outline"
          placeholder="🔎 Start typing in any language"
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
