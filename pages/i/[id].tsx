import classNames from 'classnames';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { Map, Marker } from 'pigeon-maps';
import React from 'react';
import { FiChevronLeft, FiEdit3, FiExternalLink, FiVolume1, FiVolume2, FiX } from 'react-icons/fi';
import { HStack } from '../../components/hstack';
import { Link } from '../../components/link';
import { Meta } from '../../components/meta';
import { useSpeech } from '../../components/useSpeech';
import { getVocabulary, getVocabularyEntry, VocabularyEntry } from '../../data/vocabulary';

interface StaticProps {
  entry: VocabularyEntry;
}

const EntryPage: NextPage<StaticProps> = ({ entry }) => {
  const speech = useSpeech();

  return (
    <>
      <Meta
        title={entry.translation}
        description={`"${entry.translation}" is the correct way to spell "${entry.name}" in English. Look up other words on spellingukraine.com.`}
      />

      <div className="flex mb-8 gap-x-4">
        <Link href="/">
          <HStack>
            <FiChevronLeft size={24} />
            <div>Go back</div>
          </HStack>
        </Link>

        <Link
          href={`https://github.com/Tyrrrz/SpellingUkraine/blob/master/data/vocabulary/${entry.id}.json`}
        >
          <HStack>
            <FiEdit3 />
            <div>Edit Information</div>
          </HStack>
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-x-4">
          <h2 className="text-6xl font-bold tracking-wide">{entry.translation}</h2>
          {speech.available && (
            <button className="mt-3" onClick={() => speech.say(entry.translation)}>
              {speech.active ? <FiVolume2 size={32} /> : <FiVolume1 size={32} />}
            </button>
          )}
        </div>

        <div className="text-4xl tracking-wide">
          <span>{entry.name}</span>
          <span> • </span>
          <span>{entry.category}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-8">
        <div className="p-4 border-2 rounded">
          <div>Description</div>
          <div>{entry.description}</div>
        </div>

        <div className="p-4 border-2 rounded">
          <div>Incorrect</div>
          <div>
            {entry.mistranslations.map((invalid) => (
              <HStack key={invalid}>
                <FiX className="text-red-600" /> {invalid}
              </HStack>
            ))}
          </div>
        </div>

        <div className="p-4 border-2 rounded">
          <div>External links</div>
          {entry.externalLinks &&
            entry.externalLinks.map((link) => (
              <HStack key={link.url}>
                <FiExternalLink />
                <Link href={link.url}>{link.name}</Link>
              </HStack>
            ))}
        </div>

        {entry.location && (
          <div className={classNames('w-full')}>
            <Map
              height={300}
              defaultCenter={[entry.location.latitude, entry.location.longitude]}
              defaultZoom={6}
            >
              <Marker
                color="#0ea5e9"
                anchor={[entry.location.latitude, entry.location.longitude]}
              />
            </Map>
          </div>
        )}
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: getVocabulary().map((entry) => ({
      params: { id: entry.id }
    })),
    fallback: false
  };
};

export const getStaticProps: GetStaticProps<StaticProps> = ({ params }) => {
  const id = params?.id as string;

  return {
    props: {
      entry: getVocabularyEntry(id as string)
    }
  };
};

export default EntryPage;
