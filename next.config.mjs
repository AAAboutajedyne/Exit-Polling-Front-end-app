/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },
  experimental: {
    staleTimes: {
      dynamic: 0
    }
  }
};

export default nextConfig;
