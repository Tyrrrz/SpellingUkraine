import Head from 'next/head';
import { FC } from 'react';
import { getBuildId, getSiteUrl } from '../utils/env';

type MetaProps = {
  title?: string;
  description?: string;
  keywords?: string[];
  imageUrl?: string;
};

const Meta: FC<MetaProps> = ({ title, description, keywords, imageUrl }) => {
  const siteName = 'Spelling Ukraine';

  const buildId = getBuildId();

  const actualTitle = title ? title + ' • ' + siteName : siteName;

  const actualDescription =
    description ||
    'Look up the correct English spelling of Ukrainian place names, personal names, and other words. Support Ukraine, transliterate correctly!';

  const actualKeywords = (keywords || ['spelling', 'ukraine', 'english']).join(',');

  const actualImageUrl = getSiteUrl(imageUrl || '/logo.png');

  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <title>{actualTitle}</title>
      <link rel="icon" href="/favicon.png" />
      <link rel="manifest" href="/manifest.json" />

      <meta name="application-name" content={siteName} />
      <meta name="build-id" content={buildId} />
      <meta name="description" content={actualDescription} />
      <meta name="keywords" content={actualKeywords} />
      <meta name="theme-color" content="#facc15" />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={actualTitle} />
      <meta property="og:description" content={actualDescription} />
      <meta property="og:image" content={actualImageUrl} />

      <meta name="twitter:title" content={actualTitle} />
      <meta name="twitter:creator" content="@Tyrrrz" />
      <meta name="twitter:card" content="summary" />
    </Head>
  );
};

export default Meta;
