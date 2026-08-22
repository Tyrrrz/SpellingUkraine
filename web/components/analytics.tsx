import { FC, useEffect, useState } from "react";
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

  useEffect(() => {
    if (!import.meta.env.GOATCOUNTER_URL) {
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://gc.zgo.at/count.js";
    script.dataset.goatcounter = import.meta.env.GOATCOUNTER_URL;
    script.dataset.goatcounterSettings = JSON.stringify({ no_onload: true });
    script.addEventListener("load", () => setIsScriptLoaded(true));
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
      setIsScriptLoaded(false);
    };
  }, []);

  useEffect(() => {
    if (!import.meta.env.GOATCOUNTER_URL || !isScriptLoaded) {
      return;
    }

    window.goatcounter?.count?.({ path: resolvePath(location.pathname) });
  }, [isScriptLoaded, location.pathname]);

  return null;
};

export default Analytics;
