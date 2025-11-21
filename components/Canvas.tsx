"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useDesignStore } from '@/store/design-store';

export function Canvas() {
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
  
  // Get texture URL based on type
  const getTextureUrl = () => {
    if (!textureEnabled) return null;
    
    switch (textureType) {
      case 'noise':
        // Use LazyLayers noise texture
        return 'https://lazylayers.ahmadrosid.com/images/noise-light.png';
      case 'fine':
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="1"/%3E%3C/filter%3E%3Crect width="50" height="50" filter="url(%23n)" opacity="0.15"/%3E%3C/svg%3E';
      case 'medium':
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2"/%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23n)" opacity="0.2"/%3E%3C/svg%3E';
      case 'coarse':
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3"/%3E%3C/filter%3E%3Crect width="200" height="200" filter="url(%23n)" opacity="0.25"/%3E%3C/svg%3E';
      case 'paper':
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="turbulence" baseFrequency="0.05" numOctaves="4"/%3E%3C/filter%3E%3Crect width="300" height="300" filter="url(%23n)" opacity="0.1"/%3E%3C/svg%3E';
      default:
        return 'https://lazylayers.ahmadrosid.com/images/noise-light.png';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Canvas Container */}
      <div className="relative flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          {/* Canvas Preview - NO WHITE BORDER */}
          <div
            ref={canvasRef}
            id="canvas-export"
            className="relative overflow-hidden rounded-lg shadow-2xl transition-transform duration-200"
            style={{
              width: `${width}px`,
              height: `${height}px`,
              background: canvasBackground,
              ...(customGradient?.includes('url') && {
                backgroundImage: customGradient,
                backgroundColor: 'transparent',
              }),
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              transform: `scale(${scale})`,
              transformOrigin: 'center',
            }}
          >
            {/* Noise Texture Overlay - Same as LazyLayers */}
            {getTextureUrl() && (
              <div
                className="absolute rounded-lg z-20 shadow-lg"
                style={{
                  inset: '0px',
                  backgroundImage: `url(${getTextureUrl()})`,
                  backgroundRepeat: 'repeat',
                  backgroundSize: 'auto',
                  opacity: textureIntensity / 100,
                  pointerEvents: 'none',
                }}
              />
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
                {text || 'Enter your text...'}
              </h1>
            </div>
          </div>

          {/* Dimensions Info */}
          <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm">
            <span>{width} × {height}px</span>
            <span className="text-gray-400">•</span>
            <span className="capitalize">{frameSize}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
