"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Palette, Github, Twitter, Menu, X, Coffee } from 'lucide-react';

interface NavbarProps {
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export function Navbar({ onMenuToggle, isMobileMenuOpen }: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (onMenuToggle) {
      onMenuToggle();
    }
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="w-full px-2 sm:px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Far Left */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/icon.png"
                alt="DesainCepat"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <span className="text-lg font-bold text-gray-900">DesainCepat</span>
            </Link>
          </div>

          {/* Navigation Links - Center */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-all ${
                pathname === '/' 
                  ? 'text-green-600' 
                  : 'text-gray-700 hover:text-green-600'
              }`}
            >
              Home
            </Link>
            <Link
              href="/thumbnail"
              className={`text-sm font-medium transition-all ${
                pathname === '/thumbnail' 
                  ? 'text-green-600' 
                  : 'text-gray-700 hover:text-green-600'
              }`}
            >
              Thumbnail
            </Link>
            <Link
              href="/gradient-editor"
              className={`text-sm font-medium transition-all ${
                pathname === '/gradient-editor' 
                  ? 'text-green-600' 
                  : 'text-gray-700 hover:text-green-600'
              }`}
            >
              Gradient
            </Link>
            <Link
              href="/tutorial"
              className={`text-sm font-medium transition-all ${
                pathname === '/tutorial' 
                  ? 'text-green-600' 
                  : 'text-gray-700 hover:text-green-600'
              }`}
            >
              Tutorial
            </Link>
          </div>

          {/* Trakteer Button - Far Right */}
          <div className="flex items-center gap-3">
            <a
              href="https://saweria.co/robithyusuf"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-orange-600 hover:shadow-lg sm:inline-flex"
            >
              <Coffee className="h-4 w-4" />
              Trakteer
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={handleToggle}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition-all hover:text-green-600 lg:hidden"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown - Floating Simple */}
        {isOpen && (
          <div className="absolute top-full left-4 right-4 mt-2 rounded-xl border border-gray-200 bg-white shadow-lg lg:hidden">
            <div className="space-y-1 px-4 pb-4 pt-3">
              <Link
                href="/"
                onClick={handleLinkClick}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === '/'
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Home
              </Link>
              <Link
                href="/thumbnail"
                onClick={handleLinkClick}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === '/thumbnail'
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Thumbnail Editor
              </Link>
              <Link
                href="/gradient-editor"
                onClick={handleLinkClick}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === '/gradient-editor'
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Gradient Editor
              </Link>
              <Link
                href="/tutorial"
                onClick={handleLinkClick}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === '/tutorial'
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Tutorial
              </Link>

              {/* Try Now Button in Mobile Menu */}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <a
                  href="https://saweria.co/robithyusuf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
                >
                  <Coffee className="h-4 w-4" />
                  Trakteer
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
