import classNames from 'classnames';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { Map, Marker } from 'pigeon-maps';
import React from 'react';
import { FiCheck, FiEdit3, FiExternalLink, FiMap, FiVolume1, FiVolume2, FiX } from 'react-icons/fi';
import { Box } from '../../components/box';
import { HStack } from '../../components/hstack';
import { Image } from '../../components/image';
import { Link } from '../../components/link';
import { Meta } from '../../components/meta';
import { Paper } from '../../components/paper';
import { SectionHeader } from '../../components/sectionHeader';
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
        description={`"${entry.translation}" is the correct way to spell "${entry.term}" in English. Support Ukraine, transliterate correctly!`}
        imageUrl={entry.image?.url}
      />

      <Paper>
        <Box classes={['flex', 'justify-between']}>
          <Box classes={['space-y-1', 'text-3xl']}>
            <HStack align="bottom" gap="large">
              <Box>{entry.translation}</Box>

              {speech.available && (
                <button title={`Pronounce "${entry.term}"`} onClick={() => speech.say(entry.term)}>
                  {speech.active ? <FiVolume2 strokeWidth={1} /> : <FiVolume1 strokeWidth={1} />}
                </button>
              )}
            </HStack>

            <Box classes={['text-2xl', 'font-light', 'tracking-wide']}>
              {entry.term} • {entry.category}
            </Box>
          </Box>

          <Box classes={['mt-1', 'text-lg']}>
            <Link
              href={`https://github.com/Tyrrrz/SpellingUkraine/blob/master/data/vocabulary/${entry.path}`}
            >
              <HStack>
                <FiEdit3 />
                <Box>Edit</Box>
              </HStack>
            </Link>
          </Box>
        </Box>

        <Box classes={['space-y-4']}>
          {entry.mistakes.length > 0 && (
            <Box>
              <SectionHeader>Spelling</SectionHeader>

              <Box classes={['text-lg']}>
                <HStack wrap gap="large">
                  <HStack>
                    <FiCheck className={classNames('text-green-600')} />
                    <Box>{entry.translation}</Box>
                  </HStack>

                  {entry.mistakes.map((mistake) => (
                    <HStack key={mistake}>
                      <FiX className={classNames('text-red-600')} />
                      <Box>{mistake}</Box>
                    </HStack>
                  ))}
                </HStack>
              </Box>
            </Box>
          )}

          {entry.description && (
            <Box>
              <SectionHeader>Description</SectionHeader>

              <Box type="article">{entry.description}</Box>
            </Box>
          )}

          {entry.links.length > 0 && (
            <Box>
              <SectionHeader>See also</SectionHeader>

              {entry.links.map((link) => (
                <HStack key={link.name}>
                  <FiExternalLink />
                  <Link href={link.url}>{link.name}</Link>
                </HStack>
              ))}
            </Box>
          )}

          {entry.location && (
            <Box>
              <SectionHeader>Location</SectionHeader>

              <Box>
                <Map
                  defaultCenter={[entry.location.latitude, entry.location.longitude]}
                  defaultZoom={6}
                  height={400}
                  mouseEvents={false}
                  touchEvents={false}
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

          {entry.image && (
            <Box>
              <SectionHeader>Image</SectionHeader>

              <Box type="figure">
                <Image src={entry.image.url} alt={entry.image.name} height={400} />
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
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
      entry: getVocabularyEntry(id)
    }
  };
};

export default EntryPage;
