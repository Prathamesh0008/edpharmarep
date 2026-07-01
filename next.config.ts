import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i0.wp.com",
      },
      {
        protocol: "https",
        hostname: "www.centurionremedies.com",
      },
      {
        protocol: "https",
        hostname: "sunriseremedies.in",
      },
    ],
  },
};

export default nextConfig;
