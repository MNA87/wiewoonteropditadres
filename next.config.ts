import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  // One address: www and the Railway address go to wiewoonteropditadres.nl (same path).
  async redirects() {
    return [
      { source: "/:path*", has: [{ type: "host", value: "www.wiewoonteropditadres.nl" }], destination: "https://wiewoonteropditadres.nl/:path*", permanent: true },
      { source: "/:path*", has: [{ type: "host", value: "(?<host>.*)\\.up\\.railway\\.app" }], destination: "https://wiewoonteropditadres.nl/:path*", permanent: true },
    ];
  },
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        // Only this site and the owner's Beheer (heatmap on enqueteplein.nl) may show pages in a frame.
        { key: "Content-Security-Policy", value: "frame-ancestors 'self' https://enqueteplein.nl" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        ...(process.env.NOINDEX === "1" ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] : []),
      ],
    }];
  },
};

export default nextConfig;
