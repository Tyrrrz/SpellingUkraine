import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { ChevronLeft, ExternalLink, X } from 'react-feather';
import { getVocabularyEntry, getVocabularyIds, VocabularyEntry } from '../data/vocabulary';

interface StaticProps {
  entry: VocabularyEntry;
}

const EntryPage: NextPage<StaticProps> = ({ entry }) => {
  return (
    <>
      <Head>
        <title>{entry.romanization.valid} • Spelling Ukraine</title>
      </Head>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Link href="/" passHref>
            <a>
              <ChevronLeft size={48} />
            </a>
          </Link>
          <h2 className="text-6xl font-bold tracking-wide">{entry.romanization.valid}</h2>
        </div>

        <div className="text-4xl tracking-wide">
          <span>{entry.original}</span>
          <span> • </span>
          <span>{entry.transcription}</span>
        </div>

        <div>
          {entry.romanization.invalid.map((invalid) => (
            <div key={invalid} className="flex">
              <X /> {invalid}
            </div>
          ))}
        </div>

        <div>{entry.description}</div>

        <div>
          <div className="flex items-center space-x-1">
            <ExternalLink />
            <a href={`https://wiktionary.org/wiki/${entry.romanization.valid}`}>Wiktionary</a>
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
