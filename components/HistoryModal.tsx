"use client";

import { useState } from 'react';
import { History, Download, Trash2, Image, X, Clock, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useHistoryStore, formatTimeAgo, getStyleLabel, HistoryItem, clearHistoryStorage } from '@/store/history-store';
import { useDesignStore } from '@/store/design-store';

export function HistoryModal() {
  const [open, setOpen] = useState(false);
  const { items, removeItem, clearHistory, quotaError, clearQuotaError } = useHistoryStore();
  const { setBackgroundMode, setCustomGradient, setBackgroundSizing } = useDesignStore();

  const handleClearAll = () => {
    clearHistoryStorage(); // Clear localStorage directly
    clearHistory(); // Clear store state
    clearQuotaError();
  };

  const handleApplyToCanvas = (item: HistoryItem) => {
    setBackgroundMode('gradient');
    setCustomGradient(`url(${item.imageDataUrl})`);
    setBackgroundSizing('contain');
    setOpen(false);
  };

  const handleDownload = (item: HistoryItem) => {
    const link = document.createElement('a');
    link.href = item.imageDataUrl;
    link.download = `thumbnail-${item.topic.slice(0, 30).replace(/[^a-z0-9]/gi, '-')}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (id: string) => {
    removeItem(id);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-9 gap-1.5 border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
        >
          <History className="mr-1 h-4 w-4" />
          History
          {items.length > 0 && (
            <span className="ml-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-green-100 px-1 text-[10px] font-semibold text-green-700">
              {items.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-green-600" />
              Generation History
            </DialogTitle>
            {(items.length > 0 || quotaError) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Clear All
              </Button>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {items.length === 0 
              ? 'No generated thumbnails yet' 
              : `${items.length} generated thumbnail${items.length > 1 ? 's' : ''}`
            }
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto mt-4 -mx-6 px-6">
          {quotaError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
              <div className="flex items-start gap-2">
                <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-800">Storage penuh</p>
                  <p className="text-xs text-red-600 mt-0.5">
                    History terlalu besar. Klik &quot;Clear All&quot; untuk mengosongkan.
                  </p>
                </div>
              </div>
            </div>
          )}
          {items.length === 0 && !quotaError ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-gray-100 p-4 mb-4">
                <Image className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">No history yet</p>
              <p className="text-sm text-gray-500 mt-1">
                Generated thumbnails will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <HistoryItemCard
                  key={item.id}
                  item={item}
                  onApply={() => handleApplyToCanvas(item)}
                  onDownload={() => handleDownload(item)}
                  onDelete={() => handleDelete(item.id)}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface HistoryItemCardProps {
  item: HistoryItem;
  onApply: () => void;
  onDownload: () => void;
  onDelete: () => void;
}

function HistoryItemCard({ item, onApply, onDownload, onDelete }: HistoryItemCardProps) {
  return (
    <div className="flex gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:border-gray-300 transition-colors">
      {/* Thumbnail Preview */}
      <div className="flex-shrink-0">
        <div className="relative h-16 w-28 overflow-hidden rounded-md bg-gray-100 border border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.imageDataUrl}
            alt={item.topic}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-gray-900 truncate" title={item.topic}>
          {item.topic}
        </h4>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
          <span className="inline-flex items-center text-xs text-gray-600">
            {getStyleLabel(item.style)}
          </span>
          <span className="text-gray-300">•</span>
          <span className="inline-flex items-center text-xs text-gray-500">
            {item.mode === 'quality' ? (
              <Sparkles className="h-3 w-3 mr-0.5 text-purple-500" />
            ) : (
              <Zap className="h-3 w-3 mr-0.5 text-yellow-500" />
            )}
            {item.resolution}
          </span>
          <span className="text-gray-300">•</span>
          <span className="inline-flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-0.5" />
            {formatTimeAgo(item.createdAt)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-shrink-0 items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onApply}
          className="h-8 px-2 text-xs text-green-600 hover:text-green-700 hover:bg-green-50"
          title="Apply to canvas"
        >
          Apply
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDownload}
          className="h-8 w-8 text-gray-600 hover:text-gray-700 hover:bg-gray-100"
          title="Download"
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
          title="Delete"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
