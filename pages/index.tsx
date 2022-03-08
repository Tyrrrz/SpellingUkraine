import type { GetStaticProps, NextPage } from 'next';
import { getVocabulary, VocabularyEntry } from '../data/vocabulary';
import Link from 'next/link';
import React from 'react';

const EntryCard: React.FC<{ entry: VocabularyEntry }> = ({ entry }) => {
  return (
    <div className="min-w-[200px] p-4 bg-white border-2 rounded hover:border-sky-600">
      <Link href={`/${entry.id}`} passHref>
        <a>
          <div>
            <div className="text-3xl font-bold tracking-wide">{entry.translit.correct}</div>
            <div className="text-xl">
              <span className="tracking-wide">{entry.ukr}</span>
              <span> • </span>
              <span className="font-light">{entry.category}</span>
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
};

interface StaticProps {
  vocabulary: VocabularyEntry[];
}

const HomePage: NextPage<StaticProps> = ({ vocabulary }) => {
  const [entries, setEntries] = React.useState(vocabulary);
  const [filter, setFilter] = React.useState('');

  React.useEffect(() => {
    setEntries(
      vocabulary.filter(
        (entry) =>
          entry.translit.correct.toLowerCase().includes(filter.toLowerCase()) ||
          entry.translit.incorrect.some((v) => v.toLowerCase().includes(filter.toLowerCase())) ||
          entry.ukr.toLowerCase().includes(filter.toLowerCase()) ||
          entry.rus.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [filter, vocabulary]);

  return (
    <div>
      <div>
        <input
          className="w-full p-8 shadow appearance-none border-2 rounded-xl text-3xl text-gray-700 text-center font-medium leading-tight hover:border-sky-600 focus:outline-none focus:shadow-outline"
          placeholder="🔎 Type in a word in English, Ukrainian, or Russian"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="py-8 flex flex-wrap space-x-4">
        {entries.map((entry) => (
          <EntryCard key={entry.ukr} entry={entry} />
        ))}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<StaticProps> = () => {
  const vocabulary = getVocabulary().sort(() => 0.5 - Math.random());

  return {
    props: {
      vocabulary
    }
  };
};

export default HomePage;
