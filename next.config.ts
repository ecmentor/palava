import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Local SVG placeholders are trusted (bundled with the app, not user-uploaded)
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        // Allow images from any Supabase project storage
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
