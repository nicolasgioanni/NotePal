/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/documents",
        destination: "/dashboard",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
