import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Providers } from "./providers";
import { LoadingScreen } from "@/components/effects/loading-screen";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "SSS Grow Tech | Premium IT Services Agency",
    template: "%s | SSS Grow Tech",
  },
  description:
    "SSS Grow Tech delivers world-class software development, web development, mobile apps, AI solutions, UI/UX design, cloud solutions, digital marketing and IT consulting.",
  keywords: [
    "IT services",
    "software development",
    "web development",
    "mobile app development",
    "AI solutions",
    "UI/UX design",
    "cloud solutions",
    "digital marketing",
    "IT consulting",
    "SSS Grow Tech",
  ],
  authors: [{ name: "SSS Grow Tech" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "SSS Grow Tech",
    title: "SSS Grow Tech | Premium IT Services Agency",
    description:
      "We build, grow and scale your digital presence with world-class software, AI and cloud solutions.",
    images: [
      {
        url: "/sssgrow.jpg",
        width: 512,
        height: 512,
        alt: "SSS Grow Tech Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SSS Grow Tech | Premium IT Services Agency",
    description:
      "We build, grow and scale your digital presence with world-class software, AI and cloud solutions.",
    images: ["/sssgrow.jpg"],
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
    icon: "/sssgrow.jpg",
    shortcut: "/sssgrow.jpg",
    apple: "/sssgrow.jpg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafc" },
    { media: "(prefers-color-scheme: dark)", color: "#09090f" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <Providers>
          <LoadingScreen />
          {children}
        </Providers>
      </body>
    </html>
  );
}
