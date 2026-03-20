/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.infrastructureLogging = { level: "error" };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
