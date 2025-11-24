"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Sparkles, Zap, Palette, Download, ArrowRight, Image, Type, Layers } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import 3D component (client-side only)
// Modern design: Geometric wireframe shapes with glass effect
const Hero3DBackground = dynamic(() => import("@/components/Hero3DModern"), {
  ssr: false,
  loading: () => null,
});

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 py-28 sm:px-6 sm:py-32 lg:px-8 lg:py-40 xl:py-44">
          {/* 3D Background */}
          <Hero3DBackground />
          
          <div className="relative mx-auto max-w-5xl">
            <div className="text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 mb-7">
                <Sparkles className="h-4 w-4" />
                <span>Free Online Thumbnail Generator</span>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
                Create Professional
                <br />
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Thumbnails
                </span>
                {" "}That Get Clicks
              </h1>
              
              <p className="mt-7 mx-auto max-w-2xl text-lg text-gray-600 sm:text-xl lg:text-2xl">
                Powerful online editor with <span className="font-semibold text-gray-900">26+ fonts</span>, <span className="font-semibold text-gray-900">180+ gradients</span>, and <span className="font-semibold text-gray-900">custom backgrounds</span>. Start creating in seconds—no account needed.
              </p>
              
              <div className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/editor"
                  className="group relative inline-flex items-center gap-2 rounded-xl bg-purple-600 px-10 py-5 text-lg font-bold text-white shadow-2xl transition-all hover:bg-purple-700 hover:shadow-purple-500/50 hover:scale-105 sm:text-xl"
                >
                  <Sparkles className="h-5 w-5" />
                  Create Thumbnail Free
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/gradient-editor"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-purple-200 bg-white px-8 py-5 text-base font-semibold text-purple-600 transition-all hover:border-purple-300 hover:bg-purple-50 sm:text-lg"
                >
                  <Palette className="h-5 w-5" />
                  Try Gradient Editor
                </Link>
              </div>
              
              {/* Stats */}
              <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600 sm:gap-12">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="font-medium">100% Free</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="font-medium">No Sign-up</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                    <svg className="h-5 w-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="font-medium">Export HD Quality</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700 mb-4">
                <Zap className="h-4 w-4" />
                Powerful Features
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
                Everything You Need
              </h2>
              <p className="mt-4 text-lg text-gray-600 sm:text-xl">
                Professional-grade tools designed for speed and simplicity
              </p>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="group relative overflow-hidden rounded-2xl border border-purple-100 bg-white p-8 shadow-lg transition-all hover:shadow-2xl hover:scale-105">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg">
                    <Type className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-gray-900">26 Google Fonts</h3>
                  <p className="mt-3 text-gray-600 leading-relaxed">
                    Curated collection across 5 categories: Sans Serif, Display, Serif, Handwriting, and Monospace.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group relative overflow-hidden rounded-2xl border border-purple-100 bg-white p-8 shadow-lg transition-all hover:shadow-2xl hover:scale-105">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-pink-600 to-purple-600 text-white shadow-lg">
                    <Palette className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-gray-900">181 Gradients</h3>
                  <p className="mt-3 text-gray-600 leading-relaxed">
                    Stunning presets: linear, radial, and conic gradients inspired by LazyLayers.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group relative overflow-hidden rounded-2xl border border-purple-100 bg-white p-8 shadow-lg transition-all hover:shadow-2xl hover:scale-105">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg">
                    <Image className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-gray-900">60+ Backgrounds</h3>
                  <p className="mt-3 text-gray-600 leading-relaxed">
                    Curated images from LazyLayers and Unsplash, or upload your own.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="group relative overflow-hidden rounded-2xl border border-purple-100 bg-white p-8 shadow-lg transition-all hover:shadow-2xl hover:scale-105">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-pink-600 to-purple-600 text-white shadow-lg">
                    <Layers className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-gray-900">Texture Overlays</h3>
                  <p className="mt-3 text-gray-600 leading-relaxed">
                    5 texture types with adjustable intensity for added depth.
                  </p>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="group relative overflow-hidden rounded-2xl border border-purple-100 bg-white p-8 shadow-lg transition-all hover:shadow-2xl hover:scale-105">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg">
                    <Zap className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-gray-900">Instant Preview</h3>
                  <p className="mt-3 text-gray-600 leading-relaxed">
                    Real-time updates with responsive canvas auto-scaling.
                  </p>
                </div>
              </div>

              {/* Feature 6 */}
              <div className="group relative overflow-hidden rounded-2xl border border-purple-100 bg-white p-8 shadow-lg transition-all hover:shadow-2xl hover:scale-105">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-pink-600 to-purple-600 text-white shadow-lg">
                    <Download className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-gray-900">HD Export</h3>
                  <p className="mt-3 text-gray-600 leading-relaxed">
                    PNG export with 3 quality presets: 1x, 2x, or 3x resolution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-3xl bg-gradient-to-br from-purple-600 to-pink-600 p-8 sm:p-12 lg:p-16 shadow-2xl">
              <div className="text-center">
                <Sparkles className="mx-auto h-12 w-12 text-white opacity-90" />
                <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                  Ready to Create Amazing Thumbnails?
                </h2>
                <p className="mt-4 text-lg text-purple-100 sm:text-xl">
                  Join thousands of creators using DesainCepat to make stunning thumbnails in minutes
                </p>
                <div className="mt-10">
                  <Link
                    href="/editor"
                    className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-purple-600 shadow-xl transition-all hover:shadow-2xl hover:scale-105"
                  >
                    Start Creating Now
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Brand Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">DesainCepat</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Create stunning thumbnails for YouTube, Instagram, and social media in seconds. Free, fast, and professional.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Quick Links</h3>
              <div className="flex flex-col gap-2">
                <Link href="/editor" className="text-sm text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-purple-600"></span>
                  Thumbnail Editor
                </Link>
                <Link href="/gradient-editor" className="text-sm text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-purple-600"></span>
                  Gradient Editor
                </Link>
                <Link href="/tutorial" className="text-sm text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-purple-600"></span>
                  Tutorial
                </Link>
              </div>
            </div>

            {/* About */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">About</h3>
              <div className="flex flex-col gap-3">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Built with ❤️ by Robith Yusuf
                </p>
                <a 
                  href="https://github.com/RobithYusuf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-gray-800 hover:shadow-lg"
                >
                  View on GitHub
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    100% Free
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    No Sign-up
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 border-t border-gray-200 pt-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-xs text-gray-500">
                © 2024 DesainCepat. All rights reserved.
              </p>
              <p className="text-xs text-gray-500">
                Made with Next.js, Tailwind CSS, and Zustand
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
