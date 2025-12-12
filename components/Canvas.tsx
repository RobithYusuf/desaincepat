"use client";

import React, { useRef, useState, useEffect, memo } from 'react';
import { useDesignStore } from '@/store/design-store';

// Inner canvas component - memoized to prevent unnecessary re-renders
const CanvasInner = memo(function CanvasInner() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  const {
    text,
    fontSize,
    lineHeight,
    maxWidth,
    fontColor,
    fontFamily,
    textAlign,
    padding,
    backgroundMode,
    backgroundColor,
    gradientPreset,
    customGradient,
    textureEnabled,
    textureType,
    textureIntensity,
    frameSize,
    zoomLevel,
    backgroundSizing,
    isAIGenerating,
    getFrameDimensions,
  } = useDesignStore();

  const { width, height } = getFrameDimensions();
  
  // Calculate background value with robust fallback
  const canvasBackground = React.useMemo(() => {
    // Default gradient
    const defaultGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    
    if (backgroundMode === 'solid') {
      return backgroundColor || '#6366f1';
    }
    
    // Check if customGradient has actual value (not empty string)
    if (customGradient && customGradient.trim() !== '') {
      if (customGradient.includes('url')) {
        return 'transparent';
      }
      return customGradient;
    }
    
    // Fallback to default gradient
    return defaultGradient;
  }, [backgroundMode, backgroundColor, customGradient]);
  
  // Update dimensions on mount and window resize
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  // Enhanced responsive scaling with zoom
  const baseScale = dimensions.width > 0
    ? (() => {
        const viewportWidth = dimensions.width;
        const viewportHeight = dimensions.height;
        
        // Get sidebar width consideration
        // Desktop: sidebar is 400px, mobile: full screen
        const availableWidth = viewportWidth >= 1024 
          ? viewportWidth - 450  // Desktop: subtract sidebar (400px) + margin
          : viewportWidth - 40;   // Mobile: just margins
        
        const availableHeight = viewportHeight - 180; // Header + controls + margins
        
        // Calculate scales for width and height
        const widthScale = availableWidth / width;
        const heightScale = availableHeight / height;
        
        // Use the smaller scale to fit both dimensions
        // Desktop: allow up to 0.9 scale for larger display, Mobile: 0.7
        const maxScale = viewportWidth >= 1024 ? 0.9 : (viewportWidth >= 768 ? 0.7 : 0.6);
        
        return Math.min(widthScale, heightScale, maxScale);
      })()
    : 0.5;
  
  // Apply zoom on top of base scale
  const scale = baseScale * zoomLevel;
  
  // Get texture URL based on type - all inline SVG for reliable export
  const getTextureUrl = () => {
    if (!textureEnabled) return null;
    
    switch (textureType) {
      case 'noise':
        // Inline SVG noise - classic noise pattern
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
        // Default inline SVG noise
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="200" height="200" filter="url(%23n)" opacity="0.3"/%3E%3C/svg%3E';
    }
  };

  // Calculate scaled dimensions for proper layout
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Canvas Container with proper scaled dimensions */}
      <div 
        className="relative flex items-center justify-center"
        style={{
          width: `${scaledWidth}px`,
          height: `${scaledHeight}px`,
        }}
      >
        {/* Canvas Preview with border wrapper */}
        <div 
          className="absolute rounded-lg ring-2 ring-gray-300/50 ring-offset-4 ring-offset-gray-100"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center',
          }}
        >
          <div
            ref={canvasRef}
            id="canvas-export"
            className="relative overflow-hidden rounded-lg shadow-2xl"
            style={{
              width: `${width}px`,
              height: `${height}px`,
              background: canvasBackground,
              ...(customGradient?.includes('url') && {
                backgroundImage: customGradient,
                backgroundColor: customGradient?.includes('data:') ? '#1a1a2e' : 'transparent', // Dark bg for AI images with contain
              }),
              backgroundSize: customGradient?.includes('url') ? backgroundSizing : 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Noise Texture Overlay */}
            {getTextureUrl() && (
              <div
                className="absolute inset-0 z-20"
                style={{
                  backgroundImage: `url(${getTextureUrl()})`,
                  backgroundRepeat: 'repeat',
                  backgroundSize: 'auto',
                  opacity: textureIntensity / 100,
                  pointerEvents: 'none',
                }}
              />
            )}

            {/* AI Generating Overlay */}
            {isAIGenerating && (
              <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4">
                  {/* Animated Spinner */}
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full border-4 border-white/20"></div>
                    <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-green-400"></div>
                    <div className="absolute inset-2 h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-emerald-300" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                  </div>
                  {/* Text */}
                  <div className="text-center">
                    <p className="text-lg font-semibold text-white">Generating with AI</p>
                    <p className="mt-1 text-sm text-white/70">Creating your thumbnail...</p>
                  </div>
                  {/* Progress dots */}
                  <div className="flex gap-1.5">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-green-400" style={{ animationDelay: '0ms' }}></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-green-400" style={{ animationDelay: '150ms' }}></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-green-400" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div
              className="relative z-50 flex h-full items-center justify-center"
              style={{
                padding: `${padding}px`,
              }}
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
                {text || (customGradient?.includes('data:') ? '' : 'Enter your text...')}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Dimensions Info */}
      <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm">
        <span>{width} × {height}px</span>
        <span className="text-gray-400">•</span>
        <span className="capitalize">{frameSize}</span>
      </div>
    </div>
  );
});

// Export wrapper - prevents parent re-renders from affecting canvas
export function Canvas() {
  return <CanvasInner />;
}
