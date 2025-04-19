import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spotify Stalker",
  description: "View and control Eduardo Couto spotify habits",
  authors: [
    {
      name: "Eduardo Couto",
      url: "https://eduardocouto.dev",
    },
  ],
  applicationName: "Eduardo Couto - Spotify Stalker",
  creator: "Eduardo Couto",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
