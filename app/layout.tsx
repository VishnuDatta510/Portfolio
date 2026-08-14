import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vishnu Datta - Web Developer",
  description:
    "Portfolio of Vishnu Datta — crafting digital experiences that merge stunning design with cutting-edge technology.",
};

export const viewport: Viewport = {
  themeColor: "#09090e",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* The 3D scene is fetched client-side; open the sockets early. */}
        <link rel="preconnect" href="https://prod.spline.design" />
        <link rel="preconnect" href="https://unpkg.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable}`}
        suppressHydrationWarning
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
