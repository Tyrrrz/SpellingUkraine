import { FC, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    goatcounter?: {
      count?: (options?: { path?: string }) => void;
    };
  }
}

const Analytics: FC = () => {
  const url = import.meta.env.GOATCOUNTER_URL;
  const location = useLocation();
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (!url) {
      return;
    }

    // The initial page view is tracked automatically once the script loads.
    // Subsequent in-app (SPA) navigations need to be tracked manually, since
    // they don't trigger a full page (re)load.
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    window.goatcounter?.count?.({ path: location.pathname });
  }, [url, location.pathname]);

  if (!url) {
    return null;
  }

  return (
    <Helmet>
      <script data-goatcounter={url} async src="https://gc.zgo.at/count.js" />
    </Helmet>
  );
};

export default Analytics;
