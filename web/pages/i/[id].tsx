import classNames from 'classnames';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { Map, Marker } from 'pigeon-maps';
import React from 'react';
import {
  FiCheck,
  FiEdit3,
  FiExternalLink,
  FiFlag,
  FiMap,
  FiVolume1,
  FiVolume2,
  FiX
} from 'react-icons/fi';
import { loadVocabulary, loadVocabularyEntry, VocabularyEntry } from 'spelling-ukraine-data';
import Box from '../../components/box';
import HStack from '../../components/hstack';
import Image from '../../components/image';
import Link from '../../components/link';
import Meta from '../../components/meta';
import Section from '../../components/section';
import useSpeech from '../../components/useSpeech';
import { getAbsoluteUrl } from '../../utils/env';
import { withSearchParams } from '../../utils/url';

const PronounceButton: React.FC<{ entry: VocabularyEntry }> = ({ entry }) => {
  const speech = useSpeech();

  if (!speech.isAvailable) {
    return null;
  }

  return (
    <button
      className={classNames('flex', { 'text-blue-500': speech.isActive })}
      title={`Pronounce "${entry.sourceSpelling}"`}
      onClick={() => speech.speak(entry.sourceSpelling)}
    >
      {speech.isActive ? <FiVolume2 strokeWidth={1} /> : <FiVolume1 strokeWidth={1} />}
    </button>
  );
};

const SpellingSection: React.FC<{ entry: VocabularyEntry }> = ({ entry }) => {
  if (entry.incorrectSpellings.length <= 0) {
    return null;
  }

  return (
    <Section title="Spelling">
      <Box classes={['text-lg']}>
        <HStack wrap gap="large">
          <HStack>
            <FiCheck className={classNames('text-green-600')} />
            <Box>{entry.correctSpelling}</Box>
          </HStack>

          {entry.incorrectSpellings.map((spelling) => (
            <HStack key={spelling}>
              <FiX className={classNames('text-red-600')} />
              <Box>{spelling}</Box>
            </HStack>
          ))}
        </HStack>
      </Box>
    </Section>
  );
};

const DescriptionSection: React.FC<{ entry: VocabularyEntry }> = ({ entry }) => {
  if (!entry.description) {
    return null;
  }

  return (
    <Section title="Description">
      <Box type="article" classes={['space-y-2']}>
        {entry.description.split('\n').map((paragraph) => (
          <Box key={paragraph} type="p">
            {paragraph}
          </Box>
        ))}
      </Box>
    </Section>
  );
};

const LinksSection: React.FC<{ entry: VocabularyEntry }> = ({ entry }) => {
  if (entry.links.length <= 0) {
    return null;
  }

  return (
    <Section title="See also">
      {entry.links.map((link) => (
        <HStack key={link.name}>
          <FiExternalLink />
          <Link href={link.url}>{link.name}</Link>
        </HStack>
      ))}
    </Section>
  );
};

const LocationSection: React.FC<{ entry: VocabularyEntry }> = ({ entry }) => {
  if (!entry.location) {
    return null;
  }

  return (
    <Section title="Location">
      <Box>
        <Map
          defaultCenter={[entry.location.lat, entry.location.lng]}
          defaultZoom={6}
          height={400}
          mouseEvents={false}
          touchEvents={false}
        >
          <Marker
            color="#0ea5e9"
            width={48}
            hover={false}
            anchor={[entry.location.lat, entry.location.lng]}
          />
        </Map>
      </Box>

      <Box>
        <Link
          href={withSearchParams('https://google.com/maps/search/', {
            api: '1',
            query: entry.correctSpelling
          })}
        >
          <HStack>
            <FiMap />
            <Box>Open in Google Maps</Box>
          </HStack>
        </Link>
      </Box>
    </Section>
  );
};

const ImageSection = ({ entry }: { entry: VocabularyEntry }) => {
  if (!entry.image) {
    return null;
  }

  return (
    <Section title="Image">
      <Image src={entry.image.url} alt={entry.image.name} height={400} />
    </Section>
  );
};

const ContributeSection: React.FC<{ entry: VocabularyEntry }> = ({ entry }) => {
  return (
    <Section title="Contribute">
      <Box>
        <Link
          href={`https://github.com/Tyrrrz/SpellingUkraine/edit/master/data/vocabulary/${entry.path}`}
        >
          <HStack>
            <FiEdit3 />
            <Box>Edit information</Box>
          </HStack>
        </Link>
      </Box>

      <Box>
        <Link
          href={withSearchParams('https://github.com/Tyrrrz/SpellingUkraine/issues/new', {
            template: 'bug-report.yml',
            labels: 'bug',
            title: `${entry.correctSpelling}: <your issue>`,
            details: `Issue related to entry: [${entry.correctSpelling}](${getAbsoluteUrl(
              `/i/${entry.id}`
            )})`
          })}
        >
          <HStack>
            <FiFlag />
            <Box>Report an issue</Box>
          </HStack>
        </Link>
      </Box>
    </Section>
  );
};

interface EntryPageProps {
  entry: VocabularyEntry;
}

const EntryPage: NextPage<EntryPageProps> = ({ entry }) => {
  return (
    <>
      <Meta
        title={entry.correctSpelling}
        description={`"${entry.correctSpelling}" is the correct way to spell "${entry.sourceSpelling}" in English. Support Ukraine, transliterate correctly!`}
        keywords={[
          entry.correctSpelling,
          entry.sourceSpelling,
          ...entry.incorrectSpellings,
          ...entry.relatedSpellings,
          'spelling',
          'ukraine',
          'english'
        ]}
        imageUrl={entry.image?.url}
      />

      <Box classes={['space-y-6']}>
        <Box>
          <Box classes={['text-3xl']}>
            <HStack align="bottom" gap="large">
              <Box>{entry.correctSpelling}</Box>

              <PronounceButton entry={entry} />
            </HStack>
          </Box>

          <Box classes={['mt-1', 'text-2xl', 'font-light', 'tracking-wide']}>
            {entry.sourceSpelling} • {entry.category}
          </Box>
        </Box>

        <SpellingSection entry={entry} />
        <DescriptionSection entry={entry} />
        <LinksSection entry={entry} />
        <LocationSection entry={entry} />
        <ImageSection entry={entry} />
        <ContributeSection entry={entry} />
      </Box>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: loadVocabulary().map((entry) => ({
      params: { id: entry.id }
    })),
    fallback: false
  };
};

export const getStaticProps: GetStaticProps<EntryPageProps> = ({ params }) => {
  const id = params?.id as string;

  return {
    props: {
      entry: loadVocabularyEntry(id)
    }
  };
};

export default EntryPage;
