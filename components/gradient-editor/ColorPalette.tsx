'use client';

import { useState } from 'react';
import { useGradientStore } from '@/store/gradient-store';
import { HexColorPicker } from 'react-colorful';
import { Plus, X } from 'lucide-react';

interface ColorSwatchProps {
  id: string;
  color: string;
  onRemove: () => void;
  onClick: (e: React.MouseEvent) => void;
}

function ColorSwatch({ id, color, onRemove, onClick }: ColorSwatchProps) {
  return (
    <div className="group relative">
      {/* Color button - clickable to edit */}
      <button
        onClick={onClick}
        className="h-11 w-11 rounded-full border-2 border-white shadow-md transition-all hover:scale-110 hover:shadow-lg cursor-pointer ring-2 ring-gray-200 hover:ring-blue-500"
        style={{ backgroundColor: color }}
        aria-label={`Edit color ${color}`}
      />
      
      {/* Remove button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 hover:bg-red-700 text-white opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer z-10"
        aria-label="Remove color"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

export function ColorPalette() {
  const { palette, addColor, removeColor, updateColor } = useGradientStore();
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });

  const handleColorClick = (colorId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Calculate position next to the clicked color swatch
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    
    // Position picker to the right of the color swatch with some spacing
    setPickerPosition({
      top: rect.top,
      left: rect.right + 16, // 16px spacing from color swatch
    });
    
    setSelectedColorId(colorId);
    setShowPicker(true);
    
    console.log('✅ Color picker opened for:', colorId);
  };

  const handleColorChange = (newColor: string) => {
    if (selectedColorId) {
      updateColor(selectedColorId, newColor);
    }
  };

  const handleAddColor = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    addColor(newColor);
  };

  const selectedColor = palette.find((c) => c.id === selectedColorId)?.color || '#000000';

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
        <span>Palette</span>
        <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {palette.map((color) => (
          <ColorSwatch
            key={color.id}
            id={color.id}
            color={color.color}
            onRemove={() => removeColor(color.id)}
            onClick={(e) => handleColorClick(color.id, e)}
          />
        ))}
        <button
          onClick={handleAddColor}
          className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-gray-400 transition-all hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50"
          aria-label="Add color"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {showPicker && (
        <>
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowPicker(false)}
          />
          
          {/* Floating color picker popup - positioned next to color swatch */}
          <div 
            className="fixed z-50 bg-white rounded-lg shadow-2xl p-4 w-72"
            style={{
              top: `${pickerPosition.top}px`,
              left: `${pickerPosition.left}px`,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-900">Edit Color</h3>
              <button
                onClick={() => setShowPicker(false)}
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                ✕
              </button>
            </div>
            
            {/* Color picker */}
            <div className="space-y-3">
              <HexColorPicker 
                color={selectedColor} 
                onChange={handleColorChange}
                style={{ width: '100%', height: '160px' }}
              />
              
              {/* Hex input */}
              <input
                type="text"
                value={selectedColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#000000"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
