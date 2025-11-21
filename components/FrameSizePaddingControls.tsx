"use client";

import { useDesignStore } from '@/store/design-store';
import { ProgressSlider } from './ProgressSlider';
import { ExportModal } from './ExportModal';

export function FrameSizePaddingControls() {
  const {
    frameSize,
    setFrameSize,
    padding,
    setPadding,
    customWidth,
    customHeight,
    setCustomDimensions,
  } = useDesignStore();

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 px-4 py-3 sm:px-6">
        {/* Left Side: Frame Size & Padding */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 w-full sm:w-auto">
          {/* Frame Size Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-xs font-medium text-gray-700 whitespace-nowrap">Frame Size</label>
            <select
              value={frameSize}
              onChange={(e) => setFrameSize(e.target.value as any)}
              className="flex-1 sm:flex-none rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            >
              <option value="youtube">YouTube Thumbnail (1280×720)</option>
              <option value="instagram">Instagram Portrait (1080×1350)</option>
              <option value="twitter">Twitter Banner (1500×500)</option>
              <option value="custom">Custom Size</option>
            </select>
          </div>

          {/* Custom Size Inputs - Show when custom is selected */}
          {frameSize === 'custom' && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="number"
                value={customWidth}
                onChange={(e) => setCustomDimensions(Number(e.target.value), customHeight)}
                placeholder="Width"
                min={100}
                max={5000}
                className="w-20 rounded border border-gray-300 bg-white px-2 py-1.5 text-xs font-medium focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
              <span className="text-xs text-gray-500">×</span>
              <input
                type="number"
                value={customHeight}
                onChange={(e) => setCustomDimensions(customWidth, Number(e.target.value))}
                placeholder="Height"
                min={100}
                max={5000}
                className="w-20 rounded border border-gray-300 bg-white px-2 py-1.5 text-xs font-medium focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
              <span className="text-[10px] text-gray-500">px</span>
            </div>
          )}
          
          {/* Padding Slider */}
          <div className="flex items-center gap-3 w-full sm:flex-1 sm:max-w-xs">
            <label className="text-xs font-medium text-gray-700 whitespace-nowrap">Padding</label>
            <div className="flex-1">
              <ProgressSlider
                value={padding}
                onChange={setPadding}
                min={0}
                max={100}
                showValue={false}
              />
            </div>
            <span className="text-xs font-medium text-gray-600 min-w-[2rem] text-right">{padding}</span>
          </div>
        </div>

        {/* Right Side: Export Button */}
        <div className="w-full sm:w-auto">
          <ExportModal />
        </div>
      </div>
    </div>
  );
}
