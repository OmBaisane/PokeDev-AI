import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "PokeDev AI — Level Up Your Developer Journey",
    template: "%s | PokeDev AI",
  },
  description:
    "Your AI-powered developer learning companion. Learn coding concepts, practice skills, and level up your developer journey.",
  applicationName: "PokeDev AI",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "PokeDev AI — Level Up Your Developer Journey",
    description:
      "Your AI-powered developer learning companion. Learn, practice, and grow.",
    siteName: "PokeDev AI",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PokeDev AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PokeDev AI — Level Up Your Developer Journey",
    description:
      "Your AI-powered developer learning companion. Learn, practice, and grow.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#17152B",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#0B0A14] font-sans text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
