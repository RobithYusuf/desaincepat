"use client";

import { useState } from "react";
import { Download, Info } from "lucide-react";
import { useDesignStore } from "@/store/design-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Convert text to filename-friendly format
const textToFileName = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50)
    || 'thumbnail';
};

export type ExportFormat = 'png' | 'jpeg' | 'webp';

interface ExportPreset {
  id: string;
  label: string;
  description: string;
  pixelRatio: number;
  format: ExportFormat;
  quality: number; // Only applies to JPEG/WebP
  recommended: boolean;
}

const EXPORT_PRESETS: ExportPreset[] = [
  {
    id: "standard",
    label: "Standard (1x)",
    description: "Original resolution, smallest file",
    pixelRatio: 1,
    format: 'png',
    quality: 1,
    recommended: false,
  },
  {
    id: "hd",
    label: "HD (2x)",
    description: "Retina quality, sharp on all screens",
    pixelRatio: 2,
    format: 'png',
    quality: 1,
    recommended: true,
  },
  {
    id: "ultra",
    label: "Ultra HD (3x)",
    description: "Maximum resolution for print/zoom",
    pixelRatio: 3,
    format: 'png',
    quality: 1,
    recommended: false,
  },
  {
    id: "compressed",
    label: "Compressed (WebP)",
    description: "Smallest file size, good quality",
    pixelRatio: 2,
    format: 'webp',
    quality: 0.90,
    recommended: false,
  },
];

// Estimate file size based on format and complexity
const estimateFileSize = (
  width: number,
  height: number,
  format: ExportFormat,
  quality: number,
  hasTexture: boolean
): string => {
  const pixels = width * height;
  const bytesPerPixel = 4; // RGBA
  const rawSize = pixels * bytesPerPixel;
  
  let compressionRatio: number;
  
  switch (format) {
    case 'png':
      // PNG compression varies by image complexity
      // Simple gradients: 10-20x, Complex with texture: 3-6x
      compressionRatio = hasTexture ? 4 : 12;
      break;
    case 'jpeg':
      // JPEG compression based on quality
      compressionRatio = 15 + (1 - quality) * 30;
      break;
    case 'webp':
      // WebP is more efficient than JPEG
      compressionRatio = 20 + (1 - quality) * 40;
      break;
    default:
      compressionRatio = 5;
  }
  
  const estimatedBytes = rawSize / compressionRatio;
  
  if (estimatedBytes < 1024) {
    return `~${Math.round(estimatedBytes)} B`;
  } else if (estimatedBytes < 1024 * 1024) {
    return `~${Math.round(estimatedBytes / 1024)} KB`;
  } else {
    return `~${(estimatedBytes / 1024 / 1024).toFixed(1)} MB`;
  }
};

export function ExportModal() {
  const { 
    exportAsImage, 
    getFrameDimensions,
    frameSize,
    backgroundMode,
    fontFamily,
    textureEnabled,
    text,
  } = useDesignStore();
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<string>("standard");
  const [isExporting, setIsExporting] = useState(false);

  const defaultFileName = textToFileName(text);

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setFileName(defaultFileName);
    }
    setOpen(isOpen);
  };

  const dimensions = getFrameDimensions();
  const preset = EXPORT_PRESETS.find((p) => p.id === selectedPreset);
  const exportWidth = dimensions.width * (preset?.pixelRatio || 2);
  const exportHeight = dimensions.height * (preset?.pixelRatio || 2);
  const estimatedSize = estimateFileSize(
    exportWidth,
    exportHeight,
    preset?.format || 'png',
    preset?.quality || 1,
    textureEnabled
  );

  const frameSizeLabel = {
    youtube: "YouTube Thumbnail",
    instagram: "Instagram Post",
    twitter: "Twitter Banner",
    custom: "Custom Size"
  }[frameSize];

  const getFormatExtension = (format: ExportFormat): string => {
    return format === 'jpeg' ? 'jpg' : format;
  };

  const handleExport = async () => {
    const preset = EXPORT_PRESETS.find((p) => p.id === selectedPreset);
    if (!preset) return;

    setIsExporting(true);
    
    await exportAsImage(fileName, {
      format: preset.format,
      pixelRatio: preset.pixelRatio,
      quality: preset.quality,
    });
    
    setIsExporting(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          className="bg-green-600 text-white hover:bg-green-700"
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-base">Export Thumbnail</DialogTitle>
          <DialogDescription className="text-xs">
            Choose resolution and format for your export
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Resolution Presets - 2x2 Grid */}
          <div className="grid grid-cols-2 gap-2">
            {EXPORT_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPreset(p.id)}
                className={`relative rounded-lg border p-3 text-left transition-all ${
                  selectedPreset === p.id
                    ? "border-green-600 bg-green-50 ring-1 ring-green-600"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {p.recommended && (
                  <span className="absolute -top-2 right-2 rounded bg-green-600 px-1.5 py-0.5 text-[9px] font-medium text-white">
                    Best
                  </span>
                )}
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-semibold text-gray-900">{p.label}</span>
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 uppercase">
                    {p.format}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mb-0.5">{p.description}</p>
                <p className="text-[10px] text-gray-400">
                  {dimensions.width * p.pixelRatio} × {dimensions.height * p.pixelRatio}px
                  {p.format !== 'png' && ` • ${Math.round(p.quality * 100)}%`}
                </p>
                {selectedPreset === p.id && (
                  <div className="absolute top-2 left-2 h-2 w-2 rounded-full bg-green-600" />
                )}
              </button>
            ))}
          </div>

          {/* Info Bar */}
          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-[11px]">
            <div className="flex items-center gap-4">
              <span><span className="text-gray-500">Frame:</span> <span className="font-medium">{frameSizeLabel}</span></span>
              <span><span className="text-gray-500">Export:</span> <span className="font-medium">{exportWidth}×{exportHeight}</span></span>
            </div>
            <span><span className="text-gray-500">Est:</span> <span className="font-medium text-green-600">{estimatedSize}</span></span>
          </div>

          {/* File Name & Actions */}
          <div className="flex items-end gap-3">
            <div className="flex-1 space-y-1">
              <Label htmlFor="filename" className="text-xs font-medium">File Name</Label>
              <Input
                id="filename"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="my-thumbnail"
                className="h-9 text-sm"
              />
            </div>
            <Button
              onClick={handleExport}
              disabled={isExporting || !fileName.trim()}
              className="h-9 px-6 bg-green-600 text-sm text-white hover:bg-green-700"
            >
              {isExporting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export .{getFormatExtension(preset?.format || 'png')}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
