import { FC, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { resolvePath } from "../utils/assets";

declare global {
  interface Window {
    goatcounter?: {
      count?: (options?: { path?: string }) => void;
    };
  }
}

const Analytics: FC = () => {
  const location = useLocation();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const pendingPaths = useRef<string[]>([]);
  const scriptFailed = useRef(false);

  useEffect(() => {
    if (!import.meta.env.GOATCOUNTER_URL) {
      return;
    }

    scriptFailed.current = false;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://gc.zgo.at/count.js";
    script.dataset.goatcounter = import.meta.env.GOATCOUNTER_URL;
    script.dataset.goatcounterSettings = JSON.stringify({ no_onload: true });
    const onLoad = () => setIsScriptLoaded(true);
    const onError = () => {
      scriptFailed.current = true;
      pendingPaths.current = [];
    };
    script.addEventListener("load", onLoad);
    script.addEventListener("error", onError);
    document.head.appendChild(script);

    return () => {
      script.removeEventListener("load", onLoad);
      script.removeEventListener("error", onError);
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (!import.meta.env.GOATCOUNTER_URL) {
      pendingPaths.current = [];
      return;
    }

    if (scriptFailed.current) {
      return;
    }

    const path = resolvePath(location.pathname + location.search + location.hash);
    if (pendingPaths.current[pendingPaths.current.length - 1] !== path) {
      pendingPaths.current.push(path);
    }

    if (!isScriptLoaded || !window.goatcounter?.count) {
      return;
    }

    for (const pendingPath of pendingPaths.current) {
      window.goatcounter.count({ path: pendingPath });
    }

    pendingPaths.current = [];
  }, [isScriptLoaded, location.pathname, location.search, location.hash]);

  return null;
};

export default Analytics;
