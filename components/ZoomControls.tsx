"use client";

import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useDesignStore } from '@/store/design-store';

interface ZoomControlsProps {
  minimal?: boolean;
}

export function ZoomControls({ minimal = false }: ZoomControlsProps) {
  const { zoomLevel, zoomIn, zoomOut, resetZoom } = useDesignStore();

  const zoomPercentage = Math.round(zoomLevel * 100);
  const canZoomIn = zoomLevel < 2;
  const canZoomOut = zoomLevel > 0.25;

  const wrapperClass = minimal
    ? "relative z-30 flex items-center gap-1"
    : "relative z-30 flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg";

  return (
    <div className={wrapperClass}>
      {/* Zoom Out */}
      <button
        onClick={zoomOut}
        disabled={!canZoomOut}
        className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded text-gray-600 transition-colors hover:bg-gray-100 active:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        title="Zoom out (25%)"
        aria-label="Zoom out"
      >
        <ZoomOut className="h-4 w-4 pointer-events-none" />
      </button>

      {/* Zoom Level Display */}
      <button
        onClick={resetZoom}
        className="min-w-[64px] rounded px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-100 active:bg-gray-200"
        title="Reset zoom to 100%"
        aria-label="Reset zoom"
      >
        {zoomPercentage}%
      </button>

      {/* Zoom In */}
      <button
        onClick={zoomIn}
        disabled={!canZoomIn}
        className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded text-gray-600 transition-colors hover:bg-gray-100 active:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        title="Zoom in (200%)"
        aria-label="Zoom in"
      >
        <ZoomIn className="h-4 w-4 pointer-events-none" />
      </button>

      {/* Divider */}
      <div className="mx-0.5 h-6 w-px bg-gray-300" />

      {/* Fit to Screen */}
      <button
        onClick={resetZoom}
        className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded text-gray-600 transition-colors hover:bg-gray-100 active:bg-gray-200"
        title="Fit to screen"
        aria-label="Fit to screen"
      >
        <Maximize2 className="h-4 w-4 pointer-events-none" />
      </button>
    </div>
  );
}
