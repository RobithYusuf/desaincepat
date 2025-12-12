"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useBulkStore, textToFileName, BulkItem, BulkItemTypography, GeneratedImage } from '@/store/bulk-store';
import { useDesignStore } from '@/store/design-store';
import { X, Check, Loader2 } from 'lucide-react';
import { BulkBackgroundPicker } from './BulkBackgroundPicker';
import { BulkTypographyPicker } from './BulkTypographyPicker';

// Separate component for each preview card to use hooks
interface PreviewCardProps {
  item: BulkItem;
  generated?: GeneratedImage;
  isGenerating: boolean;
  canvasWidth: number;
  canvasHeight: number;
  itemBackground: string;
  defaultBackground: string;
  textureEnabled: boolean;
  textureUrl: string | null;
  textureIntensity: number;
  padding: number;
  // Default typography from global settings
  defaultTypography: {
    fontSize: number;
    fontFamily: string;
    fontColor: string;
    textAlign: 'left' | 'center' | 'right';
    lineHeight: number;
    maxWidth: number;
  };
  removeItem: (id: string) => void;
  updateItemBackground: (id: string, bg: string) => void;
  updateItemTypography: (id: string, typography: Partial<BulkItemTypography>) => void;
  clearItemTypography: (id: string) => void;
}

function PreviewCard({
  item,
  generated,
  isGenerating,
  canvasWidth,
  canvasHeight,
  itemBackground,
  defaultBackground,
  textureEnabled,
  textureUrl,
  textureIntensity,
  padding,
  defaultTypography,
  removeItem,
  updateItemBackground,
  updateItemTypography,
  clearItemTypography,
}: PreviewCardProps) {
  // Use custom typography if set, otherwise use defaults
  const fontSize = item.typography?.fontSize ?? defaultTypography.fontSize;
  const fontFamily = item.typography?.fontFamily ?? defaultTypography.fontFamily;
  const fontColor = item.typography?.fontColor ?? defaultTypography.fontColor;
  const textAlign = item.typography?.textAlign ?? defaultTypography.textAlign;
  const lineHeight = item.typography?.lineHeight ?? defaultTypography.lineHeight;
  const maxWidth = item.typography?.maxWidth ?? defaultTypography.maxWidth;
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(300);
  
  useEffect(() => {
    if (cardRef.current) {
      // Set initial width
      setCardWidth(cardRef.current.offsetWidth);
      
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setCardWidth(entry.contentRect.width);
        }
      });
      observer.observe(cardRef.current);
      return () => observer.disconnect();
    }
  }, []);
  
  // Scale factor: card width / canvas width
  const scale = cardWidth / canvasWidth;
  const fileName = textToFileName(item.text);

  // Calculate aspect ratio percentage for padding trick (more reliable than CSS aspectRatio)
  const aspectRatioPercent = (canvasHeight / canvasWidth) * 100;

  return (
    <div className="group relative">
      {/* Preview Card Container - using padding-bottom for reliable aspect ratio */}
      <div
        ref={cardRef}
        className="relative w-full rounded-lg overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
        style={{ 
          paddingBottom: `${aspectRatioPercent}%`,
          // Apply AI background directly to container for proper sizing
          ...(item.aiBackground && {
            backgroundImage: `url(${item.aiBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          })
        }}
      >
        {/* Scaled Content - renders at full canvas size then scales down */}
        <div
          className="absolute inset-0 origin-top-left"
          style={{
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
            transform: `scale(${scale})`,
          }}
        >
          {/* Background - gradient/solid (not AI) */}
          {!item.aiBackground && (
            <div
              className="absolute inset-0"
              style={{
                background: itemBackground,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          )}
          
          {/* Texture Overlay */}
          {textureEnabled && textureUrl && (
            <div
              className="absolute inset-0 z-10"
              style={{
                backgroundImage: `url(${textureUrl})`,
                backgroundRepeat: 'repeat',
                backgroundSize: 'auto',
                opacity: textureIntensity / 100,
                pointerEvents: 'none',
              }}
            />
          )}
          
          {/* Text Container - EXACT same as Canvas */}
          {/* Hide text when AI generated full thumbnail (includes AI text) */}
          {item.aiOutputMode !== 'full' && (
            <div
              className="relative z-20 flex h-full items-center justify-center"
              style={{ padding: `${padding}px` }}
            >
              <h1
                className={fontFamily}
                style={{
                  fontSize: `${fontSize}px`,
                  lineHeight: lineHeight,
                  color: fontColor,
                  textAlign: textAlign,
                  fontWeight: 700,
                  maxWidth: `${maxWidth}%`,
                  wordWrap: 'break-word',
                }}
              >
                {item.text}
              </h1>
            </div>
          )}
        </div>

        {/* Status Overlay - Export Generation */}
        {isGenerating && generated && (
          <div className="absolute inset-0 z-30 bg-black/60 flex flex-col items-center justify-center gap-3">
            {generated.status === 'generating' && (
              <>
                <Loader2 className="h-10 w-10 text-white animate-spin" />
                <span className="text-white text-sm font-medium">Exporting...</span>
              </>
            )}
            {generated.status === 'done' && (
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="h-6 w-6 text-white" />
              </div>
            )}
          </div>
        )}

        {/* AI Generation Status Overlay */}
        {item.aiStatus && item.aiStatus !== 'done' && (
          <div className="absolute inset-0 z-30 bg-black/60 flex flex-col items-center justify-center gap-3">
            {item.aiStatus === 'pending' && (
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gray-500/80 flex items-center justify-center">
                  <span className="text-white text-lg">⏳</span>
                </div>
                <span className="text-white/80 text-xs">Menunggu...</span>
              </div>
            )}
            {item.aiStatus === 'generating' && (
              <>
                <Loader2 className="h-12 w-12 text-white animate-spin" />
                <span className="text-white text-sm font-medium animate-pulse">Generating AI...</span>
              </>
            )}
            {item.aiStatus === 'error' && (
              <>
                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                  <X className="h-6 w-6 text-white" />
                </div>
                <span className="text-white text-sm font-medium">Gagal</span>
                {item.aiError && (
                  <p className="text-xs text-red-300 text-center px-3 max-w-[90%] line-clamp-2">
                    {item.aiError}
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {/* Remove Button */}
        {!isGenerating && (
          <button
            onClick={() => removeItem(item.id)}
            className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-30 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-black/60 text-white flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:bg-red-500"
            title="Hapus"
          >
            <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </button>
        )}

        {/* Action Buttons - Bottom Right */}
        {!isGenerating && (
          <div 
            className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 z-30 flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Typography Picker */}
            <BulkTypographyPicker
              itemId={item.id}
              typography={item.typography}
              defaultTypography={defaultTypography}
              setTypography={(typo) => updateItemTypography(item.id, typo)}
              clearTypography={() => clearItemTypography(item.id)}
            />
            {/* Background Picker */}
            <BulkBackgroundPicker
              itemId={item.id}
              background={item.background || defaultBackground}
              defaultBackground={defaultBackground}
              setBackground={(bg) => updateItemBackground(item.id, bg)}
            />
          </div>
        )}
      </div>

      {/* Filename & Custom Indicators */}
      <div className="mt-2 flex items-center justify-center gap-1.5">
        {item.aiBackground && (
          <div 
            className="w-4 h-4 rounded border border-purple-300 bg-purple-100 flex-shrink-0 shadow-sm flex items-center justify-center text-purple-600"
            title="AI-generated background"
          >
            <span className="text-[8px] font-bold">AI</span>
          </div>
        )}
        {item.typography && Object.keys(item.typography).length > 0 && (
          <div 
            className="w-4 h-4 rounded border border-green-300 bg-green-100 flex-shrink-0 shadow-sm flex items-center justify-center text-green-600"
            title="Custom typography"
          >
            <span className="text-[8px] font-bold">T</span>
          </div>
        )}
        {item.background && !item.aiBackground && (
          <div 
            className="w-4 h-4 rounded border border-gray-300 flex-shrink-0 shadow-sm"
            style={{ background: item.background }}
            title="Custom background"
          />
        )}
        <p className="text-xs text-gray-500 truncate max-w-[150px]">
          {fileName}.png
        </p>
      </div>
    </div>
  );
}

export function BulkPreviewGrid() {
  const { bulkItems, removeItem, updateItemBackground, updateItemTypography, clearItemTypography, generatedImages, isGenerating } = useBulkStore();
  const { 
    backgroundMode, 
    backgroundColor, 
    customGradient,
    fontFamily,
    fontColor,
    fontSize,
    lineHeight,
    textAlign,
    maxWidth,
    padding,
    textureEnabled,
    textureType,
    textureIntensity,
    zoomLevel,
    getFrameDimensions,
  } = useDesignStore();

  const { width, height } = getFrameDimensions();
  const aspectRatio = width / height;
  
  // Get texture URL (same as Canvas component)
  const getTextureUrl = () => {
    switch (textureType) {
      case 'noise':
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="200" height="200" filter="url(%23n)" opacity="0.3"/%3E%3C/svg%3E';
      case 'fine':
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="1" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="50" height="50" filter="url(%23n)" opacity="0.15"/%3E%3C/svg%3E';
      case 'medium':
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23n)" opacity="0.2"/%3E%3C/svg%3E';
      case 'coarse':
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="200" height="200" filter="url(%23n)" opacity="0.25"/%3E%3C/svg%3E';
      case 'paper':
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="turbulence" baseFrequency="0.05" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="300" height="300" filter="url(%23n)" opacity="0.1"/%3E%3C/svg%3E';
      default:
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="200" height="200" filter="url(%23n)" opacity="0.3"/%3E%3C/svg%3E';
    }
  };
  

  // Grid columns based on zoom level
  const getGridCols = () => {
    if (zoomLevel <= 0.5) return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';
    if (zoomLevel <= 0.75) return 'grid-cols-2 sm:grid-cols-3';
    if (zoomLevel <= 1) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    if (zoomLevel <= 1.5) return 'grid-cols-1 sm:grid-cols-2';
    return 'grid-cols-1';
  };

  if (bulkItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-3xl">📝</span>
        </div>
        <p className="text-lg font-medium text-gray-600">No texts added yet</p>
        <p className="text-sm text-gray-400 mt-1">Add texts in the sidebar to preview</p>
      </div>
    );
  }

  const getDefaultBackground = () => {
    if (backgroundMode === 'solid') {
      return backgroundColor || '#6366f1';
    }
    if (customGradient && customGradient.trim() !== '') {
      return customGradient;
    }
    return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  };



  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <h2 className="text-xs sm:text-sm font-semibold text-gray-700">
            Bulk Preview
          </h2>
          <span className="px-1.5 sm:px-2 py-0.5 bg-green-100 text-green-600 rounded-full text-[10px] sm:text-xs font-medium">
            {bulkItems.length} items
          </span>
        </div>
        <p className="hidden sm:block text-xs text-gray-400">Hover untuk ubah background/typography</p>
      </div>

      <div className={`grid ${getGridCols()} gap-3 sm:gap-4 lg:gap-6 max-h-[calc(100vh-200px)] sm:max-h-[calc(100vh-280px)] overflow-y-auto p-1`}>
        {bulkItems.map((item) => (
          <PreviewCard
            key={item.id}
            item={item}
            generated={generatedImages.find((img) => img.text === item.text)}
            isGenerating={isGenerating}
            canvasWidth={width}
            canvasHeight={height}
            itemBackground={item.background || getDefaultBackground()}
            defaultBackground={getDefaultBackground()}
            textureEnabled={textureEnabled}
            textureUrl={getTextureUrl()}
            textureIntensity={textureIntensity}
            padding={padding}
            defaultTypography={{
              fontSize,
              fontFamily,
              fontColor,
              textAlign,
              lineHeight,
              maxWidth,
            }}
            removeItem={removeItem}
            updateItemBackground={updateItemBackground}
            updateItemTypography={updateItemTypography}
            clearItemTypography={clearItemTypography}
          />
        ))}
      </div>
    </div>
  );
}
