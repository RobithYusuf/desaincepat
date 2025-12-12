"use client";

import { useState, useRef } from 'react';
import { Sparkles, X, Play, StopCircle, Zap, Clock, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBulkStore, BulkItem } from '@/store/bulk-store';
import { useDesignStore } from '@/store/design-store';
import {
  hasApiKey,
  generateThumbnailImage,
  findBestAspectRatio,
} from '@/lib/gemini-client';
import { buildCopyPrompt } from '@/lib/prompt-templates';

// Style options
const STYLE_OPTIONS = [
  { value: 'modern-gradient', label: 'Modern Gradient' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'bold-colorful', label: 'Bold & Colorful' },
  { value: 'professional', label: 'Professional' },
  { value: 'playful', label: 'Playful' },
  { value: 'dark-mode', label: 'Dark Mode' },
  { value: 'neon-glow', label: 'Neon Glow' },
  { value: 'retro-vintage', label: 'Retro/Vintage' },
  { value: 'cinematic', label: 'Cinematic' },
  { value: '3d-render', label: '3D Render' },
] as const;

// Concurrency limit for parallel generation (max 10 to avoid API rate limits)
const MAX_CONCURRENT = 10;

export function AIBulkGenerator() {
  const {
    bulkItems,
    isAIGenerating,
    aiStyle,
    setIsAIGenerating,
    setAICurrentIndex,
    setAIStyle,
    updateItemAIStatus,
    updateItemAIBackground,
    clearAllAIBackgrounds,
    cancelGeneration,
    resetCancel,
  } = useBulkStore();

  const { getFrameDimensions, frameSize } = useDesignStore();
  const { width, height } = getFrameDimensions();
  
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'parallel' | 'sequential'>('parallel');
  const [outputMode, setOutputMode] = useState<'full' | 'background'>('full');
  const [isOpen, setIsOpen] = useState(false); // Default closed
  const cancelledRef = useRef(false);
  const apiKeyExists = hasApiKey();

  // Get aspect ratio for current frame
  const aspectRatio = findBestAspectRatio(width, height);
  
  // Debug logging
  console.log('[AI Bulk] Frame:', { width, height, aspectRatio, frameSize });

  // Generate single item
  const generateSingleItem = async (item: BulkItem): Promise<void> => {
    if (cancelledRef.current) return;
    
    updateItemAIStatus(item.id, 'generating');

    try {
      let finalPrompt: string;
      
      if (outputMode === 'full') {
        // Full thumbnail with AI-styled text
        const prompt = buildCopyPrompt({
          topic: item.text,
          style: aiStyle,
          audience: 'general',
          resolution: frameSize,
        });
        finalPrompt = `${prompt}\n\n[OUTPUT]: Thumbnail, ${width}×${height}px (2K), ${aspectRatio}.`;
      } else {
        // Background only - no text
        const styleHint = aiStyle === '3d-render'
          ? '\n\n[3D LAYOUT]: Distribute multiple 3D objects around the edges (left/right/top/bottom) and corners, avoid a centered cluster. Keep the center relatively clean for future text overlay. Layer depth with varying sizes; some objects can be slightly off-frame for immersion.'
          : '';

        finalPrompt = `Create a visually stunning background image for a YouTube thumbnail about "${item.text}".

[STYLE]: ${aiStyle} aesthetic, professional, eye-catching
[COMPOSITION]: Dynamic composition with visual interest, suitable as background
[CONSTRAINTS]: 
- DO NOT include any text, letters, words, or typography
- DO NOT include any UI elements or overlays
- Create ONLY the background visual/scene
- Leave space for text overlay (center area should not be too busy)
- High contrast areas for text readability
${styleHint}

[OUTPUT]: Background image, ${width}×${height}px (2K), ${aspectRatio}.`;
      }
      
      const result = await generateThumbnailImage(finalPrompt, aspectRatio, '2K');

      if (cancelledRef.current) return;

      if (result.success) {
        const dataUrl = `data:${result.data.mimeType};base64,${result.data.base64}`;
        
        // Debug: Check actual image dimensions
        const img = new Image();
        img.onload = () => {
          const actualRatio = (img.width / img.height).toFixed(2);
          const expectedRatio = (width / height).toFixed(2);
          console.log('[AI Bulk] Image dimensions:', {
            actual: `${img.width}×${img.height}`,
            expected: `${width}×${height}`,
            actualRatio,
            expectedRatio,
            match: actualRatio === expectedRatio ? '✓' : '✗ MISMATCH'
          });
        };
        img.src = dataUrl;
        
        updateItemAIBackground(item.id, dataUrl, outputMode);
      } else {
        updateItemAIStatus(item.id, 'error', result.error);
      }
    } catch (err) {
      if (!cancelledRef.current) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        updateItemAIStatus(item.id, 'error', errorMsg);
      }
    }
  };

  // Parallel generation with concurrency limit
  const handleGenerateParallel = async (onlyPending: boolean = false) => {
    if (!apiKeyExists || bulkItems.length === 0) return;

    setError(null);
    setIsAIGenerating(true);
    cancelledRef.current = false;
    resetCancel();

    // Filter items to generate
    const itemsToGenerate = onlyPending 
      ? bulkItems.filter((item) => !item.aiBackground)
      : bulkItems;

    // Mark items as pending
    itemsToGenerate.forEach((item) => updateItemAIStatus(item.id, 'pending'));

    // Process in batches with concurrency limit
    const queue = [...itemsToGenerate];
    const activePromises: Promise<void>[] = [];

    const processNext = async (): Promise<void> => {
      while (queue.length > 0 && !cancelledRef.current) {
        const item = queue.shift();
        if (item) {
          await generateSingleItem(item);
        }
      }
    };

    // Start concurrent workers
    for (let i = 0; i < Math.min(MAX_CONCURRENT, itemsToGenerate.length); i++) {
      activePromises.push(processNext());
    }

    await Promise.all(activePromises);

    setIsAIGenerating(false);
    setAICurrentIndex(0);
  };

  // Sequential generation (one by one)
  const handleGenerateSequential = async (onlyPending: boolean = false) => {
    if (!apiKeyExists || bulkItems.length === 0) return;

    setError(null);
    setIsAIGenerating(true);
    cancelledRef.current = false;
    resetCancel();

    // Filter items to generate
    const itemsToGenerate = onlyPending 
      ? bulkItems.filter((item) => !item.aiBackground)
      : bulkItems;

    // Mark items as pending
    itemsToGenerate.forEach((item) => updateItemAIStatus(item.id, 'pending'));

    for (let i = 0; i < itemsToGenerate.length; i++) {
      if (cancelledRef.current || useBulkStore.getState().shouldCancel) {
        console.log('[AI Bulk] Generation cancelled');
        break;
      }

      const item = itemsToGenerate[i];
      setAICurrentIndex(i);
      await generateSingleItem(item);

      // Small delay between generations
      if (i < itemsToGenerate.length - 1 && !cancelledRef.current) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    setIsAIGenerating(false);
    setAICurrentIndex(0);
  };

  // Main generate handler
  const handleGenerateAll = async (onlyPending: boolean = false) => {
    if (mode === 'parallel') {
      await handleGenerateParallel(onlyPending);
    } else {
      await handleGenerateSequential(onlyPending);
    }
  };

  const handleCancel = () => {
    cancelledRef.current = true;
    cancelGeneration();
  };

  const handleClear = () => {
    clearAllAIBackgrounds();
    setError(null);
  };

  // Count items by status
  const completedCount = bulkItems.filter((item) => item.aiStatus === 'done').length;
  const generatingCount = bulkItems.filter((item) => item.aiStatus === 'generating').length;
  const errorCount = bulkItems.filter((item) => item.aiStatus === 'error').length;
  const hasAIBackgrounds = bulkItems.some((item) => item.aiBackground);
  const pendingItems = bulkItems.filter((item) => !item.aiBackground);
  const hasPendingItems = pendingItems.length > 0 && pendingItems.length < bulkItems.length;

  if (bulkItems.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-green-200 bg-green-50/50">
      {/* Header - Always visible, clickable to toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-3 hover:bg-green-100/50 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-green-600" />
          <span className="text-xs font-semibold text-green-700">AI GENERATOR</span>
          <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">Beta</span>
          {hasAIBackgrounds && (
            <span className="text-[10px] bg-green-600 text-white px-1.5 py-0.5 rounded">
              {completedCount}/{bulkItems.length}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-green-600" />
        ) : (
          <ChevronRight className="h-4 w-4 text-green-600" />
        )}
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="space-y-3 px-3 pb-3">
          {!apiKeyExists ? (
        <p className="text-xs text-amber-600">
          API Key belum diatur. Buka AI Settings untuk mengatur.
        </p>
      ) : (
        <>
          {/* Style Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-gray-600">Style untuk semua</label>
            <Select value={aiStyle} onValueChange={setAIStyle} disabled={isAIGenerating}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STYLE_OPTIONS.map((style) => (
                  <SelectItem key={style.value} value={style.value} className="text-xs">
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Output Mode Toggle */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-gray-600">Output Mode</label>
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setOutputMode('full')}
                disabled={isAIGenerating}
                className={`flex-1 px-2 py-1.5 rounded text-[10px] font-medium transition-all ${
                  outputMode === 'full'
                    ? 'bg-white text-green-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                } disabled:opacity-50`}
              >
                Full + Text AI
              </button>
              <button
                onClick={() => setOutputMode('background')}
                disabled={isAIGenerating}
                className={`flex-1 px-2 py-1.5 rounded text-[10px] font-medium transition-all ${
                  outputMode === 'background'
                    ? 'bg-white text-green-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                } disabled:opacity-50`}
              >
                Background Only
              </button>
            </div>
            <p className="text-[9px] text-gray-400">
              {outputMode === 'full' 
                ? 'AI generate gambar + text styling (3D, glow, dll)'
                : 'AI generate background, text dari input di-overlay'
              }
            </p>
          </div>

          {/* Speed Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setMode('parallel')}
              disabled={isAIGenerating}
              className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all ${
                mode === 'parallel'
                  ? 'bg-white text-green-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              } disabled:opacity-50`}
            >
              <Zap className="h-3 w-3" />
              Parallel
            </button>
            <button
              onClick={() => setMode('sequential')}
              disabled={isAIGenerating}
              className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all ${
                mode === 'sequential'
                  ? 'bg-white text-green-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              } disabled:opacity-50`}
            >
              <Clock className="h-3 w-3" />
              Sequential
            </button>
          </div>

          {/* Progress Info */}
          {isAIGenerating && (
            <div className="rounded-md bg-white p-2 border border-green-200">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">
                  {mode === 'parallel' 
                    ? `${generatingCount} generating, ${completedCount}/${bulkItems.length} done`
                    : `Generating ${completedCount + 1} / ${bulkItems.length}`
                  }
                </span>
                <span className="text-green-600 font-medium">
                  {Math.round((completedCount / bulkItems.length) * 100)}%
                </span>
              </div>
              <div className="mt-1.5 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${(completedCount / bulkItems.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Completion Stats */}
          {!isAIGenerating && hasAIBackgrounds && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-green-600">{completedCount} berhasil</span>
              {errorCount > 0 && (
                <span className="text-red-500">{errorCount} gagal</span>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            {isAIGenerating ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50"
              >
                <StopCircle className="h-3.5 w-3.5 mr-1.5" />
                Cancel
              </Button>
            ) : (
              <>
                {/* Generate only new items (if some already have AI) */}
                {hasPendingItems && (
                  <Button
                    onClick={() => handleGenerateAll(true)}
                    disabled={!apiKeyExists || pendingItems.length === 0}
                    className="h-8 text-xs bg-green-600 hover:bg-green-700"
                  >
                    <Play className="h-3.5 w-3.5 mr-1.5" />
                    Generate {pendingItems.length} Baru
                  </Button>
                )}
                {/* Generate all or regenerate */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleGenerateAll(false)}
                    disabled={!apiKeyExists || bulkItems.length === 0}
                    variant={hasPendingItems ? "outline" : "default"}
                    className={`flex-1 h-8 text-xs ${!hasPendingItems ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  >
                    <Play className="h-3.5 w-3.5 mr-1.5" />
                    {hasAIBackgrounds ? `Regenerate Semua (${bulkItems.length})` : `Generate ${bulkItems.length}`}
                  </Button>
                  {hasAIBackgrounds && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClear}
                      className="h-8 text-xs"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>

            {/* Info */}
            <p className="text-[10px] text-gray-500">
              {mode === 'parallel' 
                ? `Parallel: ~${Math.ceil(bulkItems.length / Math.min(MAX_CONCURRENT, bulkItems.length)) * 30} detik (${Math.min(MAX_CONCURRENT, bulkItems.length)} concurrent)`
                : `Sequential: ~${bulkItems.length * 30} detik (${bulkItems.length} × 30 detik)`
              }
            </p>
          </>
        )}
        </div>
      )}
    </div>
  );
}
