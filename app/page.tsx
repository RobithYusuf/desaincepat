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
                Create Stunning
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10">Thumbnails</span>
                  <span className="absolute bottom-2 left-0 h-3 w-full bg-purple-200 -z-0"></span>
                </span>
                {" "}Fast
              </h1>
              
              <p className="mt-7 mx-auto max-w-2xl text-lg text-gray-600 sm:text-xl">
                Professional thumbnail editor for YouTube, Instagram, and Twitter. No design experience required. Start creating in seconds.
              </p>
              
              <div className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/editor"
                  className="group inline-flex items-center gap-2 rounded-lg bg-purple-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-purple-700 hover:shadow-xl sm:text-lg"
                >
                  Start Creating Free
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/tutorial"
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-8 py-4 text-base font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 sm:text-lg"
                >
                  View Tutorial
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
                Everything You Need
              </h2>
              <p className="mt-4 text-lg text-gray-600 sm:text-xl">
                Powerful features packed in a simple, intuitive interface
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-purple-300 hover:shadow-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                  <Type className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">26 Google Fonts</h3>
                <p className="mt-2 text-gray-600">
                  Choose from carefully curated fonts across Sans Serif, Display, Serif, Handwriting, and Monospace categories.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-purple-300 hover:shadow-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                  <Palette className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">181 Gradients</h3>
                <p className="mt-2 text-gray-600">
                  Beautiful gradient presets including linear, radial, and conic gradients inspired by LazyLayers.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-purple-300 hover:shadow-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                  <Image className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">60 Background Images</h3>
                <p className="mt-2 text-gray-600">
                  High-quality curated images from LazyLayers and Unsplash, or upload your own custom images.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-purple-300 hover:shadow-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                  <Layers className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">Texture Overlays</h3>
                <p className="mt-2 text-gray-600">
                  Add depth with 5 texture types (Noise, Fine, Medium, Coarse, Paper) with adjustable intensity.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-purple-300 hover:shadow-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">Real-time Preview</h3>
                <p className="mt-2 text-gray-600">
                  See your changes instantly with responsive canvas that auto-scales to your screen size.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-purple-300 hover:shadow-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                  <Download className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">High-Quality Export</h3>
                <p className="mt-2 text-gray-600">
                  Export in PNG with 3 quality presets: Standard (1x), Best (2x), or Maximum (3x) resolution.
                </p>
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
      <footer className="border-t border-gray-200 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">DesainCepat</span>
            </div>
            <p className="text-sm text-gray-600">
              © 2024 DesainCepat. Create stunning thumbnails in seconds.
            </p>
            <div className="flex gap-6">
              <Link href="/tutorial" className="text-sm text-gray-600 hover:text-purple-600">
                Tutorial
              </Link>
              <Link href="/editor" className="text-sm text-gray-600 hover:text-purple-600">
                Editor
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
