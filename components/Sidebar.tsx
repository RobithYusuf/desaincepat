"use client";

import { useState } from 'react';
import { useDesignStore } from '@/store/design-store';
import { toPng } from 'html-to-image';
import { Type, Layout, Paintbrush, X } from 'lucide-react';
import { GradientPicker } from './GradientPicker';
import { ProgressSlider } from './ProgressSlider';
import { TemplateManager } from './TemplateManager';

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const {
    text,
    setText,
    fontSize,
    setFontSize,
    lineHeight,
    setLineHeight,
    maxWidth,
    setMaxWidth,
    fontColor,
    setFontColor,
    fontFamily,
    setFontFamily,
    textAlign,
    setTextAlign,
    frameSize,
    setFrameSize,
    padding,
    setPadding,
    backgroundMode,
    setBackgroundMode,
    backgroundColor,
    setBackgroundColor,
    gradientPreset,
    setGradientPreset,
    customGradient,
    setCustomGradient,
    textureEnabled,
    setTextureEnabled,
    textureType,
    setTextureType,
    textureIntensity,
    setTextureIntensity,
  } = useDesignStore();

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Design Settings</h2>
            <p className="mt-0.5 text-xs text-gray-500">Customize your thumbnail</p>
          </div>
          
          {/* Close button for mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 lg:hidden"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 space-y-3 p-3 sm:p-4">
        
        {/* Template Manager Section */}
        <TemplateManager />

        {/* Text Content Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-3">
          <div className="mb-2 flex items-center gap-1.5">
            <Type className="h-3.5 w-3.5 text-gray-600" />
            <h3 className="text-xs font-semibold text-gray-900">Text Content</h3>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-gray-50 p-2 text-sm transition-all focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500/20"
            rows={3}
            placeholder="Enter your text..."
          />
        </div>

        {/* Text Attributes Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-3">
          <div className="mb-2 flex items-center gap-1.5">
            <Type className="h-3.5 w-3.5 text-gray-600" />
            <h3 className="text-xs font-semibold text-gray-900">Text Attributes</h3>
          </div>
          
          <div className="space-y-2.5">
            <ProgressSlider
              label="Font Size"
              value={fontSize}
              onChange={setFontSize}
              min={12}
              max={200}
              valueFormatter={(v) => `${v}px`}
            />

            <ProgressSlider
              label="Line Height"
              value={lineHeight}
              onChange={setLineHeight}
              min={0.8}
              max={2.5}
              step={0.1}
              valueFormatter={(v) => v.toFixed(1)}
            />

            <ProgressSlider
              label="Max Width"
              value={maxWidth}
              onChange={setMaxWidth}
              min={0}
              max={100}
              valueFormatter={(v) => `${v}%`}
            />
          </div>
        </div>

        {/* Typography Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-3">
          <div className="mb-2 flex items-center gap-1.5">
            <Type className="h-3.5 w-3.5 text-gray-600" />
            <h3 className="text-xs font-semibold text-gray-900">Typography</h3>
          </div>
          
          <div className="space-y-2.5">
            <div>
              <label className="mb-1 block text-xs text-gray-700">Font Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fontColor}
                  onChange={(e) => setFontColor(e.target.value)}
                  className="h-8 w-14 cursor-pointer rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={fontColor}
                  onChange={(e) => setFontColor(e.target.value)}
                  className="flex-1 rounded border border-gray-300 bg-gray-50 px-2 py-1 text-xs font-mono focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-gray-700">Font Family</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              >
                <optgroup label="Sans Serif">
                  <option value="font-inter">Inter</option>
                  <option value="font-roboto">Roboto</option>
                  <option value="font-open-sans">Open Sans</option>
                  <option value="font-montserrat">Montserrat</option>
                  <option value="font-poppins">Poppins</option>
                  <option value="font-lato">Lato</option>
                  <option value="font-raleway">Raleway</option>
                  <option value="font-pt-sans">PT Sans</option>
                  <option value="font-nunito">Nunito</option>
                  <option value="font-ubuntu">Ubuntu</option>
                  <option value="font-work-sans">Work Sans</option>
                  <option value="font-plus-jakarta-sans">Plus Jakarta Sans</option>
                </optgroup>
                <optgroup label="Display & Bold">
                  <option value="font-oswald">Oswald</option>
                  <option value="font-bebas-neue">Bebas Neue</option>
                  <option value="font-righteous">Righteous</option>
                  <option value="font-bangers">Bangers</option>
                  <option value="font-russo-one">Russo One</option>
                </optgroup>
                <optgroup label="Serif">
                  <option value="font-merriweather">Merriweather</option>
                  <option value="font-playfair">Playfair Display</option>
                </optgroup>
                <optgroup label="Handwriting">
                  <option value="font-dancing-script">Dancing Script</option>
                  <option value="font-pacifico">Pacifico</option>
                  <option value="font-permanent-marker">Permanent Marker</option>
                  <option value="font-lobster">Lobster</option>
                </optgroup>
                <optgroup label="Monospace">
                  <option value="font-inconsolata">Inconsolata</option>
                  <option value="font-fira-code">Fira Code</option>
                  <option value="font-jetbrains-mono">JetBrains Mono</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs text-gray-700">Text Alignment</label>
              <div className="flex gap-1.5">
                {(['left', 'center', 'right'] as const).map((align) => (
                  <button
                    key={align}
                    onClick={() => setTextAlign(align)}
                    className={`flex-1 rounded border px-2 py-1.5 text-xs font-medium transition-all ${
                      textAlign === align
                        ? 'border-purple-600 bg-purple-600 text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {align.charAt(0).toUpperCase() + align.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Background Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-3">
          <div className="mb-2 flex items-center gap-1.5">
            <Paintbrush className="h-3.5 w-3.5 text-gray-600" />
            <h3 className="text-xs font-semibold text-gray-900">Background</h3>
          </div>
          
          <div className="space-y-2.5">
            <div>
              <label className="mb-1 block text-xs text-gray-700">Background Color</label>
              <GradientPicker
                background={backgroundMode === 'solid' ? backgroundColor : customGradient}
                setBackground={(bg) => {
                  if (bg.includes('gradient') || bg.includes('linear-gradient')) {
                    setBackgroundMode('gradient');
                    setCustomGradient(bg);
                  } else if (bg.includes('url')) {
                    setBackgroundMode('gradient');
                    setCustomGradient(bg);
                  } else {
                    setBackgroundMode('solid');
                    setBackgroundColor(bg);
                  }
                }}
              />
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="flex cursor-pointer items-center gap-2 rounded border border-gray-200 bg-gray-50 px-2 py-1.5 transition-colors hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={textureEnabled}
                    onChange={(e) => setTextureEnabled(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-gray-300 text-purple-600 focus:ring-1 focus:ring-purple-500"
                  />
                  <span className="text-xs text-gray-700">Enable Texture</span>
                </label>
              </div>

              {textureEnabled && (
                <>
                  <div>
                    <label className="mb-1 block text-xs text-gray-700">Texture Type</label>
                    <select
                      value={textureType}
                      onChange={(e) => setTextureType(e.target.value as any)}
                      className="w-full rounded border border-gray-300 bg-gray-50 px-2 py-1.5 text-xs focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/20"
                    >
                      <option value="fine">Fine Grain</option>
                      <option value="medium">Medium Grain</option>
                      <option value="coarse">Coarse Grain</option>
                      <option value="noise">Classic Noise</option>
                      <option value="paper">Paper Texture</option>
                    </select>
                  </div>

                  <ProgressSlider
                    label="Texture Intensity"
                    value={textureIntensity}
                    onChange={setTextureIntensity}
                    min={0}
                    max={100}
                    valueFormatter={(v) => `${v}%`}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
