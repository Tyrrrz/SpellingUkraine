import Head from 'next/head';

interface MetaProps {
  title?: string;
  description?: string;
  keywords?: string[];
  imageUrl?: string;
}

export const Meta: React.FC<MetaProps> = ({ title, description, keywords, imageUrl }) => {
  const actualTitle = title ? title + ' • Spelling Ukraine' : 'Spelling Ukraine';

  const actualDescription =
    description ||
    'Look up the correct way to spell Ukrainian cities, names, and other words in English.';

  const actualKeywords = keywords?.join(', ') || 'spelling, ukraine, english, dictionary';

  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <title>{actualTitle}</title>
      <link rel="icon" href="/favicon.png" />

      <meta name="description" content={actualDescription} />
      <meta name="keywords" content={actualKeywords} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={actualTitle} />
      <meta property="og:description" content={actualDescription} />
      <meta property="og:image" content={imageUrl} />

      <meta name="twitter:title" content={actualTitle} />
      <meta name="twitter:creator" content="@Tyrrrz" />
      <meta name="twitter:card" content="summary" />
    </Head>
  );
};
