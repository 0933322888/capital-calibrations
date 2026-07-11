import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingCallButton } from "@/components/FloatingCallButton";
import { LocalBusinessJsonLd } from "@/components/JsonLd";
import { createMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  ...createMetadata({
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    keywords: [
      "mobile ADAS calibration Ottawa",
      "ADAS calibration services",
      "collision repair ADAS",
    ],
  }),
  icons: {
    icon: "/images/section-image.png",
    apple: "/images/section-image.png",
  },
  openGraph: {
    ...createMetadata({
      title: `${siteConfig.name} | ${siteConfig.tagline}`,
      description: siteConfig.description,
    }).openGraph,
    images: [{ url: "/images/about-1.png", alt: "Mobile ADAS calibration setup" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-CA" className={`${inter.variable} ${jetbrains.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <LocalBusinessJsonLd />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingCallButton />
      </body>
    </html>
  );
}
