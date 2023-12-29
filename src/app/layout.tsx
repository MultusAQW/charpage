import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: '%s | AQW Charpage',
    default: "AQW Charpage"
  },
  description: "AQW Charpage built with Nextjs 14",
  icons: {
    icon: "https://account.aq.com/images/AQW/favicon.ico",
    apple: "https://account.aq.com/images/AQW/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#FDEFBE]`}>{children}</body>
    </html>
  );
}
