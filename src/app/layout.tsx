import type { Metadata } from "next";
import { Marcellus } from "next/font/google";
import "./globals.css";
import "../../styles/colors.scss";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/footer";
import Script from "next/script";
import { CartProvider } from "./cart";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@/components/Providers/user-provider";
import { Suspense } from "react";
import Loading from "@/components/Loading";
import { WishlistProvider } from "@/components/Providers/wish-list-provider";

const marcellus = Marcellus({ subsets: ["latin"], weight: ["400"] });

export const metadata: Metadata = {
  title: "Saliah foods",
  description: "Enjoy the best quality food at the best price",

};
export const fetchCache = "force-no-store";
export const dynamic = "force-dynamic";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <html lang="en">
        <body className={marcellus.className}>
        <WishlistProvider>
            <UserProvider>
              <Header />
              <Suspense fallback={<Loading />}>
                <div> {children}</div>
              </Suspense>
              <Footer />
              <Toaster position="top-right" />
            </UserProvider>
          </WishlistProvider>
        </body>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      </html>
    </CartProvider>
  );
}
