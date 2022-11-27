import c from 'classnames';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { Map, Marker } from 'pigeon-maps';
import { FC, useMemo } from 'react';
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
import Heading from '~/components/heading';
import Highlight from '~/components/highlight';
import Image from '~/components/image';
import Inline from '~/components/inline';
import Link from '~/components/link';
import Meta from '~/components/meta';
import Paragraph from '~/components/paragraph';
import Section from '~/components/section';
import useSpeech from '~/hooks/useSpeech';
import { bufferIterable } from '~/utils/async';
import { getSiteUrl } from '~/utils/env';
import { getRepoFileEditUrl, getRepoNewIssueUrl } from '~/utils/repo';
import { formatUrlWithQuery } from '~/utils/url';

type EntryPageProps = {
  entry: VocabularyEntry;
};

type EntryPageParams = {
  id: string;
};

const PronounceButton: FC<EntryPageProps> = ({ entry }) => {
  const { isActive, voices, speak } = useSpeech();

  // Google UK voices are the best for Ukrainian transliterations and
  // currently our transcriptions are tailored specifically for them.
  const voice = useMemo(() => {
    return (
      voices?.find((voice) => voice.name === 'Google UK English Female') ||
      voices?.find((voice) => voice.name === 'Google UK English Male')
    );
  }, [voices]);

  if (!entry.transcription) {
    return null;
  }

  if (!voice) {
    return (
      <FiVolumeX
        className={c('text-neutral-400')}
        strokeWidth={1}
        title="Pronunciation is not available for your device"
      />
    );
  }

  return (
    <button
      disabled={isActive}
      onClick={() => speak(entry.transcription!, voice)}
      title={`Pronounce "${entry.correctSpelling}"`}
    >
      {isActive ? <FiVolume2 strokeWidth={1} /> : <FiVolume1 strokeWidth={1} />}
    </button>
  );
};

const SpellingSection: FC<EntryPageProps> = ({ entry }) => {
  if (entry.incorrectSpellings.length <= 0) {
    return null;
  }

  return (
    <Section title="Spelling">
      <div className={c('flex', 'flex-wrap', 'gap-3', 'text-lg')}>
        <Inline>
          <FiCheck className={c('mt-px', 'sm:mt-1', 'text-green-600')} />
          <span>{entry.correctSpelling}</span>
        </Inline>

        {entry.incorrectSpellings.map((spelling) => (
          <Inline key={spelling}>
            <FiX className={c('mt-px', 'sm:mt-1', 'text-red-600')} />
            <span>{spelling}</span>
          </Inline>
        ))}
      </div>
    </Section>
  );
};

const DescriptionSection: FC<EntryPageProps> = ({ entry }) => {
  if (!entry.description) {
    return null;
  }

  return (
    <Section title="Description">
      <article>
        {entry.description.split('\n').map((paragraph, i) => (
          <Paragraph key={i}>{paragraph}</Paragraph>
        ))}
      </article>
    </Section>
  );
};

const LinksSection: FC<EntryPageProps> = ({ entry }) => {
  if (entry.links.length <= 0 && !entry.location) {
    return null;
  }

  const links = entry.location
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
    <Section title="Links">
      <div className={c('flex', 'flex-wrap', 'gap-3')}>
        {links.map((link) => (
          <Highlight key={link.name}>
            <Link variant="discreet" color="yellow" href={link.url}>
              <Inline>
                <FiExternalLink />
                <span>{link.name}</span>
              </Inline>
            </Link>
          </Highlight>
        ))}
      </div>
    </Section>
  );
};

const LocationSection: FC<EntryPageProps> = ({ entry }) => {
  if (!entry.location) {
    return null;
  }

  return (
    <Section title="Location">
      <Map
        defaultCenter={[entry.location.lat, entry.location.lng]}
        defaultZoom={6}
        height={400}
        mouseEvents={false}
        touchEvents={false}
      >
        <Marker
          color="#0057b7"
          width={48}
          hover={false}
          anchor={[entry.location.lat, entry.location.lng]}
        />
      </Map>
    </Section>
  );
};

const ImageSection: FC<EntryPageProps> = ({ entry }) => {
  if (!entry.image) {
    return null;
  }

  return (
    <Section title="Image">
      <Link href={entry.image.url}>
        <Image src={entry.image.url} alt={entry.image.name} height={400} />
      </Link>
    </Section>
  );
};

const ContributeSection: FC<EntryPageProps> = ({ entry }) => {
  return (
    <Section title="Contribute">
      <div className={c('flex', 'flex-wrap', 'gap-3')}>
        <Highlight color="yellow">
          <Link variant="discreet" href={getRepoFileEditUrl(`data/vocabulary/${entry.path}`)}>
            <Inline>
              <FiEdit3 />
              <span>Edit information</span>
            </Inline>
          </Link>
        </Highlight>

        <Highlight color="yellow">
          <Link
            variant="discreet"
            href={getRepoNewIssueUrl({
              template: 'bug-report.yml',
              labels: 'bug',
              title: `${entry.correctSpelling}: <your issue>`,
              details: `Issue related to entry: [${entry.correctSpelling}](${getSiteUrl(
                `/i/${entry.id}`
              )})`
            })}
          >
            <Inline>
              <FiFlag />
              <span>Report issue</span>
            </Inline>
          </Link>
        </Highlight>
      </div>
    </Section>
  );
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

      <div className={c('space-y-6')}>
        <section>
          <Heading>
            <div className={c('flex', 'items-end', 'gap-3')}>
              <div>{entry.correctSpelling}</div>
              <PronounceButton entry={entry} />
            </div>
          </Heading>

          <div className={c('text-2xl', 'font-light', 'tracking-wide')}>
            {entry.sourceSpelling} • {entry.category}
          </div>
        </section>

        <SpellingSection entry={entry} />
        <DescriptionSection entry={entry} />
        <LinksSection entry={entry} />
        <LocationSection entry={entry} />
        <ImageSection entry={entry} />
        <ContributeSection entry={entry} />
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths<EntryPageParams> = async () => {
  const entries = await bufferIterable(loadVocabulary());

  return {
    paths: entries.map((entry) => ({
      params: {
        id: entry.id
      }
    })),
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

  const entry = await loadVocabularyEntry(id);

  return {
    props: {
      entry
    }
  };
};

export default EntryPage;
