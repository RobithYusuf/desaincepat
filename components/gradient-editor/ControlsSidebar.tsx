'use client';

import { useGradientStore } from '@/store/gradient-store';
import { ColorPalette } from './ColorPalette';
import { FilterPanel } from './FilterPanel';
import { Palette, Sliders, ChevronDown, ChevronUp, RotateCw } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { GRADIENT_PRESETS, generateMeshGradient } from '@/lib/mesh-generator';
import { useState } from 'react';

export function ControlsSidebar() {
  const {
    adjustColorPosition,
    adjustVertices,
    setAdjustColorPosition,
    setAdjustVertices,
    currentPreset,
    loadPreset,
    canvas,
    palette,
    shapes,
    setShapes,
    filters,
    rotateShape,
    rotateAllShapes,
    saveHistory,
  } = useGradientStore();

  // Start with COLORS and FILTERS sections OPEN by default
  const [colorsOpen, setColorsOpen] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [globalRotation, setGlobalRotation] = useState(0);

  const handleLoadPreset = (presetTitle: string) => {
    const preset = GRADIENT_PRESETS.find((p) => p.title === presetTitle);
    if (preset) {
      // Load preset palette
      loadPreset(preset);
      
      // Generate new shapes for the preset with updated palette
      const shapes = generateMeshGradient({
        width: canvas.width,
        height: canvas.height,
        numColors: preset.config.palette.length,
        spread: filters.spread,
      });
      
      setShapes(shapes);
      
      console.log(`✅ Loaded preset: ${presetTitle} with ${preset.config.palette.length} colors`);
    }
  };

  const handleAdjustColorPositionChange = (enabled: boolean) => {
    // Just toggle the setting without regenerating shapes
    setAdjustColorPosition(enabled);
  };

  const handleSpreadChange = (spread: number) => {
    // Only regenerate shapes if adjustColorPosition is enabled
    if (adjustColorPosition) {
      const shapes = generateMeshGradient({
        width: canvas.width,
        height: canvas.height,
        numColors: palette.length,
        spread: spread,
      });
      
      setShapes(shapes);
    }
  };

  return (
    <aside className="h-full w-full sm:w-64 md:w-72 lg:w-80 flex flex-col border-r border-gray-200 bg-white shadow-sm">
      {/* Header with logo/title removed as original doesn't have it */}
      
      <div className="flex-1 overflow-y-auto">
        {/* COLORS Section */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => setColorsOpen(!colorsOpen)}
            className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
          >
            <div className="flex items-center gap-1.5 font-semibold text-blue-600 text-xs">
              <Palette className="h-3.5 w-3.5" />
              <span>COLORS</span>
            </div>
            {colorsOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          {colorsOpen && (
            <div className="space-y-3 px-4 pb-4">
              <ColorPalette />

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Preset</span>
                  <button className="text-[10px] text-gray-400" disabled>
                    Add to preset
                  </button>
                </div>
                <select
                  value={currentPreset}
                  onChange={(e) => handleLoadPreset(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs"
                >
                  {GRADIENT_PRESETS.map((preset) => (
                    <option key={preset.title} value={preset.title}>
                      {preset.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="adjust-position" className="text-xs font-normal">
                    Adjust color position
                  </Label>
                  <Switch
                    id="adjust-position"
                    checked={adjustColorPosition}
                    onCheckedChange={handleAdjustColorPositionChange}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="adjust-vertices" className="text-xs font-normal">
                    Adjust Vertices
                  </Label>
                  <Switch
                    id="adjust-vertices"
                    checked={adjustVertices}
                    onCheckedChange={setAdjustVertices}
                  />
                </div>
              </div>

              {/* Shape Rotation Controls */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                  <RotateCw className="h-3.5 w-3.5" />
                  <span>Shape Rotation</span>
                </div>

                {/* Rotate All Shapes */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-normal text-gray-600">All Shapes</Label>
                    <span className="text-[10px] text-gray-500">{globalRotation}°</span>
                  </div>
                  <Slider
                    min={0}
                    max={360}
                    step={1}
                    value={[globalRotation]}
                    onValueChange={(value) => {
                      setGlobalRotation(value[0]);
                      rotateAllShapes(value[0]);
                    }}
                    onValueCommit={() => saveHistory()}
                    className="w-full"
                  />
                </div>

                {/* Per-Shape Rotation */}
                <div className="space-y-2">
                  <Label className="text-xs font-normal text-gray-600">Per Shape</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {shapes.map((shape, index) => (
                      <div key={shape.id} className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-sm border border-gray-300 flex-shrink-0"
                          style={{ backgroundColor: palette[shape.fillIndex]?.color || '#ccc' }}
                        />
                        <span className="text-[10px] text-gray-500 w-6">#{index + 1}</span>
                        <Slider
                          min={0}
                          max={360}
                          step={1}
                          value={[shape.rotation ?? 0]}
                          onValueChange={(value) => rotateShape(shape.id, value[0])}
                          onValueCommit={() => saveHistory()}
                          className="flex-1"
                        />
                        <span className="text-[10px] text-gray-500 w-8">{shape.rotation ?? 0}°</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FILTERS Section */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
          >
            <div className="flex items-center gap-1.5 font-semibold text-blue-600 text-xs">
              <Sliders className="h-3.5 w-3.5" />
              <span>FILTERS</span>
            </div>
            {filtersOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          {filtersOpen && (
            <div className="px-4 pb-4">
              <FilterPanel onSpreadChange={handleSpreadChange} />
            </div>
          )}
        </div>

      </div>
    </aside>
  );
}
