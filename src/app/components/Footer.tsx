'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="text-gray-300 py-8 mt-12 border-t" style={{ backgroundColor: '#434343', borderColor: '#555555' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold mb-4">About VegaMovies</h3>
            <p className="text-sm text-gray-400">Your ultimate destination for downloading movies in HD quality.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="text-sm space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-white transition">Home</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Contact</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">DMCA</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold mb-4">Categories</h3>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition">Bollywood</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Hollywood</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Dual Audio</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-bold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="text-gray-300 hover:text-white transition">Telegram</a>
              <a href="#" className="text-gray-300 hover:text-white transition">Twitter</a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t pt-8 text-center text-sm" style={{ borderColor: '#555555' }}>
          <p className="text-gray-400">&copy; 2025 VegaMovies. All rights reserved.</p>
          <p className="text-xs mt-2 text-gray-500">Disclaimer: This site does not host any copyright content.</p>
        </div>
      </div>
    </footer>
  );
}
