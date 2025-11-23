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
    <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Logo - Left */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">DesainCepat</span>
            </Link>
          </div>

          {/* Navigation Links - Centered */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block">
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className={`text-sm font-medium transition-all ${
                  pathname === '/' 
                    ? 'text-purple-600' 
                    : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                Home
              </Link>
              <Link
                href="/editor"
                className={`text-sm font-medium transition-all ${
                  pathname === '/editor' 
                    ? 'text-purple-600' 
                    : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                Editor
              </Link>
              <Link
                href="/tutorial"
                className={`text-sm font-medium transition-all ${
                  pathname === '/tutorial' 
                    ? 'text-purple-600' 
                    : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                Tutorial
              </Link>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Social Links - Hidden on mobile */}
            <div className="hidden items-center gap-2 sm:flex">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition-all hover:text-purple-600"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition-all hover:text-purple-600"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={onMenuToggle}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition-all hover:text-purple-600 lg:hidden"
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
      </div>
    </nav>
  );
}
