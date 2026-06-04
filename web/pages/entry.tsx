import { Map, Marker } from "pigeon-maps";
import { FC, useMemo } from "react";
import {
  FiCheck,
  FiEdit3,
  FiExternalLink,
  FiFlag,
  FiVolume1,
  FiVolume2,
  FiVolumeX,
  FiX,
} from "react-icons/fi";
import { useParams } from "react-router-dom";
import type { VocabularyEntry } from "spelling-ukraine-data";
import { vocabulary } from "virtual:vocabulary";
import ButtonLink from "../components/buttonLink";
import Heading from "../components/heading";
import Highlight from "../components/highlight";
import Image from "../components/image";
import Inline from "../components/inline";
import Link from "../components/link";
import Meta from "../components/meta";
import Paragraph from "../components/paragraph";
import Section from "../components/section";
import { useSpeech } from "../hooks/useSpeech";
import { getRepoFileEditUrl, getRepoNewIssueUrl } from "../utils/repo";
import { formatUrlWithQuery } from "../utils/url";
import NotFoundPage from "./404";

type EntryPageProps = {
  entry: VocabularyEntry;
};

const PronounceButton: FC<EntryPageProps> = ({ entry }) => {
  const { voices, speak, isActive } = useSpeech();

  // Google UK voices are the best for Ukrainian transliterations and
  // currently our transcriptions are tailored specifically for them.
  const voice = useMemo(() => {
    return (
      voices?.find((voice) => voice.name === "Google UK English Female") ||
      voices?.find((voice) => voice.name === "Google UK English Male")
    );
  }, [voices]);

  if (!entry.transcription) {
    return null;
  }

  if (!voice) {
    return (
      <FiVolumeX
        className="text-neutral-400"
        strokeWidth={1}
        title="Pronunciation is not available for your device"
      />
    );
  }

  return (
    <ButtonLink
      disabled={isActive}
      variant="discreet"
      onClick={() => speak(entry.transcription!, voice)}
      title={`Pronounce "${entry.correctSpelling}"`}
    >
      {isActive ? <FiVolume2 strokeWidth={1} /> : <FiVolume1 strokeWidth={1} />}
    </ButtonLink>
  );
};

const SpellingSection: FC<EntryPageProps> = ({ entry }) => {
  if (entry.incorrectSpellings.length <= 0) {
    return null;
  }

  return (
    <Section title="Spelling">
      <div className="flex flex-wrap gap-3 text-lg">
        <Inline>
          <FiCheck className="mt-px text-green-600 sm:mt-1" />
          <div>{entry.correctSpelling}</div>
        </Inline>

        {entry.incorrectSpellings.map((spelling) => (
          <Inline key={spelling}>
            <FiX className="mt-px text-red-600 sm:mt-1" />
            <div>{spelling}</div>
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
        {entry.description.split("\n").map((paragraph, i) => (
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
          url: formatUrlWithQuery("https://google.com/maps/search/", {
            api: "1",
            query: entry.correctSpelling,
          }),
        },
      ]
    : entry.links;

  return (
    <Section title="Links">
      <div className="flex flex-wrap gap-3">
        {links.map((link) => (
          <Highlight key={link.name}>
            <Link variant="discreet" color="yellow" href={link.url}>
              <Inline>
                <FiExternalLink />
                <div>{link.name}</div>
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
      {/* Flex container to make the link use block display */}
      <div className="flex">
        <Link href={entry.image.url}>
          <Image src={entry.image.url} alt={entry.image.name} height={400} />
        </Link>
      </div>
    </Section>
  );
};

const ContributeSection: FC<EntryPageProps> = ({ entry }) => {
  return (
    <Section title="Contribute">
      <div className="flex flex-wrap gap-3">
        {/* Edit */}
        <Highlight color="yellow">
          <Link variant="discreet" href={getRepoFileEditUrl(`data/vocabulary/${entry.path}`)}>
            <div className="dark:hover:text-ukraine-blue">
              <Inline>
                <FiEdit3 />
                <div>Edit information</div>
              </Inline>
            </div>
          </Link>
        </Highlight>

        {/* Report */}
        <Highlight color="yellow">
          <Link
            variant="discreet"
            href={getRepoNewIssueUrl({
              template: "bug-report.yml",
              labels: "bug",
              title: `${entry.correctSpelling}: <your issue>`,
              details: `Issue related to entry: [${entry.correctSpelling}](${new URL(`/i/${entry.id}`, import.meta.env.SITE_URL).toString()})`,
            })}
          >
            <div className="dark:hover:text-ukraine-blue">
              <Inline>
                <FiFlag />
                <div>Report issue</div>
              </Inline>
            </div>
          </Link>
        </Highlight>
      </div>
    </Section>
  );
};

const EntryPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const entry = vocabulary.find((e) => e.id === id);

  if (!entry) {
    return <NotFoundPage />;
  }

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
          "spelling",
          "ukraine",
          "english",
        ]}
        imageUrl={entry.image?.url}
      />

      <div className="space-y-6">
        <section>
          {/* Title */}
          <Heading>
            <div className="flex items-end gap-3">
              <div>{entry.correctSpelling}</div>
              <PronounceButton entry={entry} />
            </div>
          </Heading>

          {/* Misc info */}
          <div className="text-2xl font-light tracking-wide">
            {entry.sourceSpelling} • {entry.category}
          </div>
        </section>

        {/* Detailed info */}
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

export default EntryPage;
