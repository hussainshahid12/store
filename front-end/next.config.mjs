/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: ["picsum.photos", "images.unsplash.com", "cdn.dummyjson.com"],
  },

  // 🔥 ADD THIS (IMPORTANT)
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://pak-bazar-api.vercel.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;