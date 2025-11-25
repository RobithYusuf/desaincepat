'use client';

import { useGradientStore } from '@/store/gradient-store';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface FilterPanelProps {
  onSpreadChange?: (value: number) => void;
}

export function FilterPanel({ onSpreadChange }: FilterPanelProps) {
  const { filters, setBlur, setGrain, setOpacity, setSpread, resetFilters } = useGradientStore();

  const handleSpreadChange = (value: number) => {
    setSpread(value);
    onSpreadChange?.(value);
  };

  return (
    <div className="space-y-3.5">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="blur" className="text-xs font-medium">
            Blur
          </Label>
          <span className="text-[10px] text-gray-500">{filters.blur}</span>
        </div>
        <Slider
          id="blur"
          min={0}
          max={100}
          step={1}
          value={[filters.blur]}
          onValueChange={(value) => setBlur(value[0])}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="grain" className="text-xs font-medium">
            Grain
          </Label>
          <span className="text-[10px] text-gray-500">{filters.grain}</span>
        </div>
        <Slider
          id="grain"
          min={0}
          max={100}
          step={1}
          value={[filters.grain]}
          onValueChange={(value) => setGrain(value[0])}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="opacity" className="text-xs font-medium">
            Opacity
          </Label>
          <span className="text-[10px] text-gray-500">{filters.opacity}</span>
        </div>
        <Slider
          id="opacity"
          min={0}
          max={100}
          step={1}
          value={[filters.opacity]}
          onValueChange={(value) => setOpacity(value[0])}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="spread" className="text-xs font-medium">
            Spread
          </Label>
          <span className="text-[10px] text-gray-500">{filters.spread}</span>
        </div>
        <Slider
          id="spread"
          min={50}
          max={150}
          step={1}
          value={[filters.spread]}
          onValueChange={(value) => handleSpreadChange(value[0])}
          className="w-full"
        />
      </div>

      <Button
        onClick={resetFilters}
        variant="outline"
        size="sm"
        className="w-full text-xs h-8"
      >
        Reset Filters
      </Button>
    </div>
  );
}
