import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Daily Tasks - Build Better Habits",
  description: "Track your daily habits, compete with friends, and build a better you. A Farcaster mini app.",
  openGraph: {
    title: "Daily Tasks - Build Better Habits",
    description: "Track your daily habits, compete with friends, and build a better you.",
    images: ["/api/og?type=default"],
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "/api/og?type=default",
    "fc:frame:button:1": "🎯 Open App",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": "https://daily-tasks-mini.vercel.app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
