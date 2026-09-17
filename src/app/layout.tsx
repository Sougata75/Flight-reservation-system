import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "NextFly | Seamless Flight Booking & Reservation System",
    template: "%s | NextFly",
  },
  description:
    "Book domestic and international flights easily with NextFly. Search routes, compare ticket prices, and manage your travel reservations seamlessly.",
  keywords: [
    "NextFly",
    "flight reservation system",
    "book flight tickets",
    "cheap airfare",
    "airline ticket booking",
    "domestic flights",
    "international flights",
    "flight search engine",
    "travel booking platform",
  ],
  authors: [{ name: "Sougata Bhunia" }],
  creator: "NextFly",
  publisher: "NextFly",
  applicationName: "NextFly",
  
  // Browser and device icons
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  // Open Graph for Facebook, Instagram, LinkedIn, and messaging apps
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "flight-reservation-system-alpha.vercel.app",
    title: "NextFly - Modern Flight Reservation System",
    description:
      "Find flights, compare low fares, and book tickets instantly with NextFly. Secure bookings and 24/7 travel support.",
    siteName: "NextFly",
    images: [
      {
        url: "/logo.png", // Recommended: 1200x630px logo banner
        width: 1200,
        height: 630,
        alt: "NextFly Flight Reservation System Preview",
      },
    ],
  },

  // Twitter / X Card
  twitter: {
    card: "summary_large_image",
    title: "NextFly - Book Flights & Search Tickets Online",
    description:
      "Quick, easy, and secure flight reservations with NextFly. Check routes and manage your travel plans anytime.",
    images: ["/logo.png"],
    creator: "@NextFly", // Replace with your brand handle
  },

  // Search Engine Crawlers
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-red-50">
        <Providers>
        {children}
        </Providers>
        </body>
    </html>
  );
}
