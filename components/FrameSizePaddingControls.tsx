"use client";

import { useState, useEffect } from 'react';
import { useDesignStore } from '@/store/design-store';
import { useBulkStore } from '@/store/bulk-store';
import { TopBarWrapper } from './TopBarWrapper';
import { TopBarLabel, TopBarSelect, TopBarInput, TopBarSeparator, TopBarUnit, TopBarGroup, TopBarSection } from './ui/topbar-controls';
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
    <TopBarWrapper>
      {/* Left Side: Frame Size & Padding */}
      <TopBarSection position="left">
        {/* Frame Size Selector */}
        <TopBarGroup>
          <TopBarLabel>Frame Size</TopBarLabel>
          <TopBarSelect
            value={frameSize}
            onChange={(e) => setFrameSize(e.target.value as any)}
          >
            <option value="youtube">YouTube Thumbnail (1280×720)</option>
            <option value="instagram">Instagram Portrait (1080×1350)</option>
            <option value="twitter">Twitter Banner (1500×500)</option>
            <option value="custom">Custom Size</option>
          </TopBarSelect>
        </TopBarGroup>

        {/* Custom Size Inputs - Show when custom is selected */}
        {frameSize === 'custom' && (
          <TopBarGroup>
            <TopBarInput
              value={widthInput}
              onChange={(e) => handleWidthChange(e.target.value)}
              onBlur={applyWidth}
              onKeyDown={(e) => e.key === 'Enter' && applyWidth()}
              placeholder="Width"
            />
            <TopBarSeparator />
            <TopBarInput
              value={heightInput}
              onChange={(e) => handleHeightChange(e.target.value)}
              onBlur={applyHeight}
              onKeyDown={(e) => e.key === 'Enter' && applyHeight()}
              placeholder="Height"
            />
            <TopBarUnit />
          </TopBarGroup>
        )}
        
        {/* Padding Slider */}
        <div className="flex items-center gap-3 w-full sm:flex-1 sm:max-w-xs">
          <TopBarLabel>Padding</TopBarLabel>
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
      </TopBarSection>

      {/* Right Side: Export Button */}
      <TopBarSection position="right">
        {isBulkMode ? <BulkExportModal /> : <ExportModal />}
      </TopBarSection>
    </TopBarWrapper>
  );
}
