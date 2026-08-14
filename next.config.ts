import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Estimate-form photo attachments arrive as multipart FormData. The
    // client downscales before submit; this is headroom, not the real cap
    // (Vercel request bodies top out around 4.5MB regardless).
    serverActions: { bodySizeLimit: "15mb" },
  },
  async headers() {
    // Pre-generated derivatives are content-hashed, safe to cache forever.
    return [
      {
        source: "/img/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/media/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
