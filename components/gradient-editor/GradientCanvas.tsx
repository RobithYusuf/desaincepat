'use client';

import { useRef, useEffect } from 'react';
import { useGradientStore } from '@/store/gradient-store';
import { renderToCanvas } from '@/lib/canvas-renderer';

export function GradientCanvas() {
  const { canvas, shapes, palette, filters, adjustVertices } = useGradientStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Render is now async (SVG approach)
    renderToCanvas(canvasRef.current, {
      canvas,
      shapes,
      palette,
      filters,
      includeVertices: adjustVertices,
    }).catch((error) => {
      console.error('Failed to render gradient:', error);
    });
  }, [canvas, shapes, palette, filters, adjustVertices]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gray-100 overflow-auto p-4 sm:p-6 gap-8">
      <div 
        className="relative shadow-xl rounded-lg"
        style={{
          width: '100%',
          maxWidth: `min(calc(100vw - 350px), calc(100vh - 200px) * ${canvas.width / canvas.height})`,
          aspectRatio: `${canvas.width}/${canvas.height}`,
          overflow: 'clip',
        }}
      >
        <canvas
          ref={canvasRef}
          width={canvas.width}
          height={canvas.height}
          className="w-full h-full"
          style={{ display: 'block' }}
        />
      </div>
      
      {/* Canvas Size Info */}
      <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-600 shadow-md border border-gray-200">
        <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
        <span className="font-semibold">{canvas.width} × {canvas.height}px</span>
        <span className="text-gray-300">•</span>
        <span className="text-gray-500 capitalize">
          {canvas.width === canvas.height ? 'Square' : 
           canvas.width > canvas.height ? 'Landscape' : 'Portrait'}
        </span>
      </div>
    </div>
  );
}
