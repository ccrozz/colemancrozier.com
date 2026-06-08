import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import {
  Cormorant_Garamond,
  DM_Sans,
  JetBrains_Mono,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";

const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const heading = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coleman Crozier",
  description:
    "Agricultural economist, full-stack developer, and regenerative farmer based in Melbourne Beach, Florida.",
  metadataBase: new URL("https://colemancrozier.com"),
  openGraph: {
    title: "Coleman Crozier",
    description: "Land. Sea. Data.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${heading.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
