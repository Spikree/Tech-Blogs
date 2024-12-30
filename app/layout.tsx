import type { Metadata } from "next";

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
      <body>{children}</body>
      </Provider>
      
    </html>
  );
}
