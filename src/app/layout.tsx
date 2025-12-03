'use client';

import type { Metadata } from "next";
import { MovieProvider } from "./context/MovieContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-black">
        <MovieProvider>
          <Header />
          {children}
          <Footer />
        </MovieProvider>
      </body>
    </html>
  );
}