"use client";

interface ProgressSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
}

export function ProgressSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  valueFormatter = (v) => `${v}`,
}: ProgressSliderProps) {
  // Calculate percentage for progress fill
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div>
      {label && (
        <div className="mb-1 flex items-center justify-between">
          <label className="text-xs text-gray-700">{label}</label>
          {showValue && (
            <span className="text-xs font-semibold text-green-600">
              {valueFormatter(value)}
            </span>
          )}
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          background: `linear-gradient(to right, rgb(17, 24, 39) 0%, rgb(17, 24, 39) ${percentage}%, rgb(229, 231, 235) ${percentage}%, rgb(229, 231, 235) 100%)`,
        }}
        className="h-1 w-full cursor-pointer appearance-none rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
      />
    </div>
  );
}
