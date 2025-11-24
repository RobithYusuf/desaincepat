'use client';

import { useGradientStore } from '@/store/gradient-store';
import { generateMeshGradient } from '@/lib/mesh-generator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Lock, Unlock } from 'lucide-react';

export function SizePanel() {
  const {
    exportWidth,
    exportHeight,
    aspectRatioLocked,
    canvas,
    palette,
    filters,
    setExportWidth,
    setExportHeight,
    setAspectRatioLocked,
    setExportPreset,
    setShapes,
  } = useGradientStore();

  const presets = [
    { label: 'Square', value: 'square' as const },
    { label: 'Story', value: 'story' as const },
    { label: 'Portrait', value: 'portrait' as const },
    { label: 'Landscape', value: 'landscape' as const },
    { label: 'Open Graph', value: 'opengraph' as const },
    { label: 'YouTube Thumb', value: 'youtube' as const },
  ];

  const handlePresetClick = (presetValue: 'square' | 'story' | 'portrait' | 'landscape' | 'opengraph' | 'youtube') => {
    // Set the preset (which updates canvas and export size)
    setExportPreset(presetValue);
    
    // Wait for next tick to get updated canvas size, then regenerate shapes
    setTimeout(() => {
      const state = useGradientStore.getState();
      const newShapes = generateMeshGradient({
        width: state.canvas.width,
        height: state.canvas.height,
        numColors: palette.length,
        spread: filters.spread,
      });
      setShapes(newShapes);
      console.log(`✅ Regenerated ${newShapes.length} shapes for ${state.canvas.width}×${state.canvas.height} canvas`);
    }, 0);
  };

  return (
    <div className="space-y-3.5">
      <div className="space-y-1.5">
        <Label htmlFor="width" className="text-xs font-medium">
          Export Width
        </Label>
        <Input
          id="width"
          type="number"
          value={exportWidth}
          onChange={(e) => setExportWidth(Number(e.target.value))}
          className="w-full h-8 text-xs"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="height" className="text-xs font-medium">
          Export Height
        </Label>
        <Input
          id="height"
          type="number"
          value={exportHeight}
          onChange={(e) => setExportHeight(Number(e.target.value))}
          className="w-full h-8 text-xs"
        />
      </div>

      <button
        onClick={() => setAspectRatioLocked(!aspectRatioLocked)}
        className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900"
      >
        {aspectRatioLocked ? (
          <Lock className="h-3.5 w-3.5" />
        ) : (
          <Unlock className="h-3.5 w-3.5" />
        )}
        <span>Aspect ratio {aspectRatioLocked ? 'locked' : 'unlocked'}</span>
      </button>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Presets</Label>
        <div className="grid grid-cols-2 gap-1.5">
          {presets.map((preset) => (
            <Button
              key={preset.value}
              onClick={() => handlePresetClick(preset.value)}
              variant="outline"
              size="sm"
              className="text-[10px] h-7 px-2"
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
