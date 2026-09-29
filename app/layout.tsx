import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.prathvigroup.edu.in"
  ),
  title: {
    default: "Prathvi Group of College | Gwalior, MP",
    template: "%s | Prathvi Group of College",
  },
  description:
    "Prathvi Group of College in Gwalior, MP offers professional courses including MBA, B.Ed, D.Ed, Law, ITI, B.Pharma, D.Pharma and Distance Education. Quality education for your bright future.",
  keywords: [
    "Prathvi Group of College",
    "College Gwalior",
    "MBA Gwalior",
    "B.Ed Gwalior",
    "Law College Gwalior",
    "Distance Education MP",
    "ITI Gwalior",
    "Pharma College MP",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Prathvi Group of College",
    title: "Prathvi Group of College | Quality Education in Gwalior, MP",
    description:
      "Premier educational institution in Gwalior offering MBA, B.Ed, Law, ITI, Pharma courses and Distance Education.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prathvi Group of College",
    description: "Quality Education in Gwalior, MP",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className={`${poppins.className} antialiased`}>{children}</body>
    </html>
  );
}
