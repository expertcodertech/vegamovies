'use client';

import { MovieProvider } from "./context/MovieContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import StructuredData from "./components/StructuredData";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="VegaMovies - Download and watch HD movies for free. Latest Bollywood, Hollywood, and Web Series in high quality." />
        <meta name="keywords" content="vegamovies, download movies, HD movies, Bollywood movies, Hollywood movies, web series, free movies" />
        <meta property="og:title" content="VegaMovies - Download Free HD Movies" />
        <meta property="og:description" content="Your ultimate destination for downloading movies in HD quality" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://vegamovies.com" />
        <title>VegaMovies - Download Free HD Movies & Web Series</title>
        <StructuredData />
      </head>
      <body suppressHydrationWarning className="bg-black">
        <MovieProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </MovieProvider>
      </body>
    </html>
  );
}