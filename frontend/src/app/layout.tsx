import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { CosmicOrbBackground } from "@/components/canvas/CosmicOrbBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VaultVision | AI-Powered Digital Asset Protection",
  description: "Stop Piracy. Protect Sports Media in Real-Time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased smooth-scroll`}
    >
      <body className="min-h-full flex flex-col bg-[#0a051d] text-foreground">
        <CosmicOrbBackground />
        <div className="flex-1 flex flex-col items-stretch w-full overflow-x-hidden relative z-10">
          <Navbar />
          <div className="flex flex-col min-h-screen">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
