/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  images: {
    domains: ["images.ctfassets.net"],
    unoptimized: true, // Required for static export
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "index, follow",
          },
        ],
      },
    ];
  },
};

export default nextConfig;