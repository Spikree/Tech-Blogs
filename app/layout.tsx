import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";
import Provider from "@/components/shared/Provider";

export const metadata: Metadata = {
  title: "Tech Blogs",
  description: "Share Blogs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider>
      <body>{children} <Toaster/></body>
      </Provider>
      
    </html>
  );
}
