/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  // Enable static export for offline functionality
  images: {
    domains: ['images.ctfassets.net'],
    unoptimized: true, // Required for static export
  },
};

export default nextConfig;
