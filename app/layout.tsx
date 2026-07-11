import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Admin Sign In | AgriBridge",
  description: "Secure access to the AgriBridge administration platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
