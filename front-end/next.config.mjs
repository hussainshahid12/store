/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // allowedDevOrigins: ["192.168.0.104" , "pakbazar.vercel.app"],

images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.dummyjson.com', // Allows ANY subdomain of dummyjson
      },
      {
        protocol: 'https',
        hostname: '**.photos', // Covers picsum.photos
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
    ],
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
