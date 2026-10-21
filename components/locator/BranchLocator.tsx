"use client";

import type * as Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import { LoaderIcon, MapIcon, SearchIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import branchFallback from "@/data/branch-fallback.json";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  createBranchPopup,
  createLatestRequest,
  isBranches,
  isCoordinates,
  isPsgcEntries,
  parseBranches,
  type Branch,
  type PsgcEntry,
} from "@/lib/locator";
import { readStoredJSON, removeStorage, writeStoredJSON } from "@/lib/storage";

const AGENCY_FILTERS = [
  "All Agencies",
  "DSWD",
  "PhilHealth",
  "Pag-IBIG",
  "SSS",
  "GSIS",
  "DOLE",
  "DOH",
  "OWWA",
];

/** Explicit literal classes so Tailwind keeps them in the bundle. */
const AGENCY_STYLES: Record<string, { bg: string; borderTop: string }> = {
  DSWD: { bg: "bg-red-500", borderTop: "border-t-red-500" },
  PhilHealth: { bg: "bg-green-500", borderTop: "border-t-green-500" },
  "Pag-IBIG": { bg: "bg-blue-600", borderTop: "border-t-blue-600" },
  SSS: { bg: "bg-indigo-600", borderTop: "border-t-indigo-600" },
  GSIS: { bg: "bg-purple-600", borderTop: "border-t-purple-600" },
  DOLE: { bg: "bg-orange-500", borderTop: "border-t-orange-500" },
  DOH: { bg: "bg-pink-600", borderTop: "border-t-pink-600" },
  OWWA: { bg: "bg-cyan-600", borderTop: "border-t-cyan-600" },
  Other: { bg: "bg-gray-500", borderTop: "border-t-gray-500" },
};

const LEGEND = [
  { label: "DSWD", className: "bg-red-500" },
  { label: "PhilHealth", className: "bg-green-500" },
  { label: "Pag-IBIG", className: "bg-blue-600" },
  { label: "SSS", className: "bg-indigo-600" },
  { label: "GSIS", className: "bg-purple-600" },
  { label: "DOLE", className: "bg-orange-500" },
  { label: "DOH", className: "bg-pink-600" },
  { label: "OWWA", className: "bg-cyan-600" },
];

// Reset legacy broad name matches, which included roads and unrelated shops.
const BRANCHES_KEY = "ayuda_branches_v2";
const BBOXES_KEY = "ayuda_cached_bboxes_v2";

export default function BranchLocator() {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const leafletRef = useRef<typeof Leaflet | null>(null);
  const markersRef = useRef<Leaflet.Marker[]>([]);
  const branchesRef = useRef<Branch[]>([]);
  const cachedBboxesRef = useRef<Set<string>>(new Set());

  const areaRequest = useRef(createLatestRequest());
  const agencyRef = useRef("All Agencies");

  const regionRequest = useRef(createLatestRequest());
  const locationRequest = useRef(createLatestRequest());

  useEffect(() => () => {
    areaRequest.current.cancel();
    regionRequest.current.cancel();
    locationRequest.current.cancel();
  }, []);

  const [ready, setReady] = useState(false);
  const [agency, setAgency] = useState("All Agencies");
  agencyRef.current = agency;
  const [searchLoading, setSearchLoading] = useState(false);
  const [regions, setRegions] = useState<PsgcEntry[]>([]);
  const [regionCode, setRegionCode] = useState("");
  const [provinces, setProvinces] = useState<PsgcEntry[]>([]);
  const [provinceCode, setProvinceCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [branchCount, setBranchCount] = useState(0);

  const createIcon = useCallback((agencyName: string) => {
    const L = leafletRef.current;
    if (!L) return undefined;
    const style = AGENCY_STYLES[agencyName] ?? AGENCY_STYLES.Other;
    const html = `
      <div class="relative flex flex-col items-center">
        <div class="absolute -bottom-[1.5px] left-1/2 -translate-x-1/2 w-5 h-1.5 bg-black/25 rounded-full blur-[1.5px]"></div>
        <div class="flex items-center justify-center w-8 h-8 rounded-full ${style.bg} text-white shadow-[0_6px_12px_rgba(0,0,0,0.35)] border-[2.5px] border-white relative z-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
        </div>
        <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] ${style.borderTop} -mt-1.5 relative z-10"></div>
      </div>
    `;
    return L.divIcon({
      html,
      className: "bg-transparent border-0",
      iconSize: [32, 40],
      iconAnchor: [16, 40],
      popupAnchor: [0, -36],
    });
  }, []);

  const renderMarkers = useCallback(
    (agencyFilter: string) => {
      const L = leafletRef.current;
      const map = mapRef.current;
      if (!L || !map) return;

      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      const list =
        agencyFilter === "All Agencies"
          ? branchesRef.current
          : branchesRef.current.filter((b) => b.agency === agencyFilter);

      list.forEach((branch) => {
        const marker = L.marker([branch.lat, branch.lng], {
          icon: createIcon(branch.agency),
        }).addTo(map);
        const style = AGENCY_STYLES[branch.agency] ?? AGENCY_STYLES.Other;
        marker.bindPopup(createBranchPopup(branch, style.bg));
        markersRef.current.push(marker);
      });
    },
    [createIcon],
  );

  const searchArea = useCallback(async () => {
    const map = mapRef.current;
    if (!map) return;
    const request = areaRequest.current.start();
    setSearchLoading(false);
    setError("");
    // Cached pins remain useful even if every public server is unavailable.
    renderMarkers(agencyRef.current);

    if (map.getZoom() < 12) {
      setError("Please zoom in closer to search for branches.");
      return;
    }

    if (branchesRef.current.length === 0 && cachedBboxesRef.current.size > 0) {
      cachedBboxesRef.current.clear();
      removeStorage(BBOXES_KEY);
    }

    const bounds = map.getBounds();
    const cacheKey = `${bounds.getSouth().toFixed(2)},${bounds.getWest().toFixed(2)},${bounds
      .getNorth()
      .toFixed(2)},${bounds.getEast().toFixed(2)}`;

    if (cachedBboxesRef.current.has(cacheKey)) {
      return;
    }

    setSearchLoading(true);
    const bbox = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`;

    try {
      const response = await fetch(`/api/branches?bbox=${encodeURIComponent(bbox)}`, {
        signal: request.signal,
      });
      if (!response.ok) throw new Error(`Branch search returned ${response.status}`);
      const incoming: unknown = await response.json();
      if (!isBranches(incoming)) throw new Error("Invalid branch response");
      if (!request.isCurrent()) return;
      const existingIds = new Set(branchesRef.current.map((b) => b.id));
      const unique = incoming.filter((b) => !existingIds.has(b.id));

      if (unique.length > 0) {
        branchesRef.current = [...branchesRef.current, ...unique];
        setBranchCount(branchesRef.current.length);
        writeStoredJSON(BRANCHES_KEY, branchesRef.current);
      }

      cachedBboxesRef.current.add(cacheKey);
      writeStoredJSON(BBOXES_KEY, Array.from(cachedBboxesRef.current));
      renderMarkers(agencyRef.current);
    } catch {
      if (request.isCurrent()) {
        setError(t(branchesRef.current.length > 0
          ? "locator.cachedBranchesNotice" : "locator.branchLookupUnavailable"));
      }
    } finally {
      if (request.isCurrent()) setSearchLoading(false);
    }
  }, [renderMarkers, t]);

  // Initialise the Leaflet map once the container is mounted.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;

      leafletRef.current = L;
      const map = L.map(containerRef.current).setView([14.5995, 121.0366], 13);
      L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          referrerPolicy: "strict-origin-when-cross-origin",
          maxZoom: 19,
        },
      ).addTo(map);
      mapRef.current = map;
      setReady(true);
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = [];
      }
    };
  }, []);

  // Restore cached and bundled branch locations once the map is ready.
  useEffect(() => {
    if (!ready) return;
    const cachedBranches = readStoredJSON(BRANCHES_KEY);
    const fallback = parseBranches(branchFallback);
    branchesRef.current = [...new Map(
      [...fallback, ...(isBranches(cachedBranches) ? cachedBranches : [])]
        .map(branch => [branch.id, branch]),
    ).values()];
    setBranchCount(branchesRef.current.length);
    const cachedBboxes = readStoredJSON(BBOXES_KEY);
    if (Array.isArray(cachedBboxes)) {
      cachedBboxes.filter((key): key is string => typeof key === "string")
        .forEach(key => cachedBboxesRef.current.add(key));
    }
    // The initial map has a dated local fallback; live requests are triggered
    // by Search Map Area or selecting a province instead of blocking first load.
    renderMarkers(agencyRef.current);
  }, [ready, renderMarkers]);

  // Re-render pins when the agency filter changes.
  useEffect(() => {
    if (ready) renderMarkers(agency);
  }, [agency, ready, renderMarkers]);

  // Load PSGC regions once, caching in localStorage.
  useEffect(() => {
    const cached = readStoredJSON("psgc_regions");
    if (isPsgcEntries(cached)) {
      setRegions(cached);
      return;
    }
    fetch("https://psgc.gitlab.io/api/regions")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch regions");
        return res.json();
      })
      .then((data: PsgcEntry[]) => {
        if (!isPsgcEntries(data)) throw new Error("Invalid regions");
        const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
        setRegions(sorted);
        writeStoredJSON("psgc_regions", sorted);
      })
      .catch((err) => console.error("Failed to fetch regions", err));
  }, []);

  const onRegionChange = async (code: string) => {
    const request = regionRequest.current.start();
    locationRequest.current.cancel();
    setLoading(false);
    setError("");
    setRegionCode(code);
    setProvinceCode("");
    setProvinces([]);
    if (!code) return;

    const cacheKey = `psgc_provinces_${code}`;
    const cached = readStoredJSON(cacheKey);
    if (isPsgcEntries(cached)) {
      setProvinces(cached);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [provRes, cityRes] = await Promise.all([
        fetch(`https://psgc.gitlab.io/api/regions/${code}/provinces`, { signal: request.signal }),
        fetch(`https://psgc.gitlab.io/api/regions/${code}/cities`, { signal: request.signal }),
      ]);
      const provData: PsgcEntry[] = provRes.ok ? await provRes.json() : [];
      const cityData: PsgcEntry[] = cityRes.ok ? await cityRes.json() : [];
      if (!request.isCurrent()) return;
      if (!isPsgcEntries(provData) || !isPsgcEntries(cityData)) throw new Error("Invalid locations");
      const combined = [...provData, ...cityData].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      setProvinces(combined);
      writeStoredJSON(cacheKey, combined);
    } catch {
      if (request.isCurrent()) setError("Failed to load locations. Please try again.");
    } finally {
      if (request.isCurrent()) setLoading(false);
    }
  };

  const onProvinceChange = async (code: string) => {
    const request = locationRequest.current.start();
    setProvinceCode(code);
    const map = mapRef.current;
    if (!code || !map) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const province = provinces.find((p) => p.code === code);
    const region = regions.find((r) => r.code === regionCode);
    if (!province || !region) {
      setLoading(false);
      return;
    }

    const query = `${province.name}, ${region.name}, Philippines`;
    const cacheKey = `geocode_${query.replace(/\s+/g, "_")}`;
    const cached = readStoredJSON(cacheKey);
    if (isCoordinates(cached)) {
      map.setView([cached.lat, cached.lng], 13);
      await searchArea();
      if (request.isCurrent()) setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
        { signal: request.signal },
      );
      if (!res.ok) throw new Error("Geocoding failed");
      const data: { lat: string; lon: string }[] = await res.json();
      if (!request.isCurrent()) return;
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        if (!isCoordinates({ lat, lng })) throw new Error("Invalid coordinates");
        map.setView([lat, lng], 13);
        writeStoredJSON(cacheKey, { lat, lng });
        await searchArea();
      } else {
        setError("Could not find coordinates for this location.");
      }
    } catch {
      if (request.isCurrent()) setError("Failed to locate province on map.");
    } finally {
      if (request.isCurrent()) setLoading(false);
    }
  };

  const selectClass =
    "w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 focus:border-primary-500 focus:outline-hidden focus:ring-1 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed";
  const labelClass =
    "text-xs font-bold text-gray-500 uppercase tracking-wide";

  return (
    <>
      <PageHeader
        title={t("locator.title")}
        subtitle={t("locator.desc")}
        crumbs={[{ label: t("nav.locator") }]}
        icon={<MapIcon className="h-6 w-6" />}
      />

      <div className="container mx-auto px-4 py-10">
        <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="agency-filter" className={labelClass}>
                {t("locator.filterBy")}
              </label>
              <select
                id="agency-filter"
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
                className={selectClass}
              >
                {AGENCY_FILTERS.map((item) => (
                  <option key={item} value={item}>
                    {item === "All Agencies" ? t("locator.allAgencies") : item}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="region-filter" className={labelClass}>
                {t("locator.selectRegion")}
              </label>
              <select
                id="region-filter"
                value={regionCode}
                onChange={(e) => onRegionChange(e.target.value)}
                className={selectClass}
              >
                <option value="">-- {t("locator.selectRegion")} --</option>
                {regions.map((region) => (
                  <option key={region.code} value={region.code}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="province-filter" className={labelClass}>
                {t("locator.selectProvince")}
              </label>
              <select
                id="province-filter"
                value={provinceCode}
                onChange={(e) => onProvinceChange(e.target.value)}
                disabled={!regionCode || provinces.length === 0}
                className={selectClass}
              >
                <option value="">-- {t("locator.selectProvince")} --</option>
                {provinces.map((province) => (
                  <option key={province.code} value={province.code}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
            <button
              type="button"
              onClick={searchArea}
              disabled={loading || searchLoading}
              className="flex items-center gap-2 bg-primary-50 hover:bg-primary-100 text-primary-600 px-4 py-2 rounded-md text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {loading || searchLoading ? (
                <LoaderIcon className="w-4 h-4 animate-spin" />
              ) : (
                <SearchIcon className="w-4 h-4" />
              )}
              {searchLoading ? t("locator.searchingBranches") : t("locator.searchMapArea")}
            </button>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-semibold text-gray-600 bg-gray-50 px-4 py-2.5 rounded-md border border-gray-100">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 mr-1">
                Legend
              </span>
              {LEGEND.map((entry) => (
                <div key={entry.label} className="flex items-center gap-1.5">
                  <span
                    className={cn("w-2.5 h-2.5 rounded-full", entry.className)}
                  />
                  <span>{entry.label}</span>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div role="status" className={cn(
              "mb-4 p-3 text-sm font-medium rounded-md",
              branchCount > 0 ? "bg-primary-50 text-primary-700" : "bg-error-50 text-error-600",
            )}>
              {error}
            </div>
          )}

          <div className="w-full h-[500px] rounded-lg overflow-hidden border border-gray-200 relative z-0">
            <div ref={containerRef} className="w-full h-full" />
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium text-gray-500">
            <p>
              Location data via Philippine Standard Geographic Code (PSGC). Map by
              OpenStreetMap.
            </p>
            {branchCount > 0 && (
              <p className="px-2 py-1 bg-gray-100 rounded-md whitespace-nowrap">
                Found {branchCount} branches cached.
              </p>
            )}
          </div>
          <p className="mt-2 text-xs text-gray-600">
            {t("locator.fallbackCoverage", {
              date: branchFallback.updated_at.slice(0, 10),
            })}
          </p>
        </div>
      </div>
    </>
  );
}
