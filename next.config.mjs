/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/documents",
        destination: "/dashboard",
        permanent: false,
      },
      {
        source: "/quiz/practice",
        destination: "/dashboard",
        permanent: false,
      },
      {
        source: "/quiz",
        destination: "/dashboard",
        permanent: false,
      },
      {
        source: "/flashcards",
        destination: "/dashboard",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
