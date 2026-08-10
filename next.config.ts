import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    domains: ['drive.google.com'],
  },
};
export default nextConfig;
