import type { Metadata, Viewport } from "next";
import "./globals.css";
import { bitcount, doublePivot, geistMono, geistSans, pressStart2P, wireOne } from "./fonts";
import { PasswordGate } from "./PasswordGate";


const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://batumusic.net";

const SITE_DESCRIPTION =
  "Official site of Batu — DJ and producer known for modernist techno and experimental club music. Releases, tour dates, and newsletter.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Batu — DJ and Producer",
    template: "%s | Batu",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Batu",
  authors: [{ name: "Batu" }],
  creator: "Batu",
  publisher: "Batu",
  keywords: [
    "Batu",
    "Batu DJ",
    "Batu producer",
    "Timedance",
    "techno",
    "electronic music",
    "experimental club",
    "Exhale",
    "Donato Dozzy",
    "Opal",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Batu",
    title: "Batu — DJ and Producer",
    description: SITE_DESCRIPTION,
    url: "/",
    locale: "en_US",
    images: [
      {
        url: "/K7466-Album-Main.jpg",
        width: 1200,
        height: 1200,
        alt: "Batu & Donato Dozzy — Exhale (album cover)",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Batu — DJ and Producer",
    description: SITE_DESCRIPTION,
    images: ["/K7466-Album-Main.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  category: "music",
};

export const viewport: Viewport = {
  themeColor: "#A74814",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MusicGroup",
      "@id": `${SITE_URL}/#artist`,
      name: "Batu",
      url: SITE_URL,
      image: `${SITE_URL}/K7466-Album-Main.jpg`,
      description:
        "Batu is a DJ and producer hailed for his distinctive slant on modernist techno and experimental club music. His 2022 debut album Opal expanded his sound design into broader spheres of expression. As a DJ he performs at Glastonbury, Dekmantel, Sonar and Unsound.",
      genre: ["Techno", "Electronic", "Experimental Club"],
      sameAs: [
        "https://ra.co/dj/batu-uk",
        "https://batutimedance.bandcamp.com/",
        "https://www.instagram.com/batu_timedance/",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Batu",
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#artist` },
      inLanguage: "en",
    },
    {
      "@type": "MusicAlbum",
      name: "Exhale",
      byArtist: [
        { "@type": "MusicGroup", name: "Batu" },
        { "@type": "MusicGroup", name: "Donato Dozzy" },
      ],
      url: "https://k7.lnk.to/exhale",
      image: `${SITE_URL}/K7466-Album-Main.jpg`,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bitcount.variable} ${pressStart2P.variable} ${wireOne.variable} ${doublePivot.variable}`}
      >
        <PasswordGate>{children}</PasswordGate>
      </body>
    </html>
  );
}
