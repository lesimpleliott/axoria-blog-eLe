/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "axoriapullzone.b-cdn.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
