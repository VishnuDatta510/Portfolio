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
  width: "device-width",
  initialScale: 1,
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
        {/* Hero mounts Spline only after the preloader intro, so fetch the
            scene now; mobile never shows it. */}
        <link
          rel="preload"
          href="https://prod.spline.design/sF4UdzWuD4EmnRZ2/scene.splinecode"
          as="fetch"
          crossOrigin="anonymous"
          media="(min-width: 769px)"
        />
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
