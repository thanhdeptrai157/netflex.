import type { Metadata } from "next";
import { Lora, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ToastContainer } from "react-toastify";


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
  openGraph: {
    title: "Netflex - Film",
    description: "Powered by NCT",
    url: "https://netflex-film.vercel.app",
    siteName: "Netflex",
    images: [
      {
        url: "https://netflex-film.vercel.app/og.png",
        width: 1200,
        height: 630,
        alt: "Netflex Film - Xem phim",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${lora.variable} ${geistMono.variable} antialiased  text-white ` }
        style={{ fontFamily: "var(--font-lora)" }} 
      >
        <ToastContainer position="top-center" theme="dark" />
        <Header />
        <div className="px-3 md:px-5 lg:px-10 bg-slate-800">
          {children}
        </div>
      </body>
    </html>
  );
}
