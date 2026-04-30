import { Geist, Geist_Mono, Press_Start_2P, Wire_One } from "next/font/google";
import localFont from "next/font/local";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const pressStart2P = Press_Start_2P({
  variable: "--font-press-start-2p",
  weight: "400",
  subsets: ["latin"],
});

export const wireOne = Wire_One({
  variable: "--font-wire-one",
  weight: "400",
  subsets: ["latin"],
});

export const bitcount = localFont({
  src: "../public/bitcount-grid-double-ink.ttf",
  variable: "--font-bitcount",
  display: "swap",
});

export const doublePivot = localFont({
  src: "../public/double-pivot.ttf",
  variable: "--font-double-pivot",
  display: "swap",
});
