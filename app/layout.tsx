import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jake Miller Realty | Homes for Sale in Austin, TX",
  description:
    "Buy or sell in Austin with Jake Miller. Browse featured listings in Barton Hills, Mueller and Cherrywood, and hear back in under 60 seconds.",
  openGraph: {
    title: "Jake Miller Realty | Austin, TX",
    description:
      "Find your dream home in Austin. Jake replies in under 60 seconds.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-cream text-ink">
        {children}
      </body>
    </html>
  );
}
