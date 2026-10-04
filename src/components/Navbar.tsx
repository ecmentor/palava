'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, Plus } from 'lucide-react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Palava Market"
              width={752}
              height={351}
              className="h-16 w-auto"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-4">
            <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Contact
            </Link>
            <Link
              href="/submit"
              className="flex items-center gap-1.5 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Post Listing
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="sm:hidden p-2 rounded-md text-gray-600 hover:text-gray-900"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="w-6 h-6" strokeWidth={2} />
            ) : (
              <Menu className="w-6 h-6" strokeWidth={2} />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden pb-4 pt-3 flex flex-col items-center gap-3">
            <Link
              href="/about"
              className="w-full text-center text-sm text-gray-700 hover:text-gray-900 bg-gray-50 rounded-lg py-2.5"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="w-full text-center text-sm text-gray-700 hover:text-gray-900 bg-gray-50 rounded-lg py-2.5"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/submit"
              className="w-full flex items-center justify-center gap-1.5 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium text-center"
              onClick={() => setMenuOpen(false)}
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Post Listing
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
