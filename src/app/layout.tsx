import type { Metadata } from "next";
import { Lora, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";


const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "700"], 
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Netflex - Film",
  description: "Powered by NCT",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${lora.variable} ${geistMono.variable} antialiased  text-white`}
        style={{ fontFamily: "var(--font-lora)" }} 
      >
        <Header />
        <div className="px-3 md:px-7 lg:px-15 bg-slate-800">
          {children}
        </div>
      </body>
    </html>
  );
}
