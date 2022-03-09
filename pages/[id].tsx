import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { ChevronLeft, Edit3, ExternalLink, Volume1, Volume2, X } from 'react-feather';
import { getVocabularyEntry, getVocabularyIds, VocabularyEntry } from '../data/vocabulary';
import { pronounce } from '../utils/tts';

interface StaticProps {
  entry: VocabularyEntry;
}

const EntryPage: NextPage<StaticProps> = ({ entry }) => {
  const [pronouncing, setPronouncing] = React.useState(false);

  return (
    <>
      <Head>
        <title>{entry.eng} • Spelling Ukraine</title>
        <meta
          name="description"
          content={`${entry.eng} is the correct translation of the Ukrainian word ${entry.ukr}`}
        />
      </Head>

      <div className="flex mb-8 space-x-4">
        <Link href="/" passHref>
          <a className="inline-flex items-center space-x-1">
            <ChevronLeft size={24} />
            <div>Go back</div>
          </a>
        </Link>

        <a
          className="flex items-center space-x-1"
          href={`https://github.com/Tyrrrz/SpellingUkraine/blob/master/data/vocabulary/${entry.id}.json`}
        >
          <Edit3 />
          <div>Edit Information</div>
        </a>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-6xl font-bold tracking-wide">{entry.eng}</h2>
          <button
            className="mt-3"
            onClick={() => {
              if (pronouncing) return;
              setPronouncing(true);
              pronounce(entry.eng).finally(() => setPronouncing(false));
            }}
          >
            {pronouncing ? <Volume2 size={32} /> : <Volume1 size={32} />}
          </button>
        </div>

        <div className="text-4xl tracking-wide">
          <span>{entry.ukr}</span>
          <span> • </span>
          <span>{entry.category}</span>
        </div>
      </div>

      <div className="flex flex-wrap space-x-8">
        <div className="p-4 border-2 rounded">
          <div>Description</div>
          <div>{entry.desc}</div>
        </div>

        <div className="p-4 border-2 rounded">
          <div>Incorrect Transliterations</div>
          <div>
            {entry.mistakes.map((invalid) => (
              <div key={invalid} className="flex">
                <X className="text-red-600" /> {invalid}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-2 rounded">
          <div>External links</div>
          <div>
            <div className="flex items-center space-x-1">
              <ExternalLink />
              <a href={`https://wiktionary.org/wiki/${entry.eng}`}>Wiktionary</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: getVocabularyIds().map((id) => ({
      params: { id }
    })),
    fallback: false
  };
};

export const getStaticProps: GetStaticProps<StaticProps> = ({ params }) => {
  return {
    props: {
      entry: getVocabularyEntry(params?.id as string)
    }
  };
};

export default EntryPage;
