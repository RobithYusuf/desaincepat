'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { GRADIENT_PRESETS } from '@/lib/gradients';
import { Upload } from 'lucide-react';
import { useMemo, useRef } from 'react';

interface BulkBackgroundPickerProps {
  background: string;
  defaultBackground: string;
  setBackground: (background: string) => void;
  itemId?: string;
}

export function BulkBackgroundPicker({
  background,
  defaultBackground,
  setBackground,
  itemId,
}: BulkBackgroundPickerProps) {
  const inputId = `custom-color-${itemId || 'default'}`;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const colorMatrix = {
    slate: ['#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155', '#1e293b', '#0f172a'],
    gray: ['#f9fafb', '#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#4b5563', '#374151', '#1f2937', '#111827'],
    zinc: ['#fafafa', '#f4f4f5', '#e4e4e7', '#d4d4d8', '#a1a1aa', '#71717a', '#52525b', '#3f3f46', '#27272a', '#18181b'],
    red: ['#fef2f2', '#fee2e2', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d'],
    orange: ['#fff7ed', '#ffedd5', '#fed7aa', '#fdba74', '#fb923c', '#f97316', '#ea580c', '#c2410c', '#9a3412', '#7c2d12'],
    amber: ['#fffbeb', '#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f'],
    yellow: ['#fefce8', '#fef9c3', '#fef08a', '#fde047', '#facc15', '#eab308', '#ca8a04', '#a16207', '#854d0e', '#713f12'],
    lime: ['#f7fee7', '#ecfccb', '#d9f99d', '#bef264', '#a3e635', '#84cc16', '#65a30d', '#4d7c0f', '#3f6212', '#365314'],
    green: ['#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d'],
    emerald: ['#ecfdf5', '#d1fae5', '#a7f3d0', '#6ee7b7', '#34d399', '#10b981', '#059669', '#047857', '#065f46', '#064e3b'],
    teal: ['#f0fdfa', '#ccfbf1', '#99f6e4', '#5eead4', '#2dd4bf', '#14b8a6', '#0d9488', '#0f766e', '#115e59', '#134e4a'],
    cyan: ['#ecfeff', '#cffafe', '#a5f3fc', '#67e8f9', '#22d3ee', '#06b6d4', '#0891b2', '#0e7490', '#155e75', '#164e63'],
    sky: ['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e'],
    blue: ['#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a'],
    indigo: ['#eef2ff', '#e0e7ff', '#c7d2fe', '#a5b4fc', '#818cf8', '#6366f1', '#4f46e5', '#4338ca', '#3730a3', '#312e81'],
    violet: ['#f5f3ff', '#ede9fe', '#ddd6fe', '#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95'],
    purple: ['#faf5ff', '#f3e8ff', '#e9d5ff', '#d8b4fe', '#c084fc', '#a855f7', '#9333ea', '#7e22ce', '#6b21a8', '#581c87'],
    fuchsia: ['#fdf4ff', '#fae8ff', '#f5d0fe', '#f0abfc', '#e879f9', '#d946ef', '#c026d3', '#a21caf', '#86198f', '#701a75'],
    pink: ['#fdf2f8', '#fce7f3', '#fbcfe8', '#f9a8d4', '#f472b6', '#ec4899', '#db2777', '#be185d', '#9d174d', '#831843'],
    rose: ['#fff1f2', '#ffe4e6', '#fecdd3', '#fda4af', '#fb7185', '#f43f5e', '#e11d48', '#be123c', '#9f1239', '#881337'],
  };

  const hueNames = Object.keys(colorMatrix) as (keyof typeof colorMatrix)[];

  const getImageName = (imageUrl: string): string => {
    if (imageUrl === 'none') return 'No Background';
    const match = imageUrl.match(/\/([^\/]+)\.(jpg|png|jpeg|webp)/i);
    if (match) {
      const filename = match[1];
      return filename
        .replace(/[-_]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    return 'Background Image';
  };

  const images = [
    'none',
    // Vibrant Vista
    'url(/backgrounds/vibrant-vista-001.jpg)',
    'url(/backgrounds/vibrant-vista-002.jpg)',
    'url(/backgrounds/vibrant-vista-003.jpg)',
    'url(/backgrounds/vibrant-vista-004.jpg)',
    'url(/backgrounds/vibrant-vista-005.jpg)',
    'url(/backgrounds/vibrant-vista-006.jpg)',
    // Deep Dusk
    'url(/backgrounds/deep-dusk-001.jpg)',
    'url(/backgrounds/deep-dusk-002.jpg)',
    'url(/backgrounds/deep-dusk-003.jpg)',
    'url(/backgrounds/deep-dusk-004.jpg)',
    'url(/backgrounds/deep-dusk-005.jpg)',
    'url(/backgrounds/deep-dusk-006.jpg)',
    // Green Glory
    'url(/backgrounds/green-glory-001.jpg)',
    'url(/backgrounds/green-glory-002.jpg)',
    'url(/backgrounds/green-glory-003.jpg)',
    'url(/backgrounds/green-glory-004.jpg)',
    'url(/backgrounds/green-glory-005.jpg)',
    'url(/backgrounds/green-glory-006.jpg)',
    // Beautiful Blue
    'url(/backgrounds/beautiful-blue-001.jpg)',
    'url(/backgrounds/beautiful-blue-002.jpg)',
    'url(/backgrounds/beautiful-blue-003.jpg)',
    'url(/backgrounds/beautiful-blue-004.jpg)',
    'url(/backgrounds/beautiful-blue-005.jpg)',
    'url(/backgrounds/beautiful-blue-006.jpg)',
    // Pretty in Pink
    'url(/backgrounds/pretty-in-pink-001.jpg)',
    'url(/backgrounds/pretty-in-pink-002.jpg)',
    'url(/backgrounds/pretty-in-pink-003.jpg)',
    'url(/backgrounds/pretty-in-pink-004.jpg)',
    'url(/backgrounds/pretty-in-pink-005.jpg)',
    'url(/backgrounds/pretty-in-pink-006.jpg)',
    // Other backgrounds
    'url(/backgrounds/nature.jpg)',
    'url(/backgrounds/abstract.jpg)',
    'url(/backgrounds/yellow.jpg)',
    'url(/backgrounds/gradient.jpg)',
    'url(/backgrounds/new.jpg)',
    'url(/backgrounds/material.jpg)',
    'url(/backgrounds/board.jpg)',
    'url(/backgrounds/light.jpg)',
    'url(/backgrounds/cool.jpg)',
    // Unsplash
    'url(/backgrounds/unsplash-01.jpg)',
    'url(/backgrounds/unsplash-02.jpg)',
    'url(/backgrounds/unsplash-03.jpg)',
    'url(/backgrounds/unsplash-04.jpg)',
    'url(/backgrounds/unsplash-05.jpg)',
    'url(/backgrounds/unsplash-06.jpg)',
    'url(/backgrounds/unsplash-07.jpg)',
    'url(/backgrounds/unsplash-08.jpg)',
    'url(/backgrounds/unsplash-09.jpg)',
    'url(/backgrounds/unsplash-10.jpg)',
    'url(/backgrounds/unsplash-11.jpg)',
    'url(/backgrounds/unsplash-12.jpg)',
    'url(/backgrounds/unsplash-13.jpg)',
    'url(/backgrounds/unsplash-14.jpg)',
    'url(/backgrounds/unsplash-15.jpg)',
    'url(/backgrounds/unsplash-16.jpg)',
    'url(/backgrounds/unsplash-17.jpg)',
    'url(/backgrounds/unsplash-18.jpg)',
    'url(/backgrounds/unsplash-19.jpg)',
    'url(/backgrounds/unsplash-20.jpg)',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setBackground(`url(${imageUrl})`);
      };
      reader.readAsDataURL(file);
    }
  };

  const defaultTab = useMemo(() => {
    if (background.includes('url')) return 'image';
    if (background.includes('gradient')) return 'gradient';
    return 'solid';
  }, [background]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="h-8 w-8 rounded !bg-center !bg-cover transition-all border-2 border-gray-300 shadow-sm hover:scale-110 hover:border-gray-400"
          style={{ background }}
          title="Ubah background"
        />
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end" side="right" sideOffset={10}>
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="w-full mb-4 grid grid-cols-3">
            <TabsTrigger className="text-xs" value="solid">
              Solid
            </TabsTrigger>
            <TabsTrigger className="text-xs" value="gradient">
              Gradient
            </TabsTrigger>
            <TabsTrigger className="text-xs" value="image">
              Image
            </TabsTrigger>
          </TabsList>

          <TabsContent value="solid" className="mt-0 max-h-[10rem] overflow-y-auto pr-1 pl-1">
            <div className="flex flex-wrap gap-1">
              {hueNames.map((hueName) => (
                colorMatrix[hueName].map((color, index) => (
                  <div
                    key={`${hueName}-${color}`}
                    style={{ background: color }}
                    className="h-6 w-6 rounded-md cursor-pointer transition-all hover:scale-110 hover:ring-2 hover:ring-ring hover:ring-offset-1"
                    onClick={() => setBackground(color)}
                    title={`${hueName.charAt(0).toUpperCase() + hueName.slice(1)} ${(index + 1) * 100}`}
                  />
                ))
              ))}
            </div>
          </TabsContent>

          <TabsContent value="gradient" className="mt-0 max-h-[10rem] overflow-y-auto pr-1">
            <div className="flex flex-wrap gap-1">
              {GRADIENT_PRESETS.map((gradient, index) => (
                <div
                  key={index}
                  style={{ background: gradient }}
                  className="rounded-md h-6 w-6 cursor-pointer active:scale-105"
                  onClick={() => setBackground(gradient)}
                  title={`Gradient ${index + 1}`}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="image" className="mt-0 max-h-[10rem] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-1 mb-2">
              {images.map((image, index) => (
                <div
                  key={index}
                  style={{ backgroundImage: image === 'none' ? undefined : image }}
                  className={cn(
                    "border rounded-md bg-cover bg-center h-12 w-full cursor-pointer active:scale-105",
                    image === 'none' && "bg-white relative"
                  )}
                  onClick={() => setBackground(image)}
                  title={getImageName(image)}
                >
                  {image === 'none' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <line x1="2" y1="2" x2="22" y2="22" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white"
              size="lg"
            >
              <Upload className="mr-2 h-4 w-4" />
              Choose File
            </Button>
          </TabsContent>
        </Tabs>

        <div className="space-y-3 mt-4 pt-4 border-t">
          <div className="space-y-2">
            <Label htmlFor={inputId} className="text-xs font-medium">
              Custom Color Code
            </Label>
            <Input
              id={inputId}
              value={background}
              className="h-9 text-xs font-mono"
              placeholder="#000000 or linear-gradient(...) or url(...)"
              onChange={(e) => setBackground(e.currentTarget.value)}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
