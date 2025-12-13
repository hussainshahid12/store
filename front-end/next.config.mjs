/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["picsum.photos" ,"images.unsplash.com"], // allow Picsum images
  },
};

export default nextConfig;
