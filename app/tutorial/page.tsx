"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ArrowRight, Type, Palette, Image, Sliders, Download, Sparkles, Check } from "lucide-react";

export default function TutorialPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700">
              📚 Tutorial
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              How to Create Stunning Thumbnails
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Follow this step-by-step guide to master DesainCepat in minutes
            </p>
          </div>

          {/* Steps */}
          <div className="mt-16 space-y-12">
            {/* Step 1 */}
            <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex items-start gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-lg font-bold text-white">
                  1
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Type className="h-6 w-6 text-purple-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Add Your Text</h2>
                  </div>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    Start by entering your thumbnail text in the <span className="font-semibold text-gray-900">Text Content</span> section in the sidebar. You can add a catchy headline or any message you want to display.
                  </p>
                  <div className="mt-4 rounded-lg bg-gray-50 p-4">
                    <p className="text-sm font-medium text-gray-700">💡 Pro Tips:</p>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                        <span>Keep it short and impactful (3-5 words work best)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                        <span>Use ALL CAPS for maximum impact</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                        <span>Add emojis to make it more eye-catching 🔥</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex items-start gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-lg font-bold text-white">
                  2
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Type className="h-6 w-6 text-purple-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Customize Typography</h2>
                  </div>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    Select from <span className="font-semibold text-gray-900">26 Google Fonts</span> in the Typography section. Adjust font size (12-200px), line height, and max width to perfect your design.
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-gray-200 p-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase">Font Size</p>
                      <p className="mt-1 text-sm text-gray-700">Use 60-120px for YouTube thumbnails</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase">Font Family</p>
                      <p className="mt-1 text-sm text-gray-700">Bold fonts like Montserrat work great</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex items-start gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-lg font-bold text-white">
                  3
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Palette className="h-6 w-6 text-purple-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Choose Background</h2>
                  </div>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    Pick from <span className="font-semibold text-gray-900">3 background modes</span>: Solid colors, 181 gradient presets, or 60 background images. Click the Background section to explore options.
                  </p>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-start gap-3 rounded-lg bg-purple-50 p-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-purple-600 text-xs font-bold text-white">S</div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">Solid</p>
                        <p className="text-xs text-gray-600">200 colors organized by hue and shade</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-lg bg-purple-50 p-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-purple-600 text-xs font-bold text-white">G</div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">Gradient</p>
                        <p className="text-xs text-gray-600">181 beautiful gradients (linear, radial, conic)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-lg bg-purple-50 p-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-purple-600 text-xs font-bold text-white">I</div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">Image</p>
                        <p className="text-xs text-gray-600">60 curated images or upload your own</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex items-start gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-lg font-bold text-white">
                  4
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Sliders className="h-6 w-6 text-purple-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Fine-tune Settings</h2>
                  </div>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    Use the top bar controls to select your <span className="font-semibold text-gray-900">Frame Size</span> (YouTube, Instagram, Twitter, or Custom) and adjust <span className="font-semibold text-gray-900">Padding</span>.
                  </p>
                  <div className="mt-4 rounded-lg bg-gray-50 p-4">
                    <p className="text-sm font-medium text-gray-700">⚡ Quick Settings:</p>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li>• <span className="font-medium">Frame Size:</span> YouTube (1280×720), Instagram (1080×1080), Twitter (1500×500)</li>
                      <li>• <span className="font-medium">Padding:</span> Add breathing room around your text (recommended: 40-60px)</li>
                      <li>• <span className="font-medium">Texture:</span> Enable texture overlay for added depth (Noise texture enabled by default)</li>
                      <li>• <span className="font-medium">Zoom:</span> Use zoom controls above canvas to view details (25%-200%)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex items-start gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-lg font-bold text-white">
                  5
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Download className="h-6 w-6 text-purple-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Export Your Thumbnail</h2>
                  </div>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    Click the <span className="font-semibold text-gray-900">Export</span> button in the top-right corner. Choose your quality preset, customize the file name, and download your PNG file.
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border-2 border-gray-200 p-3 text-center">
                      <p className="text-sm font-bold text-gray-900">Standard</p>
                      <p className="mt-1 text-xs text-gray-600">85% quality, 1x</p>
                      <p className="mt-1 text-xs text-gray-500">Small file size</p>
                    </div>
                    <div className="rounded-lg border-2 border-purple-600 bg-purple-50 p-3 text-center">
                      <p className="text-sm font-bold text-purple-900">Best ⭐</p>
                      <p className="mt-1 text-xs text-purple-700">92% quality, 2x</p>
                      <p className="mt-1 text-xs text-purple-600">Recommended</p>
                    </div>
                    <div className="rounded-lg border-2 border-gray-200 p-3 text-center">
                      <p className="text-sm font-bold text-gray-900">Maximum</p>
                      <p className="mt-1 text-xs text-gray-600">100% quality, 3x</p>
                      <p className="mt-1 text-xs text-gray-500">Best quality</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 p-8 text-center sm:p-12">
            <Sparkles className="mx-auto h-12 w-12 text-yellow-200" />
            <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
              Ready to Create?
            </h2>
            <p className="mt-2 text-purple-100">
              Start designing your thumbnail now with all these features
            </p>
            <Link
              href="/editor"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-purple-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              Open Editor
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-purple-600"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
