import { fetchBranches } from "@/lib/branches";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const bbox = new URL(request.url).searchParams.get("bbox");
  const values = bbox?.split(",");
  const coordinates = values?.map(Number);
  if (!values || values.some(value => !value.trim()) || !coordinates || coordinates.length !== 4 ||
      !coordinates.every(Number.isFinite)) {
    return Response.json({ error: "Invalid map bounds" }, { status: 400 });
  }
  const [south, west, north, east] = coordinates;
  if (south < -90 || north > 90 || west < -180 || east > 180 ||
      south >= north || west >= east || north - south > 1 || east - west > 1) {
    return Response.json({ error: "Zoom in to search a smaller area" }, { status: 400 });
  }
  try {
    const branches = await fetchBranches(coordinates.join(","), request.signal);
    return Response.json(branches, {
      headers: { "Cache-Control": "public, max-age=300, s-maxage=600" },
    });
  } catch {
    return Response.json({ error: "Branch search temporarily unavailable" }, {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
