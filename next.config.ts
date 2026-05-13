import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://srm-back-psi.vercel.app/api";
    return [
      {
        source: "/api-srv/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
