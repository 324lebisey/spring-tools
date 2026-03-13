import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Spring Tools — Productivity Tools for Spring",
    template: "%s | Spring Tools",
  },
  description: "10 beautifully crafted spring productivity tools. Plan your garden, declutter your home, prep meals, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
