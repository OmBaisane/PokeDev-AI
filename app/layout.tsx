import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "PokeDev AI — TRAIN. CODE. EVOLVE.",
    template: "%s | PokeDev AI",
  },
  description:
    "Your AI-powered debugging assistant and gamified developer learning companion. Understand errors, practice coding, earn XP and evolve.",
  applicationName: "PokeDev AI",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    title: "PokeDev AI — TRAIN. CODE. EVOLVE.",
    description:
      "Debug smarter, practice coding and grow stronger with your AI-powered developer companion.",
    siteName: "PokeDev AI",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PokeDev AI — Developer Learning Companion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PokeDev AI — TRAIN. CODE. EVOLVE.",
    description: "AI-powered debugging and gamified developer learning.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#D6A84B",
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
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetBrainsMono.variable} min-h-screen bg-[#0B0B0D] font-sans text-[#F5F2E9] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
