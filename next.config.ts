import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Program pages live at `/programs/:id`. The short-form `/program/:id`
   * shape is kept as a permanent redirect so older, shared, or hand-typed
   * links resolve to the canonical page instead of hitting the 404 route.
   *
   * `permanent: true` emits a 308 — vinext only reads `permanent`, so
   * `statusCode` must not be used here.
   */
  async redirects() {
    return [
      {
        source: "/program/:id",
        destination: "/programs/:id",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
