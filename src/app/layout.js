import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import NotificationBell from "@/components/NotificationBell";
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const metadata = {
  metadataBase: new URL("https://yourdomain.com"),

  title: {
    default: "TwinFlames – The Ultimate Couple Connection Experience",
    template: "%s | TwinFlames",
  },

  description:
    "TwinFlames is your romantic couple platform to build and celebrate your love story digitally. Create beautiful timelines, take fun relationship quizzes, share memories, and deepen your twin flame or soulmate journey together.",

  keywords: [
    "twin flame app",
    "couple relationship app",
    "love timeline app",
    "couple quiz app",
    "soulmate connection app",
    "digital love story",
  ],

  openGraph: {
    title: "TwinFlames – Build Your Love Story Together",
    description:
      "Create shared timelines, take quizzes, save precious memories, and grow closer as a couple.",
    url: "https://yourdomain.com",
    siteName: "TwinFlames",
    images: [
      {
        url: "/og-twinflames.png",
        width: 1200,
        height: 630,
        alt: "TwinFlames – Create & Celebrate Your Romantic Love Journey",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "TwinFlames – Build Your Love Story Together",
    description:
      "A romantic platform for couples: timelines, quizzes, memories, and deeper connections.",
    images: ["/og-twinflames.png"],
  },

  alternates: {
    canonical: "https://yourdomain.com",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased light`}
      >
      <Suspense fallback={<div>Loading auth...</div>}>
          <AuthProvider>
             <Navbar />
            
            {children}
          </AuthProvider>
        </Suspense>
      </body> 
    </html>
  );
}
