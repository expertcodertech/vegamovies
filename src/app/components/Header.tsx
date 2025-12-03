'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Disclaimer', href: '#' },
    { label: 'DMCA', href: '#' },
    { label: 'Vegamovies 4K', href: '#' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search
      console.log('Search:', searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: '#434343' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Header */}
         <div className="hidden md:flex items-center justify-between py-2">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/vegamovies.webp" alt="VegaMovies Logo" className="h-6 w-auto" />
          </Link>

          {/* Nav Items */}
          <nav className="hidden lg:flex items-center gap-4 mx-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors font-medium text-xs xl:text-sm"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2 flex-shrink-0">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white text-black px-3 py-1 rounded text-xs sm:text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 sm:px-6 py-1 rounded font-semibold transition-colors text-xs sm:text-sm"
            >
              Search
            </button>
          </form>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between py-2">
          <Link href="/" className="flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/vegamovies.webp" alt="VegaMovies Logo" className="h-5 w-auto" />
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-800">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <form onSubmit={handleSearch} className="p-4 border-t border-gray-800 flex gap-2">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-white text-black px-3 py-2 rounded text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
              >
                <Search size={18} />
              </button>
            </form>
          </nav>
        )}
      </div>
    </header>
  );
}
