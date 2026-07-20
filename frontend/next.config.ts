import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self' http://localhost:* http://127.0.0.1:*" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }
        ]
      }
    ];
  }
};

export default nextConfig;
