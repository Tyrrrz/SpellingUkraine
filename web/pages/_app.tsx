import type { AppProps } from 'next/app';
import Script from 'next/script';
import { FC, ReactNode } from 'react';
import Meta from '../components/meta';
import { getGoogleAnalyticsId, isProduction } from '../utils/env';
import './globals.css';

const Scripts: FC = () => {
  const scripts: ReactNode[] = [];

  // Google Analytics (production build only)
  if (getGoogleAnalyticsId() && isProduction()) {
    scripts.push(
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${getGoogleAnalyticsId()}`}
        strategy="afterInteractive"
      />,

      <Script id="google-analytics" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${getGoogleAnalyticsId()}');
`}
      </Script>
    );
  }

  return <>{scripts}</>;
};

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Meta />
      <Component {...pageProps} />
      <Scripts />
    </>
  );
};

export default App;
