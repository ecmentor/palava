import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  // TODO: update to the production domain once deployed (e.g. https://palavamarket.com)
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Palava Market — Society Marketplace",
  description: "Buy, sell, and discover services within Palava township.",
  icons: {
    icon: [
      { url: "/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icon-180.png",
  },
  openGraph: {
    title: "Palava Market — Society Marketplace",
    description: "Buy, sell, and discover services within Palava township.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased min-h-full font-sans">
        {children}
      </body>
    </html>
  );
}
