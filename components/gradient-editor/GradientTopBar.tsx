'use client';

import { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { useGradientStore } from '@/store/gradient-store';
import { generateMeshGradient } from '@/lib/mesh-generator';

export function GradientTopBar() {
  const [isLocked, setIsLocked] = useState(false);
  const [widthInput, setWidthInput] = useState<string | null>(null);
  const [heightInput, setHeightInput] = useState<string | null>(null);
  
  const {
    canvas,
    palette,
    filters,
    setExportWidth,
    setExportHeight,
    setExportPreset,
    setCanvasSize,
    setShapes,
  } = useGradientStore();

  const presets = [
    { label: 'Square', value: 'square' as const, width: 1080, height: 1080 },
    { label: 'Story', value: 'story' as const, width: 1080, height: 1920 },
    { label: 'Landscape', value: 'landscape' as const, width: 1920, height: 1080 },
    { label: 'Portrait', value: 'portrait' as const, width: 1080, height: 1350 },
    { label: 'Open Graph', value: 'opengraph' as const, width: 1200, height: 630 },
    { label: 'YouTube', value: 'youtube' as const, width: 1280, height: 720 },
  ];

  const handlePresetClick = (presetValue: 'square' | 'story' | 'portrait' | 'landscape' | 'opengraph' | 'youtube') => {
    setExportPreset(presetValue);
    
    setTimeout(() => {
      const state = useGradientStore.getState();
      const newShapes = generateMeshGradient({
        width: state.canvas.width,
        height: state.canvas.height,
        numColors: palette.length,
        spread: filters.spread,
      });
      setShapes(newShapes);
    }, 0);
  };

  const applySize = (width: number, height: number) => {
    const w = Math.max(100, Math.min(5000, width));
    const h = Math.max(100, Math.min(5000, height));
    
    setExportWidth(w);
    setExportHeight(h);
    setCanvasSize(w, h);
    
    setTimeout(() => {
      const newShapes = generateMeshGradient({
        width: w,
        height: h,
        numColors: palette.length,
        spread: filters.spread,
      });
      setShapes(newShapes);
    }, 0);
  };

  const handleWidthChange = (value: string) => {
    // Only allow digits
    const cleaned = value.replace(/\D/g, '');
    setWidthInput(cleaned);
  };

  const handleHeightChange = (value: string) => {
    // Only allow digits
    const cleaned = value.replace(/\D/g, '');
    setHeightInput(cleaned);
  };

  const handleWidthBlur = () => {
    if (widthInput !== null) {
      const num = parseInt(widthInput, 10);
      if (!isNaN(num) && num >= 100) {
        if (isLocked) {
          const ratio = canvas.height / canvas.width;
          const newHeight = Math.round(num * ratio);
          applySize(num, newHeight);
        } else {
          applySize(num, canvas.height);
        }
      }
    }
    setWidthInput(null);
  };

  const handleHeightBlur = () => {
    if (heightInput !== null) {
      const num = parseInt(heightInput, 10);
      if (!isNaN(num) && num >= 100) {
        if (isLocked) {
          const ratio = canvas.width / canvas.height;
          const newWidth = Math.round(num * ratio);
          applySize(newWidth, num);
        } else {
          applySize(canvas.width, num);
        }
      }
    }
    setHeightInput(null);
  };

  const currentPreset = presets.find(p => p.width === canvas.width && p.height === canvas.height);
  const isCustomSize = !currentPreset;

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 px-4 py-2.5 sm:px-6">
        {/* Left Side: Size Presets */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
          {/* Preset Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-xs font-medium text-gray-700 whitespace-nowrap">Frame Size</label>
            <select
              value={isCustomSize ? 'custom' : currentPreset?.value}
              onChange={(e) => {
                if (e.target.value !== 'custom') {
                  handlePresetClick(e.target.value as any);
                }
              }}
              className="flex-1 sm:flex-none rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {presets.map((preset) => (
                <option key={preset.value} value={preset.value}>
                  {preset.label} ({preset.width}×{preset.height})
                </option>
              ))}
              {isCustomSize && (
                <option value="custom">
                  Custom ({canvas.width}×{canvas.height})
                </option>
              )}
            </select>
          </div>

          {/* Custom Size Inputs */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-500 hidden sm:inline">Custom:</label>
            <input
              type="text"
              inputMode="numeric"
              value={widthInput !== null ? widthInput : canvas.width}
              onChange={(e) => handleWidthChange(e.target.value)}
              onBlur={handleWidthBlur}
              onFocus={(e) => e.target.select()}
              className="w-16 sm:w-20 rounded border border-gray-300 bg-white px-2 py-1.5 text-xs font-medium focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              onClick={() => setIsLocked(!isLocked)}
              className={`p-1.5 rounded border transition-colors ${
                isLocked 
                  ? 'bg-blue-50 border-blue-300 text-blue-600' 
                  : 'bg-white border-gray-300 text-gray-400 hover:text-gray-600'
              }`}
              title={isLocked ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
            >
              {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
            </button>
            <input
              type="text"
              inputMode="numeric"
              value={heightInput !== null ? heightInput : canvas.height}
              onChange={(e) => handleHeightChange(e.target.value)}
              onBlur={handleHeightBlur}
              onFocus={(e) => e.target.select()}
              className="w-16 sm:w-20 rounded border border-gray-300 bg-white px-2 py-1.5 text-xs font-medium focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <span className="text-xs text-gray-500">px</span>
          </div>
        </div>

        {/* Right Side: Current Size Info */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
          <span className="font-medium text-gray-700">{canvas.width} × {canvas.height}</span>
          <span>•</span>
          <span className="capitalize">
            {canvas.width === canvas.height ? 'Square' : 
             canvas.width > canvas.height ? 'Landscape' : 'Portrait'}
          </span>
        </div>
      </div>
    </div>
  );
}
