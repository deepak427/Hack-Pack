import type { Metadata } from "next";
import { Playfair_Display, Lora, Caveat, Courier_Prime } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const courier = Courier_Prime({
  variable: "--font-courier",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "HackTrack AI - The Scholar's Strategy Journal",
    template: "%s | HackTrack AI"
  },
  description: "A sophisticated hackathon management system with elegant Scholar's Desk design for tracking participation, progress, and outcomes.",
  keywords: ["hackathon", "management", "tracker", "developer", "competition", "coding", "scholar", "strategy"],
  authors: [{ name: "HackTrack AI Team" }],
  creator: "HackTrack AI",
  publisher: "HackTrack AI",
  applicationName: "HackTrack AI",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  openGraph: {
    title: "HackTrack AI - The Scholar's Strategy Journal",
    description: "Track your hackathon journey with elegant design and smart features",
    type: "website",
    locale: "en_US",
    siteName: "HackTrack AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "HackTrack AI - The Scholar's Strategy Journal",
    description: "Track your hackathon journey with elegant design and smart features",
    creator: "@hacktrack_ai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${lora.variable} ${caveat.variable} ${courier.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
