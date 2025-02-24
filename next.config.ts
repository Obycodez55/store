import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'images.unsplash.com',
      'res.cloudinary.com', // Keep this if you're using Cloudinary
      'lh3.googleusercontent.com', // Keep this if you're using Google Auth
    ],
  }
};

export default nextConfig;
