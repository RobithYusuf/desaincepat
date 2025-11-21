"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Palette, Github, Twitter, Menu, X, Sparkles } from 'lucide-react';

interface NavbarProps {
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export function Navbar({ onMenuToggle, isMobileMenuOpen }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 sm:h-10 sm:w-10">
            <Sparkles className="h-4 w-4 text-white sm:h-5 sm:w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 sm:text-lg">DesainCepat</h1>
            <p className="hidden text-xs text-gray-500 sm:block">Thumbnail Generator</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-6 lg:flex">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              pathname === '/' 
                ? 'text-purple-600' 
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Home
          </Link>
          <Link
            href="/editor"
            className={`text-sm font-medium transition-colors ${
              pathname === '/editor' 
                ? 'text-purple-600' 
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Editor
          </Link>
          <Link
            href="/tutorial"
            className={`text-sm font-medium transition-colors ${
              pathname === '/tutorial' 
                ? 'text-purple-600' 
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Tutorial
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Social Links - Hidden on mobile */}
          <div className="hidden items-center gap-2 sm:flex">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50"
            >
              <Twitter className="h-4 w-4" />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={onMenuToggle}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50 lg:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
