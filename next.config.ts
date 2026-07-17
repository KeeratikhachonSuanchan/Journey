import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Default 1MB is too small for slip photos uploaded from a phone camera.
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
