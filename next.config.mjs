/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        port: "",
      },
    ],
    domains: ["gateway.lighthouse.storage"],
  },
};

export default nextConfig;
