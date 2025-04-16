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
  icons: {
    icon: "/logo-small.png"
  },
  verification: {
    google: "G2TD8XixScTKgr8VOdwrmrTUiIYj43xiOsmVa0gpEhE",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
  keywords: ["Phim", "Xem phim", "Netflex", "Phim miễn phí"],
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
        <div className="px-3 md:px-5 lg:px-10 bg-slate-800">
          {children}
        </div>
      </body>
    </html>
  );
}
