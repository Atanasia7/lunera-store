import type { Metadata } from "next";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import { FavoritesProvider } from "@/components/FavoritesProvider";
import { StorageIdentityProvider } from "@/components/StorageIdentityProvider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Lunera",
  description:
    "Інтернет-магазин жіночого одягу",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        <StorageIdentityProvider>
          <FavoritesProvider>
            <CartProvider>
              <Header />

              <div className="flex-1">
                {children}
              </div>

              <Footer />
            </CartProvider>
          </FavoritesProvider>
        </StorageIdentityProvider>
      </body>
    </html>
  );
}