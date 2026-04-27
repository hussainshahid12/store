/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // allowedDevOrigins: ["192.168.0.104" , "pakbazar.vercel.app"],

images: {
    // Remove the old 'domains' array entirely
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.dummyjson.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
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
