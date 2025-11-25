"use client";

import { useState } from "react";
import { Download } from "lucide-react";
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

const EXPORT_PRESETS = [
  {
    id: "standard",
    label: "Standard",
    description: "Small file, good quality",
    quality: 85,
    pixelRatio: 1,
    recommended: false,
  },
  {
    id: "best",
    label: "Best",
    description: "Balanced (Recommended)",
    quality: 92,
    pixelRatio: 2,
    recommended: true,
  },
  {
    id: "maximum",
    label: "Maximum",
    description: "Large file, best quality",
    quality: 100,
    pixelRatio: 3,
    recommended: false,
  },
] as const;

export function ExportModal() {
  const { 
    exportAsImage, 
    setExportQuality, 
    setExportPixelRatio,
    getFrameDimensions,
    frameSize,
    backgroundMode,
    fontFamily,
    textureEnabled,
  } = useDesignStore();
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState("desaincepat-thumbnail");
  const [selectedPreset, setSelectedPreset] = useState<string>("best");
  const [isExporting, setIsExporting] = useState(false);

  const dimensions = getFrameDimensions();
  const preset = EXPORT_PRESETS.find((p) => p.id === selectedPreset);
  const exportWidth = dimensions.width * (preset?.pixelRatio || 2);
  const exportHeight = dimensions.height * (preset?.pixelRatio || 2);
  const estimatedSize = ((exportWidth * exportHeight * 3) / 1024 / 1024 * (preset?.quality || 92) / 100).toFixed(1);

  // Get frame size label
  const frameSizeLabel = {
    youtube: "YouTube Thumbnail",
    instagram: "Instagram Post",
    twitter: "Twitter Banner",
    custom: "Custom Size"
  }[frameSize];

  const handleExport = async () => {
    const preset = EXPORT_PRESETS.find((p) => p.id === selectedPreset);
    if (!preset) return;

    setIsExporting(true);
    
    // Update store settings
    setExportQuality(preset.quality);
    setExportPixelRatio(preset.pixelRatio);

    // Export
    await exportAsImage(fileName);
    
    setIsExporting(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-base">Export Thumbnail</DialogTitle>
          <DialogDescription className="text-xs">
            Customize export settings
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          {/* Thumbnail Info */}
          <div className="rounded-md bg-gray-50 p-2.5 border border-gray-200">
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
              <div>
                <span className="text-gray-500">Frame:</span>
                <span className="ml-1 font-medium text-gray-900">{frameSizeLabel}</span>
              </div>
              <div>
                <span className="text-gray-500">Size:</span>
                <span className="ml-1 font-medium text-gray-900">{dimensions.width} × {dimensions.height}</span>
              </div>
              <div>
                <span className="text-gray-500">Export:</span>
                <span className="ml-1 font-medium text-gray-900">{exportWidth} × {exportHeight}</span>
              </div>
              <div>
                <span className="text-gray-500">Est. Size:</span>
                <span className="ml-1 font-medium text-gray-900">~{estimatedSize} MB</span>
              </div>
              <div>
                <span className="text-gray-500">Font:</span>
                <span className="ml-1 font-medium text-gray-900">{fontFamily}</span>
              </div>
              <div>
                <span className="text-gray-500">Background:</span>
                <span className="ml-1 font-medium text-gray-900 capitalize">{backgroundMode}</span>
              </div>
            </div>
          </div>

          {/* File Name Input */}
          <div className="grid gap-1.5">
            <Label htmlFor="filename" className="text-xs font-medium">File Name</Label>
            <Input
              id="filename"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="my-thumbnail"
              className="h-8 text-xs"
            />
            <p className="text-[11px] text-gray-500">Saved as: {fileName}.png</p>
          </div>

          {/* Export Quality Presets */}
          <div className="grid gap-1.5">
            <Label className="text-xs font-medium">Export Quality</Label>
            <div className="grid gap-1.5">
              {EXPORT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset.id)}
                  className={`relative flex items-start gap-2 rounded-md border p-2 text-left transition-all ${
                    selectedPreset === preset.id
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {/* Radio Circle */}
                  <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300">
                    {selectedPreset === preset.id && (
                      <div className="h-2 w-2 rounded-full bg-purple-600" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-gray-900">{preset.label}</span>
                      {preset.recommended && (
                        <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-medium text-purple-700">
                          ⭐ Recommended
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] text-gray-600">{preset.description}</p>
                    <p className="mt-0.5 text-[10px] text-gray-500">
                      Quality: {preset.quality}% • Resolution: {preset.pixelRatio}x
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isExporting}
            className="h-8 text-xs"
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting || !fileName.trim()}
            className="h-8 bg-blue-600 text-xs text-white hover:bg-blue-700"
          >
            {isExporting ? (
              <>
                <div className="mr-1.5 h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-1.5 h-3 w-3" />
                Download PNG
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
