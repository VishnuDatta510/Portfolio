import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import PageTransition from "@/components/PageTransition";
import "./globals.css";

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vishnu Datta — Full-stack Engineer",
  description:
    "Vishnu Datta is a full-stack engineer building the systems behind products, from media pipelines and APIs to the interfaces people touch.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0c0d0e",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sans.variable} ${mono.variable} ${serif.variable}`}
        suppressHydrationWarning
      >
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div className="sheet-grid" aria-hidden="true" />
        <SmoothScroll />
        <Cursor />
        {children}
        <PageTransition />
        <Analytics />
      </body>
    </html>
  );
}
