import { FC } from "react";
import { Helmet } from "react-helmet-async";
import { resolveAbsoluteUrl, resolvePath } from "../utils/assets";

type MetaProps = {
  title?: string;
  description?: string;
  keywords?: string[];
  imageUrl?: string;
};

const Meta: FC<MetaProps> = ({ title, description, keywords, imageUrl }) => {
  const siteName = "SpellingUkraine";

  const actualTitle = title ? title + " • " + siteName : siteName;

  const actualDescription =
    description ||
    "Look up the correct English spelling of Ukrainian toponyms, personal names, and other words. Support Ukraine, transliterate correctly!";

  const actualKeywords = (keywords || ["spelling", "ukraine", "english"]).join(",");

  const actualImageUrl = resolveAbsoluteUrl(imageUrl || "/logo.png");

  return (
    <Helmet>
      <title>{actualTitle}</title>

      <link rel="icon" href={resolvePath("/favicon.png")} />
      <link rel="manifest" href={resolvePath("/manifest.webmanifest")} />

      <meta name="application-name" content={siteName} />
      <meta name="build-id" content={import.meta.env.BUILD_ID} />
      <meta name="description" content={actualDescription} />
      <meta name="keywords" content={actualKeywords} />
      <meta name="theme-color" content="#ffd700" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={actualTitle} />
      <meta property="og:description" content={actualDescription} />
      <meta property="og:image" content={actualImageUrl} />

      <meta name="twitter:title" content={actualTitle} />
      <meta name="twitter:creator" content="@Tyrrrz" />
      <meta name="twitter:card" content="summary" />
    </Helmet>
  );
};

export default Meta;
