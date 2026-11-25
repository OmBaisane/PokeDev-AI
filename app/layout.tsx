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
    default: "PokeDev AI — Debug Smarter. Grow Stronger.",
    template: "%s | PokeDev AI",
  },
  description:
    "Understand JavaScript, TypeScript and Python errors with AI-powered debugging, evidence-first insights and saved analysis history.",
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
    title: "PokeDev AI — Debug Smarter. Grow Stronger.",
    description:
      "Understand your coding errors with AI-powered debugging, supporting evidence and saved analysis history.",
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
    title: "PokeDev AI — Debug Smarter. Grow Stronger.",
    description:
      "AI-powered debugging for JavaScript, TypeScript and Python developers.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0D",
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
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#0B0B0D] font-sans text-[#F5F2E9] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
