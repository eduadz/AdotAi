import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Permite que o deploy seja concluído mesmo que o projeto tenha erros de TypeScript.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Permite que o deploy seja concluído mesmo que o projeto tenha erros de ESLint.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
