"use client";

import { useState, useEffect } from 'react';
import { useDesignStore } from '@/store/design-store';
import { useBulkStore } from '@/store/bulk-store';
import { ProgressSlider } from './ProgressSlider';
import { ExportModal } from './ExportModal';
import { BulkExportModal } from './bulk/BulkExportModal';

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
  
  const { isBulkMode } = useBulkStore();

  // Local state for input values (as strings to handle empty input)
  const [widthInput, setWidthInput] = useState<string>(customWidth.toString());
  const [heightInput, setHeightInput] = useState<string>(customHeight.toString());

  // Sync local state when store values change externally
  useEffect(() => {
    setWidthInput(customWidth.toString());
  }, [customWidth]);

  useEffect(() => {
    setHeightInput(customHeight.toString());
  }, [customHeight]);

  const handleWidthChange = (value: string) => {
    // Allow empty or numeric input
    if (value === '' || /^\d+$/.test(value)) {
      setWidthInput(value);
    }
  };

  const handleHeightChange = (value: string) => {
    // Allow empty or numeric input
    if (value === '' || /^\d+$/.test(value)) {
      setHeightInput(value);
    }
  };

  const applyWidth = () => {
    const num = parseInt(widthInput, 10);
    if (!isNaN(num) && num >= 100 && num <= 5000) {
      setCustomDimensions(num, customHeight);
    } else {
      // Reset to current value if invalid
      setWidthInput(customWidth.toString());
    }
  };

  const applyHeight = () => {
    const num = parseInt(heightInput, 10);
    if (!isNaN(num) && num >= 100 && num <= 5000) {
      setCustomDimensions(customWidth, num);
    } else {
      // Reset to current value if invalid
      setHeightInput(customHeight.toString());
    }
  };

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
                type="text"
                inputMode="numeric"
                value={widthInput}
                onChange={(e) => handleWidthChange(e.target.value)}
                onBlur={applyWidth}
                onKeyDown={(e) => e.key === 'Enter' && applyWidth()}
                placeholder="Width"
                className="w-20 rounded border border-gray-300 bg-white px-2 py-1.5 text-xs font-medium focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
              <span className="text-xs text-gray-500">×</span>
              <input
                type="text"
                inputMode="numeric"
                value={heightInput}
                onChange={(e) => handleHeightChange(e.target.value)}
                onBlur={applyHeight}
                onKeyDown={(e) => e.key === 'Enter' && applyHeight()}
                placeholder="Height"
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
          {isBulkMode ? <BulkExportModal /> : <ExportModal />}
        </div>
      </div>
    </div>
  );
}
