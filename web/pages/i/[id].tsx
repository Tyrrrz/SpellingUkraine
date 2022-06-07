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
  FiVolumeX,
  FiX
} from 'react-icons/fi';
import { loadVocabulary, loadVocabularyEntry, VocabularyEntry } from 'spelling-ukraine-data';
import Box from '../../components/box';
import Image from '../../components/image';
import Link from '../../components/link';
import Meta from '../../components/meta';
import Section from '../../components/section';
import Stack from '../../components/stack';
import useSpeech from '../../components/useSpeech';
import { getAbsoluteUrl } from '../../utils/env';
import { withSearchParams } from '../../utils/url';

const PronounceButton: React.FC<{ entry: VocabularyEntry }> = ({ entry }) => {
  const speech = useSpeech();

  if (!entry.transcription) {
    return null;
  }

  if (!speech.isAvailable) {
    return (
      <FiVolumeX
        className={classNames('text-neutral-600')}
        strokeWidth={1}
        title="Pronunciation is not available for your device"
      />
    );
  }

  return (
    <button
      className={classNames('flex', {
        'text-blue-500': speech.isActive
      })}
      title={`Pronounce "${entry.sourceSpelling}"`}
      onClick={() => speech.speak(entry.transcription!)}
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
        <Stack orientation="horizontal" wrap gap="large">
          <Stack orientation="horizontal">
            <FiCheck className={classNames('mt-px', 'sm:mt-1', 'text-green-600')} />
            <Box>{entry.correctSpelling}</Box>
          </Stack>

          {entry.incorrectSpellings.map((spelling) => (
            <Stack key={spelling} orientation="horizontal">
              <FiX className={classNames('mt-px', 'sm:mt-1', 'text-red-600')} />
              <Box>{spelling}</Box>
            </Stack>
          ))}
        </Stack>
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
      <Stack orientation="horizontal" wrap gap="large">
        {entry.links.map((link) => (
          <Link key={link.name} href={link.url}>
            <Box
              classes={[
                'px-2',
                'py-1',
                'rounded',
                'bg-ukraine-blue',
                'text-white',
                'hover:text-yellow-400'
              ]}
            >
              <Stack orientation="horizontal">
                <FiExternalLink />
                <Box>{link.name}</Box>
              </Stack>
            </Box>
          </Link>
        ))}
      </Stack>
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
          <Stack orientation="horizontal">
            <FiMap />
            <Box>Open in Google Maps</Box>
          </Stack>
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
      <Stack orientation="horizontal" wrap gap="large">
        <Link
          href={`https://github.com/Tyrrrz/SpellingUkraine/edit/master/data/vocabulary/${entry.path}`}
        >
          <Box classes={['px-2', 'py-1', 'rounded', 'bg-ukraine-yellow']}>
            <Stack orientation="horizontal">
              <FiEdit3 />
              <Box>Edit information</Box>
            </Stack>
          </Box>
        </Link>

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
          <Box classes={['px-2', 'py-1', 'rounded', 'bg-ukraine-yellow']}>
            <Stack orientation="horizontal">
              <FiFlag />
              <Box>Report issue</Box>
            </Stack>
          </Box>
        </Link>
      </Stack>
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
          <Box classes={['text-3xl', 'tracking-wide']}>
            <Stack orientation="horizontal" align="bottom" gap="large">
              <Box>{entry.correctSpelling}</Box>
              <PronounceButton entry={entry} />
            </Stack>
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
