import { FC, useCallback, useEffect, useRef } from "react";
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
  const basePath = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  const location = useLocation();
  const isInitialRender = useRef(true);
  const pendingPaths = useRef<string[]>([]);
  const flushIntervalId = useRef<number | null>(null);

  const flushPendingPageViews = useCallback(() => {
    if (!window.goatcounter?.count || pendingPaths.current.length === 0) {
      return false;
    }

    const paths = pendingPaths.current;
    pendingPaths.current = [];

    for (const path of paths) {
      window.goatcounter.count({ path });
    }

    return true;
  }, []);

  const stopFlushPolling = useCallback(() => {
    if (flushIntervalId.current === null) {
      return;
    }

    window.clearInterval(flushIntervalId.current);
    flushIntervalId.current = null;
  }, []);

  const ensureFlushPolling = useCallback(() => {
    if (flushIntervalId.current !== null) {
      return;
    }

    flushIntervalId.current = window.setInterval(() => {
      if (window.goatcounter?.count) {
        flushPendingPageViews();
        stopFlushPolling();
      }
    }, 250);
  }, [flushPendingPageViews, stopFlushPolling]);

  const handleScriptLoad = useCallback(() => {
    if (flushPendingPageViews() || window.goatcounter?.count) {
      stopFlushPolling();
    }
  }, [flushPendingPageViews, stopFlushPolling]);

  useEffect(
    () => () => {
      if (flushIntervalId.current !== null) {
        stopFlushPolling();
      }
    },
    [stopFlushPolling]
  );

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

    pendingPaths.current.push(
      `${basePath}${location.pathname}` + location.search + location.hash
    );

    if (flushPendingPageViews()) {
      return;
    }

    ensureFlushPolling();
  }, [
    url,
    basePath,
    location.pathname,
    location.search,
    location.hash,
    flushPendingPageViews,
    ensureFlushPolling,
  ]);

  if (!url) {
    return null;
  }

  return (
    <Helmet>
      <script
        data-goatcounter={url}
        async
        src="https://gc.zgo.at/count.js"
        onLoad={handleScriptLoad}
      />
    </Helmet>
  );
};

export default Analytics;
