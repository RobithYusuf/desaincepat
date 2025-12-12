"use client";

import { useState } from 'react';
import { Download, FileArchive, Loader2, Files } from 'lucide-react';
import { useBulkStore, textToFileName } from '@/store/bulk-store';
import { useDesignStore } from '@/store/design-store';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type DownloadMode = 'zip' | 'multiple';
type ExportFormat = 'png' | 'webp';

interface ExportPreset {
  id: string;
  label: string;
  description: string;
  pixelRatio: number;
  format: ExportFormat;
  quality: number;
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

export function BulkExportModal() {
  const [open, setOpen] = useState(false);
  const [downloadMode, setDownloadMode] = useState<DownloadMode>('zip');
  const [selectedPreset, setSelectedPreset] = useState<string>("hd");
  
  const {
    bulkItems,
    isGenerating,
    currentIndex,
    totalItems,
    setIsGenerating,
    setCurrentIndex,
    addGeneratedImage,
    resetGeneration,
    cancelGeneration,
    resetCancel,
  } = useBulkStore();

  const designStore = useDesignStore();
  const { getFrameDimensions, frameSize } = designStore;
  const dimensions = getFrameDimensions();

  const preset = EXPORT_PRESETS.find((p) => p.id === selectedPreset);
  const exportWidth = dimensions.width * (preset?.pixelRatio || 2);
  const exportHeight = dimensions.height * (preset?.pixelRatio || 2);

  const frameSizeLabel = {
    youtube: "YouTube Thumbnail",
    instagram: "Instagram Post",
    twitter: "Twitter Banner",
    custom: "Custom Size"
  }[frameSize];

  const handleGenerate = async () => {
    if (bulkItems.length === 0 || !preset) return;

    resetGeneration();
    resetCancel();
    setIsGenerating(true);

    const { generateBulkThumbnails } = await import('@/lib/bulk-generator');

    try {
      await generateBulkThumbnails(
        bulkItems,
        designStore,
        {
          format: preset.format,
          quality: preset.pixelRatio as 1 | 2 | 3,
          width: exportWidth,
          height: exportHeight,
        },
        (index, image) => {
          setCurrentIndex(index);
          addGeneratedImage(image);
        },
        () => useBulkStore.getState().shouldCancel
      );

      // Download when complete
      if (!useBulkStore.getState().shouldCancel) {
        const images = useBulkStore.getState().generatedImages;
        const successfulImages = images.filter(img => img.status === 'done' && img.dataUrl);
        
        if (downloadMode === 'zip') {
          const { downloadAsZip } = await import('@/lib/zip-exporter');
          await downloadAsZip(images, `thumbnails-bulk-${Date.now()}.zip`);
        } else {
          const { downloadSingleImage } = await import('@/lib/zip-exporter');
          for (const img of successfulImages) {
            await downloadSingleImage(img, preset.format);
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        }
      }
    } catch (error) {
      console.error('Bulk generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCancel = () => {
    cancelGeneration();
  };

  const progress = totalItems > 0 ? Math.round((currentIndex / totalItems) * 100) : 0;
  const aiCount = bulkItems.filter(item => item.aiBackground).length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={bulkItems.length === 0}
          className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
        >
          <Download className="mr-2 h-4 w-4" />
          Export {bulkItems.length} Thumbnails
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-base">Export {bulkItems.length} Thumbnails</DialogTitle>
          <DialogDescription className="text-xs">
            Choose resolution and download as {downloadMode === 'zip' ? 'ZIP archive' : 'individual files'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Resolution Presets - 2x2 Grid */}
          <div className="grid grid-cols-2 gap-2">
            {EXPORT_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPreset(p.id)}
                disabled={isGenerating}
                className={`relative rounded-lg border p-3 text-left transition-all ${
                  selectedPreset === p.id
                    ? "border-green-600 bg-green-50 ring-1 ring-green-600"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                } disabled:opacity-50`}
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

          {/* Info Bar + Download Mode - Side by Side */}
          <div className="grid grid-cols-2 gap-3">
            {/* Info Bar */}
            <div className="rounded-lg bg-gray-50 px-3 py-2 text-[11px] space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Frame:</span>
                <span className="font-medium">{frameSizeLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Items:</span>
                <span className="font-medium">{bulkItems.length} {aiCount > 0 && <span className="text-purple-500">({aiCount} AI)</span>}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Export:</span>
                <span className="font-medium text-green-600">{exportWidth}×{exportHeight}</span>
              </div>
            </div>

            {/* Download Mode */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-gray-500">Download Mode</label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setDownloadMode('zip')}
                  disabled={isGenerating}
                  className={`px-2 py-2 rounded-md text-xs font-medium border transition-all flex items-center justify-center gap-1.5 ${
                    downloadMode === 'zip'
                      ? 'border-green-600 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  } disabled:opacity-50`}
                >
                  <FileArchive className="h-3.5 w-3.5" />
                  ZIP
                </button>
                <button
                  onClick={() => setDownloadMode('multiple')}
                  disabled={isGenerating}
                  className={`px-2 py-2 rounded-md text-xs font-medium border transition-all flex items-center justify-center gap-1.5 ${
                    downloadMode === 'multiple'
                      ? 'border-green-600 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  } disabled:opacity-50`}
                >
                  <Files className="h-3.5 w-3.5" />
                  Multiple
                </button>
              </div>
            </div>
          </div>

          {/* File List Preview - Horizontal scroll */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-gray-500">Output Files Preview</label>
            <div className="flex gap-2 overflow-x-auto pb-2 rounded-lg border border-gray-200 bg-gray-50 p-2">
              {bulkItems.slice(0, 8).map((item, i) => (
                <div key={i} className="flex-shrink-0 text-center">
                  <div 
                    className="w-16 h-9 rounded border border-gray-300 mb-1"
                    style={{ 
                      background: item.aiBackground 
                        ? `url(${item.aiBackground})` 
                        : item.background || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <p className="text-[9px] text-gray-500 truncate w-16">
                    {item.aiBackground && <span className="text-purple-500">AI • </span>}
                    {textToFileName(item.text).slice(0, 10)}
                  </p>
                </div>
              ))}
              {bulkItems.length > 8 && (
                <div className="flex-shrink-0 w-16 h-9 rounded border border-dashed border-gray-300 flex items-center justify-center text-[10px] text-gray-400">
                  +{bulkItems.length - 8}
                </div>
              )}
            </div>
          </div>

          {/* Progress */}
          {isGenerating && (
            <div className="space-y-2 rounded-lg bg-green-50 p-3 border border-green-200">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Generating thumbnails...</span>
                <span className="text-green-600 font-medium">{currentIndex}/{totalItems}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {currentIndex > 0 && currentIndex <= bulkItems.length && (
                <p className="text-[10px] text-gray-600 truncate">
                  {bulkItems[currentIndex - 1]?.text}
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-1">
            {isGenerating ? (
              <Button
                variant="outline"
                onClick={handleCancel}
                className="h-9 text-xs text-red-600 border-red-200 hover:bg-red-50"
              >
                Cancel
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="h-9 text-xs"
              >
                Close
              </Button>
            )}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || bulkItems.length === 0}
              className="h-9 px-6 bg-green-600 text-sm text-white hover:bg-green-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export .{preset?.format || 'png'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
