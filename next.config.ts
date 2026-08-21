import type { NextConfig } from "next";

// No third-party origins at runtime (fonts are self-hosted by next/font),
// so the CSP can be strict. 'unsafe-inline' script-src is required by the
// inline bootstrap/RSC payload of statically prerendered Next.js pages;
// external script origins remain blocked. blob: img-src is required by the
// estimate form's upload previews (URL.createObjectURL). 'unsafe-eval' is
// dev-only: React dev mode uses eval() for debugging (callstack
// reconstruction); production React never does.
const isDev = process.env.NODE_ENV === "development";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "connect-src 'self'",
  "font-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  experimental: {
    // Estimate-form photo attachments arrive as multipart FormData. The
    // client downscales before submit and the action caps totals at 10MB;
    // Vercel additionally caps request bodies around 4.5MB.
    serverActions: { bodySizeLimit: "5mb" },
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Pre-generated derivatives are content-hashed, safe to cache forever.
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
