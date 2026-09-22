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
      /**
       * Force plain HTTP onto HTTPS. Without this the site answers 200 on
       * `http://ayudaph.org`, so every page is reachable over an insecure
       * scheme. Placed first so it also covers `http://www.ayudaph.org`,
       * which the www rule below would otherwise only fix for HTTPS.
       */
      {
        source: "/:path*",
        has: [{ type: "header", key: "x-forwarded-proto", value: "http" }],
        destination: "https://ayudaph.org/:path*",
        permanent: true,
      },
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
