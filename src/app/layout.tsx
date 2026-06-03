import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Datetify - Roadtrip Proposal 🚗💨",
  description: "A special proposal itinerary for our upcoming adventure. Will you say yes?",
  icons: {
    icon: "/road-trip.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-black text-zinc-100">
        {children}
      </body>
    </html>
  );
}
