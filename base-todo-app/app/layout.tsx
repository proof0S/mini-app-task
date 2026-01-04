import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Daily Tasks | Base Mini App',
  description: 'Build better habits with Daily Tasks - A beautiful task manager for Farcaster',
  openGraph: {
    title: 'Daily Tasks',
    description: 'Build better habits, one task at a time',
    images: ['/images/og-image.png'],
  },
  other: {
    'fc:frame': JSON.stringify({
      version: "next",
      imageUrl: `${process.env.NEXT_PUBLIC_URL || 'https://your-app.vercel.app'}/images/og-image.png`,
      button: {
        title: "✨ Open App",
        action: {
          type: "launch_frame",
          name: "Daily Tasks",
          url: process.env.NEXT_PUBLIC_URL || 'https://your-app.vercel.app',
          splashImageUrl: `${process.env.NEXT_PUBLIC_URL || 'https://your-app.vercel.app'}/images/splash.png`,
          splashBackgroundColor: "#0066CC"
        }
      }
    })
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
