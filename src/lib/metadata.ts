import type { Metadata } from "next";
import { siteConfig } from "./site";
import { siteImages } from "./images";

const DEFAULT_OG_IMAGE = {
  url: siteImages.calibrationSetup,
  alt: "Mobile ADAS calibration setup at a repair shop",
  width: 1200,
  height: 630,
};

type PageMetadataOptions = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: {
    url: string;
    alt?: string;
  };
};

export function createMetadata({
  title,
  description,
  path = "",
  keywords = [],
  image,
}: PageMetadataOptions): Metadata {
  const url = `${siteConfig.url}${path}`;
  const fullTitle =
    title.includes(siteConfig.name) ? title : `${title} | ${siteConfig.name}`;

  const ogImage = {
    url: image?.url || DEFAULT_OG_IMAGE.url,
    alt: image?.alt || DEFAULT_OG_IMAGE.alt,
  };

  const verificationCode = process.env.GOOGLE_SITE_VERIFICATION?.trim();

  return {
    title: fullTitle,
    description,
    keywords: [
      "ADAS calibration",
      "mobile ADAS",
      "Ottawa",
      "collision repair",
      ...keywords,
    ],
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage.url],
    },
    robots: {
      index: true,
      follow: true,
    },
    ...(verificationCode
      ? { verification: { google: verificationCode } }
      : {}),
  };
}
