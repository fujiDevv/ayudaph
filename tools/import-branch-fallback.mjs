/** Import a successful Overpass export for the initial Metro Manila map area. */
import { readFileSync, writeFileSync } from "node:fs";

const input = process.argv[2];
if (!input) throw new Error("Usage: node tools/import-branch-fallback.mjs <overpass-export.json>");
const data = JSON.parse(readFileSync(input, "utf8"));
if (data.remark || !Array.isArray(data.elements)) throw new Error("Cannot import a failed or partial query");
const elements = data.elements.filter(element =>
  ["government", "insurance"].includes(element.tags?.office) && typeof element.tags?.name === "string",
).map(element => ({
  type: element.type,
  id: element.id,
  ...(element.center ? { center: element.center } : { lat: element.lat, lon: element.lon }),
  tags: Object.fromEntries(Object.entries(element.tags).filter(([key]) =>
    ["name", "office", "addr:housenumber", "addr:street", "addr:city"].includes(key),
  )),
}));
if (!elements.length) throw new Error("No agency offices found in the export");
const snapshot = {
  source: "https://www.openstreetmap.org",
  license: "https://opendatacommons.org/licenses/odbl/1-0/",
  attribution: "© OpenStreetMap contributors",
  updated_at: data.osm3s?.timestamp_osm_base ?? new Date().toISOString(),
  coverage: "Metro Manila initial map area",
  bounds: [14.558, 120.956, 14.641, 121.118],
  elements,
};
writeFileSync(new URL("../data/branch-fallback.json", import.meta.url), JSON.stringify(snapshot, null, 2) + "\n");
console.log(`Imported ${elements.length} OSM agency offices`);
