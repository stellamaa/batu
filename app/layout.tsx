import type { Metadata } from "next";
import "./globals.css";
import { bitcount, doublePivot, geistMono, geistSans, pressStart2P, wireOne } from "./fonts";
import { PasswordGate } from "./PasswordGate";

export const metadata: Metadata = {
  title: "Batu music",
  description: "DJ and producer Batu's website",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
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
        className={`${geistSans.variable} ${geistMono.variable} ${bitcount.variable} ${pressStart2P.variable} ${wireOne.variable} ${doublePivot.variable}`}
      >
        <PasswordGate>{children}</PasswordGate>
      </body>
    </html>
  );
}
