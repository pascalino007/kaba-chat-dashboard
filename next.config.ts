import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

    allowedDevOrigins: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "https://5492e15a1a56.ngrok-free.app",
      "https://studio.apollographql.com",
      "http://*.local-origin.dev",
      "http://10.0.0.0/8",     // allow local network (10.x.x.x)
      "http://192.168.0.0/16", // allow local network (192.168.x.x)
    ],
  
};

export default nextConfig;




