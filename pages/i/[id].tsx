import classNames from 'classnames';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { Map, Marker } from 'pigeon-maps';
import React from 'react';
import {
  FiCheck,
  FiChevronLeft,
  FiEdit3,
  FiExternalLink,
  FiMap,
  FiVolume1,
  FiVolume2,
  FiX
} from 'react-icons/fi';
import { Box } from '../../components/box';
import { HDock } from '../../components/hdock';
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
        description={`"${entry.translation}" is the correct way to spell "${entry.name}" in English. Support Ukraine, transliterate correctly!`}
      />

      <HDock>
        <Link href="/">
          <HStack>
            <FiChevronLeft />
            <Box>Back</Box>
          </HStack>
        </Link>

        <Link
          href={`https://github.com/Tyrrrz/SpellingUkraine/blob/master/data/vocabulary/${entry.path}`}
        >
          <HStack>
            <FiEdit3 />
            <Box>Edit</Box>
          </HStack>
        </Link>
      </HDock>

      <Box classes={['mt-4', 'p-4', 'border-2', 'border-neutral-400', 'rounded', 'bg-neutral-100']}>
        <Box classes={['space-y-1', 'text-3xl']}>
          <HStack gap="large">
            <Box>{entry.translation}</Box>

            {speech.available && (
              <button
                className={classNames('mt-2')}
                title={`Pronounce "${entry.translation}"`}
                onClick={() => speech.say(entry.translation)}
              >
                {speech.active ? <FiVolume2 strokeWidth={1} /> : <FiVolume1 strokeWidth={1} />}
              </button>
            )}
          </HStack>

          <Box classes={['text-xl', 'font-light', 'tracking-wide']}>
            {entry.name} • {entry.category}
          </Box>
        </Box>

        <Box classes={['mt-4', 'space-y-4']}>
          <Box classes={['flex', 'gap-2']}>
            <HStack>
              <FiCheck className={classNames('text-green-600')} />
              <Box>{entry.translation}</Box>
            </HStack>

            {entry.mistranslations.map((mistranslation) => (
              <HStack key={mistranslation}>
                <FiX className={classNames('text-red-600')} />
                <Box>{mistranslation}</Box>
              </HStack>
            ))}
          </Box>

          {entry.description && <Box>{entry.description}</Box>}

          {entry.externalLinks.length > 0 && (
            <Box>
              {entry.externalLinks.map((link) => (
                <HStack key={link.name}>
                  <FiExternalLink />
                  <Link href={link.url}>{link.name}</Link>
                </HStack>
              ))}
            </Box>
          )}

          {entry.location && (
            <Box>
              <Box>
                <Map
                  height={400}
                  mouseEvents={false}
                  touchEvents={false}
                  defaultCenter={[entry.location.latitude, entry.location.longitude]}
                  defaultZoom={6}
                >
                  <Marker
                    color="#0ea5e9"
                    width={48}
                    hover={false}
                    anchor={[entry.location.latitude, entry.location.longitude]}
                  />
                </Map>
              </Box>

              <Box classes={['flex', 'place-content-end']}>
                <Link
                  href={`https://google.com/maps/search/?api=1&query=${encodeURIComponent(
                    entry.translation
                  )}`}
                >
                  <HStack>
                    <FiMap />
                    <Box>Open in Google Maps</Box>
                  </HStack>
                </Link>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
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
