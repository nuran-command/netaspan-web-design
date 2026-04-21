import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-satoshi" });

export const metadata: Metadata = {
  title: "Netaspan | Custom Made Creativity",
  description: "High-end digital experience by Netaspan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-sans bg-[#0A2540] text-white overflow-x-hidden selection:bg-[#FF9F1C] selection:text-[#0A2540]">
        <div className="noise-overlay" />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
