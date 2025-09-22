/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "http",
          hostname: "localhost",
          port: "3001",
          pathname: "/uploads/**", // Correto - usa glob pattern
        },
      ],
      unoptimized: true // Adicione esta linha para desenvolvimento
    },
  };
  
  export default nextConfig;