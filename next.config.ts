import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * `www.ayudaph.org` is attached as a custom domain so it cannot 404, but the
   * canonical origin is the apex. This rule runs first so any www request is
   * redirected before the path rules below can match, keeping the site on a
   * single hostname instead of serving duplicate content on two.
   */
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.ayudaph.org" }],
        destination: "https://ayudaph.org/:path*",
        permanent: true,
      },
      /**
       * Program pages live at `/programs/:id`. The short-form `/program/:id`
       * shape is kept as a permanent redirect so older, shared, or hand-typed
       * links resolve to the canonical page instead of hitting the 404 route.
       *
       * `permanent: true` emits a 308 — vinext only reads `permanent`, so
       * `statusCode` must not be used here.
       */
      {
        source: "/program/:id",
        destination: "/programs/:id",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
