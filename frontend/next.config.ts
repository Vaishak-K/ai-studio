import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Disable optimization locally (so localhost images work)
    unoptimized: process.env.NODE_ENV === "development",

    // Allow remote image domains for production
    remotePatterns:
      process.env.NODE_ENV === "production"
        ? [
            {
              protocol: "https",
              hostname: "your-production-domain.com", // ⬅️ replace with your real backend domain
            },
          ]
        : [
            {
              protocol: "http",
              hostname: "localhost",
              port: "3001",
            },
          ],
  },

  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
