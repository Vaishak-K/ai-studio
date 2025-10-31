import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // Disable optimization locally (so localhost images work)
    unoptimized: true,

    remotePatterns:
      process.env.NODE_ENV === "production"
        ? [
            {
              protocol: "http",
              hostname: "localhost",
              port: "3001",
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
