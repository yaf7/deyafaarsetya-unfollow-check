import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "UnfollowCheck — Instagram Unfollower Detector",
  description:
    "Cek siapa yang tidak follow back kamu di Instagram secara instan. Upload file data Instagram kamu dan temukan unfollowers dalam hitungan detik.",
  keywords: [
    "instagram",
    "unfollower",
    "unfollow check",
    "instagram checker",
    "who unfollowed me",
  ],
  openGraph: {
    title: "UnfollowCheck — Instagram Unfollower Detector",
    description:
      "Cek siapa yang tidak follow back kamu di Instagram. 100% privat, tanpa login.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
