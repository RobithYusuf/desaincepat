"use client";

import { useState } from 'react';
import { Type, RotateCcw } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { BulkItemTypography } from '@/store/bulk-store';

interface BulkTypographyPickerProps {
  itemId: string;
  typography?: BulkItemTypography;
  defaultTypography: {
    fontSize: number;
    fontFamily: string;
    fontColor: string;
    textAlign: 'left' | 'center' | 'right';
    lineHeight: number;
    maxWidth: number;
  };
  setTypography: (typography: Partial<BulkItemTypography>) => void;
  clearTypography: () => void;
}

const FONT_FAMILIES = [
  { value: 'font-inter', label: 'Inter' },
  { value: 'font-roboto', label: 'Roboto' },
  { value: 'font-open-sans', label: 'Open Sans' },
  { value: 'font-montserrat', label: 'Montserrat' },
  { value: 'font-poppins', label: 'Poppins' },
  { value: 'font-lato', label: 'Lato' },
  { value: 'font-raleway', label: 'Raleway' },
  { value: 'font-pt-sans', label: 'PT Sans' },
  { value: 'font-nunito', label: 'Nunito' },
  { value: 'font-ubuntu', label: 'Ubuntu' },
  { value: 'font-work-sans', label: 'Work Sans' },
  { value: 'font-plus-jakarta-sans', label: 'Plus Jakarta Sans' },
  { value: 'font-oswald', label: 'Oswald' },
  { value: 'font-bebas-neue', label: 'Bebas Neue' },
  { value: 'font-righteous', label: 'Righteous' },
  { value: 'font-bangers', label: 'Bangers' },
  { value: 'font-russo-one', label: 'Russo One' },
  { value: 'font-merriweather', label: 'Merriweather' },
  { value: 'font-playfair', label: 'Playfair Display' },
  { value: 'font-dancing-script', label: 'Dancing Script' },
  { value: 'font-pacifico', label: 'Pacifico' },
  { value: 'font-permanent-marker', label: 'Permanent Marker' },
  { value: 'font-lobster', label: 'Lobster' },
  { value: 'font-inconsolata', label: 'Inconsolata' },
  { value: 'font-fira-code', label: 'Fira Code' },
  { value: 'font-jetbrains-mono', label: 'JetBrains Mono' },
];

export function BulkTypographyPicker({
  itemId,
  typography,
  defaultTypography,
  setTypography,
  clearTypography,
}: BulkTypographyPickerProps) {
  const [open, setOpen] = useState(false);

  // Use custom or default values
  const currentFontSize = typography?.fontSize ?? defaultTypography.fontSize;
  const currentFontFamily = typography?.fontFamily ?? defaultTypography.fontFamily;
  const currentFontColor = typography?.fontColor ?? defaultTypography.fontColor;
  const currentTextAlign = typography?.textAlign ?? defaultTypography.textAlign;
  const currentLineHeight = typography?.lineHeight ?? defaultTypography.lineHeight;
  const currentMaxWidth = typography?.maxWidth ?? defaultTypography.maxWidth;
  
  const hasCustomTypography = typography && Object.keys(typography).length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center transition-all shadow-sm ${
            hasCustomTypography 
              ? 'bg-green-500 text-white' 
              : 'bg-white/90 text-gray-600 hover:bg-white'
          }`}
          title="Edit typography"
        >
          <Type className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-72 p-3 max-h-[80vh] overflow-y-auto" 
        side="right" 
        sideOffset={10}
        align="start"
        collisionPadding={16}
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">Typography</h4>
            {hasCustomTypography && (
              <button
                onClick={() => {
                  clearTypography();
                }}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            )}
          </div>

          {/* Font Size */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-600">Font Size</label>
              <span className="text-xs font-medium text-gray-900">{currentFontSize}px</span>
            </div>
            <input
              type="range"
              min="12"
              max="500"
              value={currentFontSize}
              onChange={(e) => setTypography({ fontSize: Number(e.target.value) })}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
          </div>

          {/* Line Height */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-600">Line Height</label>
              <span className="text-xs font-medium text-gray-900">{currentLineHeight.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="2.5"
              step="0.1"
              value={currentLineHeight}
              onChange={(e) => setTypography({ lineHeight: Number(e.target.value) })}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
          </div>

          {/* Max Width */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-600">Max Width</label>
              <span className="text-xs font-medium text-gray-900">{currentMaxWidth}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={currentMaxWidth}
              onChange={(e) => setTypography({ maxWidth: Number(e.target.value) })}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
          </div>

          {/* Font Family */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-600">Font Family</label>
            <select
              value={currentFontFamily}
              onChange={(e) => setTypography({ fontFamily: e.target.value })}
              className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              {FONT_FAMILIES.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>

          {/* Font Color */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-600">Font Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentFontColor}
                onChange={(e) => setTypography({ fontColor: e.target.value })}
                className="w-8 h-8 rounded border border-gray-200 cursor-pointer"
              />
              <input
                type="text"
                value={currentFontColor}
                onChange={(e) => setTypography({ fontColor: e.target.value })}
                className="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="#ffffff"
              />
            </div>
          </div>

          {/* Text Align */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-600">Text Align</label>
            <div className="flex gap-1">
              {(['left', 'center', 'right'] as const).map((align) => (
                <button
                  key={align}
                  onClick={() => setTypography({ textAlign: align })}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md border transition-all ${
                    currentTextAlign === align
                      ? 'bg-green-50 border-green-300 text-green-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {align.charAt(0).toUpperCase() + align.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          {hasCustomTypography && (
            <p className="text-[10px] text-green-600 bg-green-50 rounded px-2 py-1">
              Custom typography aktif untuk item ini
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
