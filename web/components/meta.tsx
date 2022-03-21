import Head from 'next/head';
import { getAbsoluteUrl } from '../utils/env';

interface MetaProps {
  title?: string;
  description?: string;
  keywords?: string[];
  imageUrl?: string;
}

const Meta: React.FC<MetaProps> = ({ title, description, keywords, imageUrl }) => {
  const actualTitle = title ? title + ' • Spelling Ukraine' : 'Spelling Ukraine';

  const actualDescription =
    description ||
    'Look up the correct way to spell Ukrainian place names, personal names, and other words in English. Support Ukraine, transliterate correctly!';

  const actualKeywords = (keywords || ['spelling', 'ukraine', 'english']).join(',');

  const actualImageUrl = imageUrl || '/logo.png';

  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <title>{actualTitle}</title>
      <link rel="icon" href="/favicon.png" />
      <link rel="manifest" href="/manifest.json" />

      <meta name="application-name" content="Spelling Ukraine" />
      <meta name="description" content={actualDescription} />
      <meta name="keywords" content={actualKeywords} />
      <meta name="theme-color" content="#facc15" />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Spelling Ukraine" />
      <meta property="og:title" content={actualTitle} />
      <meta property="og:description" content={actualDescription} />
      <meta property="og:image" content={getAbsoluteUrl(actualImageUrl)} />

      <meta name="twitter:title" content={actualTitle} />
      <meta name="twitter:creator" content="@Tyrrrz" />
      <meta name="twitter:card" content="summary" />
    </Head>
  );
};

export default Meta;
