import type { Metadata } from "next";
import { Geist, Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";

// 1. Clean Data/UI Font
const fontGeist = Geist({ 
  subsets: ["latin"], 
  variable: "--font-geist" 
});

// 2. Authoritative Display/Header Font
const fontDisplay = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  variable: "--font-display" 
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Resolvr | AI Support Ops",
  description: "Multi-tenant AI agent platform for customer support ops.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontGeist.variable} ${fontDisplay.variable} font-sans antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}