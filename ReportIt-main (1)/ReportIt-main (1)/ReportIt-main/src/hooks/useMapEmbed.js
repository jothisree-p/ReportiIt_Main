import { useEffect, useState } from "react";
import { buildOsmMapEmbedUrl, geocodePlace } from "../utils/location";

const DEFAULT_MAP = buildOsmMapEmbedUrl(13.0827, 80.2707);

/** Keeps map iframe working in VS browser (OSM embed, not blocked like Google). */
export function useMapEmbed(mapQuery, address) {
  const [mapSrc, setMapSrc] = useState(DEFAULT_MAP);

  useEffect(() => {
    const query = (mapQuery || address || "").trim();
    if (!query) {
      setMapSrc(DEFAULT_MAP);
      return;
    }

    let cancelled = false;

    geocodePlace(query).then(({ lat, lon }) => {
      if (!cancelled) {
        setMapSrc(buildOsmMapEmbedUrl(lat, lon));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [mapQuery, address]);

  return mapSrc;
}
