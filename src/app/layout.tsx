import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lunera",
  description: "Інтернет-магазин жіночого одягу",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className="flex min-h-screen flex-col bg-white text-neutral-900">
        <Header />

        <div className="flex-1">{children}</div>

        <Footer />
      </body>
    </html>
  );
}