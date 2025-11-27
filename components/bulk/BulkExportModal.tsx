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

export function BulkExportModal() {
  const [open, setOpen] = useState(false);
  const [downloadMode, setDownloadMode] = useState<DownloadMode>('zip');
  
  const {
    bulkItems,
    exportFormat,
    exportQuality,
    setExportFormat,
    setExportQuality,
    isGenerating,
    currentIndex,
    totalItems,
    generatedImages,
    setIsGenerating,
    setCurrentIndex,
    addGeneratedImage,
    resetGeneration,
    shouldCancel,
    cancelGeneration,
    resetCancel,
  } = useBulkStore();

  const designStore = useDesignStore();
  const { getFrameDimensions } = designStore;
  const dimensions = getFrameDimensions();

  const exportWidth = dimensions.width * exportQuality;
  const exportHeight = dimensions.height * exportQuality;

  const handleGenerate = async () => {
    if (bulkItems.length === 0) return;

    resetGeneration();
    resetCancel();
    setIsGenerating(true);

    const { generateBulkThumbnails } = await import('@/lib/bulk-generator');

    try {
      await generateBulkThumbnails(
        bulkItems,
        designStore,
        {
          format: exportFormat,
          quality: exportQuality,
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
          // Multiple individual downloads
          const { downloadSingleImage } = await import('@/lib/zip-exporter');
          for (const img of successfulImages) {
            await downloadSingleImage(img, exportFormat);
            // Small delay between downloads to prevent browser blocking
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={bulkItems.length === 0}
          className="bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
        >
          <Download className="mr-2 h-4 w-4" />
          Export {bulkItems.length} Thumbnails
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-base flex items-center gap-2">
            <FileArchive className="h-5 w-5 text-purple-600" />
            Bulk Export
          </DialogTitle>
          <DialogDescription className="text-xs">
            Generate {bulkItems.length} thumbnails and download as {downloadMode === 'zip' ? 'ZIP' : 'individual files'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Info */}
          <div className="rounded-md bg-gray-50 p-3 border border-gray-200">
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-gray-500">Items:</span>
                <span className="ml-1 font-medium text-gray-900">{bulkItems.length}</span>
              </div>
              <div>
                <span className="text-gray-500">Size:</span>
                <span className="ml-1 font-medium text-gray-900">{dimensions.width}×{dimensions.height}</span>
              </div>
              <div>
                <span className="text-gray-500">Export:</span>
                <span className="ml-1 font-medium text-gray-900">{exportWidth}×{exportHeight}</span>
              </div>
              <div>
                <span className="text-gray-500">Format:</span>
                <span className="ml-1 font-medium text-gray-900 uppercase">{exportFormat}</span>
              </div>
            </div>
          </div>

          {/* Quality Selection */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">Resolusi Export</label>
            <div className="grid grid-cols-3 gap-2">
              {([1, 2, 3] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => setExportQuality(q)}
                  disabled={isGenerating}
                  className={`px-3 py-2.5 rounded-md text-xs font-medium border transition-all ${
                    exportQuality === q
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  } disabled:opacity-50`}
                >
                  <span className="block font-semibold">
                    {q === 1 ? 'Normal' : q === 2 ? 'HD' : 'Ultra HD'}
                  </span>
                  <span className="block text-[10px] text-gray-400 mt-0.5">
                    {q}x pixel
                  </span>
                </button>
              ))}
            </div>
            <div className="text-[10px] text-gray-500 bg-gray-50 rounded-md p-2">
              <p><strong>Normal:</strong> Ukuran file kecil, cocok untuk web</p>
              <p><strong>HD:</strong> Lebih tajam, recommended untuk YouTube</p>
              <p><strong>Ultra HD:</strong> Sangat tajam, file lebih besar</p>
            </div>
          </div>

          {/* Download Mode Selection */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">Download Mode</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDownloadMode('zip')}
                disabled={isGenerating}
                className={`px-3 py-2.5 rounded-md text-xs font-medium border transition-all flex items-center justify-center gap-2 ${
                  downloadMode === 'zip'
                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                } disabled:opacity-50`}
              >
                <FileArchive className="h-4 w-4" />
                <div className="text-left">
                  <span className="block">ZIP</span>
                  <span className="block text-[10px] text-gray-400">Single file</span>
                </div>
              </button>
              <button
                onClick={() => setDownloadMode('multiple')}
                disabled={isGenerating}
                className={`px-3 py-2.5 rounded-md text-xs font-medium border transition-all flex items-center justify-center gap-2 ${
                  downloadMode === 'multiple'
                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                } disabled:opacity-50`}
              >
                <Files className="h-4 w-4" />
                <div className="text-left">
                  <span className="block">Multiple</span>
                  <span className="block text-[10px] text-gray-400">Individual files</span>
                </div>
              </button>
            </div>
          </div>

          {/* File List Preview */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">Output Files</label>
            <div className="max-h-32 overflow-y-auto rounded-md border border-gray-200 bg-gray-50 p-2 space-y-1">
              {bulkItems.slice(0, 5).map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-[10px]">
                  <div 
                    className="w-4 h-3 rounded-sm flex-shrink-0 border border-gray-300"
                    style={{ background: item.background || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  />
                  <span className="text-gray-600 truncate">{textToFileName(item.text)}.{exportFormat}</span>
                </div>
              ))}
              {bulkItems.length > 5 && (
                <div className="text-[10px] text-gray-400 pl-6">
                  ... and {bulkItems.length - 5} more files
                </div>
              )}
            </div>
          </div>

          {/* Progress */}
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Generating...</span>
                <span className="text-purple-600 font-medium">{currentIndex}/{totalItems}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {currentIndex > 0 && currentIndex <= bulkItems.length && (
                <p className="text-[10px] text-gray-500 truncate">
                  Current: {bulkItems[currentIndex - 1]?.text}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          {isGenerating ? (
            <Button
              variant="outline"
              onClick={handleCancel}
              className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50"
            >
              Cancel
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="h-8 text-xs"
            >
              Close
            </Button>
          )}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || bulkItems.length === 0}
            className="h-8 bg-purple-600 text-xs text-white hover:bg-purple-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="mr-1.5 h-3 w-3" />
                Generate & Download
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
