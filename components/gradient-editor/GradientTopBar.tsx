'use client';

import { useGradientStore } from '@/store/gradient-store';
import { generateMeshGradient } from '@/lib/mesh-generator';

export function GradientTopBar() {
  const {
    exportWidth,
    exportHeight,
    canvas,
    palette,
    filters,
    setExportWidth,
    setExportHeight,
    setExportPreset,
    setShapes,
  } = useGradientStore();

  const presets = [
    { label: 'Square', value: 'square' as const, size: '1080×1080' },
    { label: 'Story', value: 'story' as const, size: '1080×1920' },
    { label: 'Landscape', value: 'landscape' as const, size: '1920×1080' },
    { label: 'Portrait', value: 'portrait' as const, size: '1080×1350' },
    { label: 'Open Graph', value: 'opengraph' as const, size: '1200×630' },
    { label: 'YouTube', value: 'youtube' as const, size: '1280×720' },
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

  const currentPreset = presets.find(p => {
    const [w, h] = p.size.split('×').map(Number);
    return w === canvas.width && h === canvas.height;
  });

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 px-4 py-2.5 sm:px-6">
        {/* Left Side: Size Presets */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
          {/* Preset Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-xs font-medium text-gray-700 whitespace-nowrap">Size</label>
            <select
              value={currentPreset?.value || 'landscape'}
              onChange={(e) => handlePresetClick(e.target.value as any)}
              className="flex-1 sm:flex-none rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {presets.map((preset) => (
                <option key={preset.value} value={preset.value}>
                  {preset.label} ({preset.size})
                </option>
              ))}
            </select>
          </div>

          {/* Custom Size Inputs */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-500 hidden sm:inline">Custom:</label>
            <input
              type="number"
              value={exportWidth}
              onChange={(e) => setExportWidth(Number(e.target.value))}
              min={100}
              max={5000}
              className="w-16 sm:w-20 rounded border border-gray-300 bg-white px-2 py-1.5 text-xs font-medium focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <span className="text-xs text-gray-400">×</span>
            <input
              type="number"
              value={exportHeight}
              onChange={(e) => setExportHeight(Number(e.target.value))}
              min={100}
              max={5000}
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
