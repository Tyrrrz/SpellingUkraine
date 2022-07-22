import classNames from 'classnames';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { Map, Marker } from 'pigeon-maps';
import { FC } from 'react';
import {
  FiCheck,
  FiEdit3,
  FiExternalLink,
  FiFlag,
  FiVolume1,
  FiVolume2,
  FiVolumeX,
  FiX
} from 'react-icons/fi';
import { loadVocabulary, loadVocabularyEntry, VocabularyEntry } from 'spelling-ukraine-data';
import Box from '../../components/box';
import ButtonLink from '../../components/buttonLink';
import Image from '../../components/image';
import Meta from '../../components/meta';
import RawLink from '../../components/rawLink';
import Section from '../../components/section';
import Stack from '../../components/stack';
import useSpeech from '../../hooks/useSpeech';
import { getSiteUrl } from '../../utils/env';
import { formatUrlWithQuery } from '../../utils/url';

const PronounceButton: FC<{ entry: VocabularyEntry }> = ({ entry }) => {
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
    <ButtonLink onClick={() => speech.speak(entry.transcription!)}>
      {speech.isActive ? <FiVolume2 strokeWidth={1} /> : <FiVolume1 strokeWidth={1} />}
    </ButtonLink>
  );
};

const SpellingSection: FC<{ entry: VocabularyEntry }> = ({ entry }) => {
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

const DescriptionSection: FC<{ entry: VocabularyEntry }> = ({ entry }) => {
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

const LinksSection: FC<{ entry: VocabularyEntry }> = ({ entry }) => {
  if (entry.links.length <= 0 && !entry.location) {
    return null;
  }

  const actualLinks = entry.location
    ? [
        ...entry.links,
        {
          name: `Google Maps: ${entry.correctSpelling}`,
          url: formatUrlWithQuery('https://google.com/maps/search/', {
            api: '1',
            query: entry.correctSpelling
          })
        }
      ]
    : entry.links;

  return (
    <Section title="See also">
      <Stack orientation="horizontal" wrap gap="large">
        {actualLinks.map((link) => (
          <RawLink key={link.name} href={link.url}>
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
          </RawLink>
        ))}
      </Stack>
    </Section>
  );
};

const LocationSection: FC<{ entry: VocabularyEntry }> = ({ entry }) => {
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

const ContributeSection: FC<{ entry: VocabularyEntry }> = ({ entry }) => {
  return (
    <Section title="Contribute">
      <Stack orientation="horizontal" wrap gap="large">
        <RawLink
          href={`https://github.com/Tyrrrz/SpellingUkraine/edit/master/data/vocabulary/${entry.path}`}
        >
          <Box
            classes={['px-2', 'py-1', 'rounded', 'bg-ukraine-yellow', 'hover:text-ukraine-blue']}
          >
            <Stack orientation="horizontal">
              <FiEdit3 />
              <Box>Edit information</Box>
            </Stack>
          </Box>
        </RawLink>

        <RawLink
          href={formatUrlWithQuery('https://github.com/Tyrrrz/SpellingUkraine/issues/new', {
            template: 'bug-report.yml',
            labels: 'bug',
            title: `${entry.correctSpelling}: <your issue>`,
            details: `Issue related to entry: [${entry.correctSpelling}](${getSiteUrl(
              `/i/${entry.id}`
            )})`
          })}
        >
          <Box
            classes={['px-2', 'py-1', 'rounded', 'bg-ukraine-yellow', 'hover:text-ukraine-blue']}
          >
            <Stack orientation="horizontal">
              <FiFlag />
              <Box>Report issue</Box>
            </Stack>
          </Box>
        </RawLink>
      </Stack>
    </Section>
  );
};

type EntryPageProps = {
  entry: VocabularyEntry;
};

type EntryPageParams = {
  id: string;
};

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

export const getStaticPaths: GetStaticPaths<EntryPageParams> = async () => {
  const ids: string[] = [];
  for await (const entry of loadVocabulary()) {
    ids.push(entry.id);
  }

  return {
    paths: ids.map((id) => ({ params: { id } })),
    fallback: false
  };
};

export const getStaticProps: GetStaticProps<EntryPageProps, EntryPageParams> = async ({
  params
}) => {
  const { id } = params || {};
  if (!id) {
    throw new Error('Missing vocabulary entry ID');
  }

  return {
    props: {
      entry: await loadVocabularyEntry(id)
    }
  };
};

export default EntryPage;
