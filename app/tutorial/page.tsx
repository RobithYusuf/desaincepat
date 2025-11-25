"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { 
  ArrowRight, Type, Palette, Image, Sliders, Download, Sparkles, Check,
  Layers, Move, Eye, Settings, Zap, MousePointer
} from "lucide-react";

export default function TutorialPage() {
  const [activeTab, setActiveTab] = useState<"thumbnail" | "gradient">("thumbnail");

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 text-sm font-semibold text-purple-700">
              📚 Documentation & Tutorial
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Master DesainCepat
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Complete guides for creating stunning thumbnails and beautiful gradients
            </p>
          </div>

          {/* Feature Tabs */}
          <div className="mt-12 flex items-center justify-center">
            <div className="inline-flex rounded-xl bg-white p-1.5 shadow-lg border border-gray-200">
              <button
                onClick={() => setActiveTab("thumbnail")}
                className={`flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all ${
                  activeTab === "thumbnail"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Type className="h-4 w-4" />
                Thumbnail Editor
              </button>
              <button
                onClick={() => setActiveTab("gradient")}
                className={`flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all ${
                  activeTab === "gradient"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Palette className="h-4 w-4" />
                Gradient Editor
              </button>
            </div>
          </div>

          {/* Tutorial Content */}
          <div className="mt-12">
            {activeTab === "thumbnail" ? (
              <ThumbnailTutorial />
            ) : (
              <GradientTutorial />
            )}
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 p-8 text-center sm:p-12 shadow-2xl">
            <Sparkles className="mx-auto h-12 w-12 text-yellow-200" />
            <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
              Ready to Create Amazing Designs?
            </h2>
            <p className="mt-2 text-purple-100 max-w-xl mx-auto">
              Choose your tool and start designing professional graphics in minutes
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/thumbnail"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-purple-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                <Type className="h-5 w-5" />
                Thumbnail Editor
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/gradient-editor"
                className="inline-flex items-center gap-2 rounded-lg bg-white/20 border-2 border-white px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-white/30 hover:scale-105"
              >
                <Palette className="h-5 w-5" />
                Gradient Editor
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-purple-600 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

// Thumbnail Editor Tutorial Component
function ThumbnailTutorial() {
  return (
    <div className="space-y-8">
      {/* Overview Card */}
      <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 text-white">
            <Type className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">Thumbnail Editor</h2>
            <p className="mt-2 text-gray-700">
              Create professional thumbnails for YouTube, Instagram, and social media with customizable text, backgrounds, and effects.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700">
                26 Google Fonts
              </span>
              <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700">
                181 Gradients
              </span>
              <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700">
                60 Images
              </span>
              <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700">
                Multiple Sizes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-6">
        {/* Step 1 */}
        <TutorialStep
          number={1}
          icon={<Type className="h-5 w-5" />}
          title="Add Your Text"
          description="Enter your thumbnail text in the Text Content section. Keep it short and impactful (3-5 words work best)."
          color="purple"
        >
          <div className="mt-4 rounded-lg bg-gray-50 p-4 border border-gray-200">
            <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-600" />
              Pro Tips
            </p>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                <span>Use ALL CAPS for maximum impact</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                <span>Add emojis to make it eye-catching 🔥</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                <span>Test different text alignments</span>
              </li>
            </ul>
          </div>
        </TutorialStep>

        {/* Step 2 */}
        <TutorialStep
          number={2}
          icon={<Sliders className="h-5 w-5" />}
          title="Customize Typography"
          description="Choose from 26 Google Fonts and adjust font size (12-200px), line height, and max width."
          color="blue"
        >
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <InfoBox label="Font Size" value="60-120px for YouTube" />
            <InfoBox label="Font Family" value="Bold fonts work great" />
          </div>
        </TutorialStep>

        {/* Step 3 */}
        <TutorialStep
          number={3}
          icon={<Palette className="h-5 w-5" />}
          title="Choose Background"
          description="Select from solid colors, 181 gradient presets, or 60 background images."
          color="pink"
        >
          <div className="mt-4 space-y-2">
            <BackgroundOption type="Solid" description="200 colors organized by hue" />
            <BackgroundOption type="Gradient" description="181 beautiful gradients" />
            <BackgroundOption type="Image" description="60 curated images or upload" />
          </div>
        </TutorialStep>

        {/* Step 4 */}
        <TutorialStep
          number={4}
          icon={<Settings className="h-5 w-5" />}
          title="Fine-tune Settings"
          description="Select frame size (YouTube, Instagram, Twitter) and adjust padding for perfect spacing."
          color="purple"
        />

        {/* Step 5 */}
        <TutorialStep
          number={5}
          icon={<Download className="h-5 w-5" />}
          title="Export Your Design"
          description="Click Export, choose quality preset (Standard, Best, Maximum), and download your PNG."
          color="green"
        />
      </div>
    </div>
  );
}

// Gradient Editor Tutorial Component
function GradientTutorial() {
  return (
    <div className="space-y-8">
      {/* Overview Card */}
      <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Palette className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">Gradient Editor</h2>
            <p className="mt-2 text-gray-700">
              Create stunning mesh gradients with interactive controls. Perfect for backgrounds, social media posts, and modern designs.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700">
                5 Color Presets
              </span>
              <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700">
                Interactive Shapes
              </span>
              <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700">
                Blur & Grain Effects
              </span>
              <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700">
                Multiple Export Sizes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-6">
        {/* Step 1 */}
        <TutorialStep
          number={1}
          icon={<Palette className="h-5 w-5" />}
          title="Choose Color Palette"
          description="Select from 5 beautiful presets (Golden Mist, Coral Breeze, etc.) or create your own by adding/removing colors."
          color="blue"
        >
          <div className="mt-4 rounded-lg bg-gray-50 p-4 border border-gray-200">
            <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-600" />
              Color Tips
            </p>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                <span>Use 3-5 colors for best results</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                <span>Drag colors to reorder them</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                <span>Click color swatches to edit</span>
              </li>
            </ul>
          </div>
        </TutorialStep>

        {/* Step 2 */}
        <TutorialStep
          number={2}
          icon={<Move className="h-5 w-5" />}
          title="Adjust Positions (Optional)"
          description="Enable 'Adjust color position' to move shape centers or 'Adjust Vertices' to reshape individual polygons."
          color="purple"
        >
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <InfoBox label="Center Points" value="Drag to reposition shapes" />
            <InfoBox label="Vertices" value="Fine-tune polygon shapes" />
          </div>
        </TutorialStep>

        {/* Step 3 */}
        <TutorialStep
          number={3}
          icon={<Sliders className="h-5 w-5" />}
          title="Apply Filters & Effects"
          description="Adjust blur (0-100), grain texture (0-100), opacity, and spread to perfect your gradient."
          color="pink"
        >
          <div className="mt-4 space-y-2">
            <FilterOption label="Blur" description="Smoothness of color blending" range="0-100" />
            <FilterOption label="Grain" description="Film-like texture overlay" range="0-100" />
            <FilterOption label="Spread" description="Shape distribution" range="50-150" />
          </div>
        </TutorialStep>

        {/* Step 4 */}
        <TutorialStep
          number={4}
          icon={<Eye className="h-5 w-5" />}
          title="Choose Export Size"
          description="Select from preset sizes: Square (1080×1080), Story (1080×1920), Landscape (1920×1080), Open Graph (1200×630), and more."
          color="green"
        />

        {/* Step 5 */}
        <TutorialStep
          number={5}
          icon={<Download className="h-5 w-5" />}
          title="Export Your Gradient"
          description="Click Export to download as PNG, WebP, or SVG. Your gradient is ready for backgrounds, posts, or designs!"
          color="blue"
        />

        {/* Step 6 */}
        <TutorialStep
          number={6}
          icon={<Sparkles className="h-5 w-5" />}
          title="Randomize & Experiment"
          description="Use 'Randomize' for new layouts or 'Shuffle' to reorder colors. Keep experimenting until you find the perfect gradient!"
          color="purple"
        />
      </div>
    </div>
  );
}

// Reusable Components
interface TutorialStepProps {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "purple" | "blue" | "pink" | "green";
  children?: React.ReactNode;
}

function TutorialStep({ number, icon, title, description, color, children }: TutorialStepProps) {
  const colorClasses = {
    purple: "from-purple-600 to-purple-700 text-purple-600",
    blue: "from-blue-600 to-blue-700 text-blue-600",
    pink: "from-pink-600 to-pink-700 text-pink-600",
    green: "from-green-600 to-green-700 text-green-600",
  };

  const bgColorClasses = {
    purple: "bg-purple-50",
    blue: "bg-blue-50",
    pink: "bg-pink-50",
    green: "bg-green-50",
  };

  return (
    <div className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start gap-5">
        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]} text-lg font-bold text-white shadow-lg`}>
          {number}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2.5">
            <div className={`${bgColorClasses[color]} rounded-lg p-2 ${colorClasses[color].split(' ')[2]}`}>
              {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          </div>
          <p className="mt-3 text-gray-600 leading-relaxed">{description}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-sm text-gray-900 font-medium">{value}</p>
    </div>
  );
}

function BackgroundOption({ type, description }: { type: string; description: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:border-purple-300 transition-colors">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 text-xs font-bold text-white shadow">
        {type[0]}
      </div>
      <div>
        <p className="font-semibold text-gray-900 text-sm">{type}</p>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function FilterOption({ label, description, range }: { label: string; description: string; range: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3">
      <Sliders className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-gray-900 text-sm">{label}</p>
          <span className="text-xs text-gray-500 font-mono">{range}</span>
        </div>
        <p className="text-xs text-gray-600 mt-0.5">{description}</p>
      </div>
    </div>
  );
}
