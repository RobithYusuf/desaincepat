'use client';

import { useRef, useState, useEffect, useCallback, MouseEvent } from 'react';
import { useGradientStore } from '@/store/gradient-store';
import { renderToCanvas } from '@/lib/canvas-renderer';

export function InteractiveGradientCanvas() {
  const { canvas, shapes, palette, filters, adjustColorPosition, adjustVertices, updateShapeCenter, updateShapeVertex } = useGradientStore();
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [draggingShapeId, setDraggingShapeId] = useState<string | null>(null);
  const [draggingVertex, setDraggingVertex] = useState<{ shapeId: string; vertexIndex: number } | null>(null);
  const [canvasRect, setCanvasRect] = useState<DOMRect | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Render canvas with full quality (including grain)
  useEffect(() => {
    if (!canvasRef.current) return;
    
    renderToCanvas(canvasRef.current, {
      canvas,
      shapes,
      palette,
      filters,
      includeVertices: false,
      includeCenterPoints: false,
    });
  }, [canvas, shapes, palette, filters]);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update canvas dimensions whenever canvas changes or adjust is toggled
  useEffect(() => {
    const updateRect = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setCanvasRect(rect);
      }
    };
    
    // Update immediately
    updateRect();
    
    // Also update on next frame (after render)
    requestAnimationFrame(updateRect);
    
    const handleResize = () => {
      updateRect();
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [adjustColorPosition]);
  
  // Handle mouse down on center points
  const handleCenterPointMouseDown = (shapeId: string) => (e: React.MouseEvent) => {
    if (!adjustColorPosition) return;
    
    e.preventDefault();
    e.stopPropagation();
    setDraggingShapeId(shapeId);
    setIsDragging(true);
  };

  // Handle mouse down on vertices
  const handleVertexMouseDown = (shapeId: string, vertexIndex: number) => (e: React.MouseEvent) => {
    if (!adjustVertices) return;
    
    e.preventDefault();
    e.stopPropagation();
    setDraggingVertex({ shapeId, vertexIndex });
    setIsDragging(true);
  };

  // Convert screen coordinates to canvas coordinates
  const screenToCanvas = useCallback((screenX: number, screenY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const canvasElement = canvasRef.current;
    const rect = canvasElement.getBoundingClientRect();
    
    // Calculate scale from actual canvas display size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (screenX - rect.left) * scaleX,
      y: (screenY - rect.top) * scaleY,
    };
  }, [canvas.width, canvas.height]);



  // Throttle mouse move for better performance
  const lastMouseMoveRef = useRef<number>(0);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!canvasRef.current) return;
    
    // Throttle to ~60fps max
    const now = performance.now();
    if (now - lastMouseMoveRef.current < 16) return; // Skip if < 16ms since last update
    lastMouseMoveRef.current = now;
    
    // Handle center point dragging
    if (draggingShapeId && adjustColorPosition) {
      const newCenter = screenToCanvas(e.clientX, e.clientY);
      updateShapeCenter(draggingShapeId, newCenter);
    }
    
    // Handle vertex dragging
    if (draggingVertex && adjustVertices) {
      const newPosition = screenToCanvas(e.clientX, e.clientY);
      updateShapeVertex(draggingVertex.shapeId, draggingVertex.vertexIndex, newPosition);
    }
  }, [draggingShapeId, draggingVertex, adjustColorPosition, adjustVertices, updateShapeCenter, updateShapeVertex, screenToCanvas]);

  const handleMouseUp = useCallback(() => {
    setDraggingShapeId(null);
    setDraggingVertex(null);
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (draggingShapeId || draggingVertex) {
      document.addEventListener('mousemove', handleMouseMove as any);
      document.addEventListener('mouseup', handleMouseUp as any);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove as any);
        document.removeEventListener('mouseup', handleMouseUp as any);
      };
    }
  }, [draggingShapeId, draggingVertex, handleMouseMove, handleMouseUp]);

  return (
    <div 
      ref={canvasContainerRef}
      className="relative w-full h-full flex flex-col items-center justify-center bg-gray-100 p-2 sm:p-4 md:p-6 overflow-hidden"
    >
      {/* Canvas Gradient with original SVG grain */}
      <canvas
        ref={canvasRef}
        width={canvas.width}
        height={canvas.height}
        className="rounded-lg sm:rounded-xl shadow-xl sm:shadow-2xl border-2 sm:border-4 border-white flex-shrink"
        style={{
          maxWidth: isMobile 
            ? 'calc(100vw - 32px)'
            : 'calc(100vw - 400px)',
          maxHeight: isMobile
            ? 'calc(100vh - 260px)'
            : 'calc(100vh - 240px)',
          width: 'auto',
          height: 'auto',
          aspectRatio: `${canvas.width} / ${canvas.height}`,
          objectFit: 'contain',
        }}
      />
      
      {/* Vertices Overlay - Show shape outline and vertex points */}
      {adjustVertices && canvasRect && (
        <div className="absolute inset-0 pointer-events-none">
          {shapes.map((shape) => {
            const canvasElement = canvasRef.current;
            if (!canvasElement) return null;
            
            const canvasElRect = canvasElement.getBoundingClientRect();
            const canvasContainerRect = canvasContainerRef.current?.getBoundingClientRect();
            if (!canvasContainerRect) return null;
            
            const scaleX = canvasElRect.width / canvas.width;
            const scaleY = canvasElRect.height / canvas.height;
            
            const color = palette[shape.fillIndex]?.color || '#000000';
            
            return (
              <svg
                key={`shape-outline-${shape.id}`}
                className="absolute pointer-events-none"
                style={{
                  left: canvasElRect.left - canvasContainerRect.left,
                  top: canvasElRect.top - canvasContainerRect.top,
                  width: canvasElRect.width,
                  height: canvasElRect.height,
                }}
              >
                {/* Shape outline */}
                <polygon
                  points={shape.points.map(p => `${p.x * scaleX},${p.y * scaleY}`).join(' ')}
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  strokeOpacity="0.5"
                  strokeDasharray="5 5"
                />
                
                {/* Vertex points */}
                {shape.points.map((point, idx) => {
                  const screenX = point.x * scaleX;
                  const screenY = point.y * scaleY;
                  const isActiveDrag = draggingVertex?.shapeId === shape.id && draggingVertex?.vertexIndex === idx;
                  
                  return (
                    <g key={`vertex-${shape.id}-${idx}`}>
                      {/* Vertex circle */}
                      <circle
                        cx={screenX}
                        cy={screenY}
                        r="5"
                        fill="white"
                        stroke={color}
                        strokeWidth="2"
                        opacity={isActiveDrag ? 0.8 : 1}
                        className="pointer-events-auto cursor-move"
                        style={{ 
                          pointerEvents: 'auto',
                          transition: isActiveDrag ? 'none' : 'opacity 0.15s'
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleVertexMouseDown(shape.id, idx)(e as any);
                        }}
                      />
                    </g>
                  );
                })}
              </svg>
            );
          })}
        </div>
      )}
      
      {/* Center Points Overlay - Outside canvas container so they stay visible even if shape is outside canvas */}
      {adjustColorPosition && canvasRect && shapes.map((shape, index) => {
          // Use stored center point directly (already calculated as centroid in mesh-generator)
          const center = shape.center;
          
          // Get actual canvas element to calculate proper scale
          const canvasElement = canvasRef.current;
          if (!canvasElement) return null;
          
          const canvasElRect = canvasElement.getBoundingClientRect();
          const canvasContainerRect = canvasContainerRef.current?.getBoundingClientRect();
          if (!canvasContainerRect) return null;
          
          // Calculate scale: Canvas logical size to actual rendered size
          const scaleX = canvasElRect.width / canvas.width;
          const scaleY = canvasElRect.height / canvas.height;
          
          // Convert canvas coordinates to absolute pixel position
          // Position relative to canvasContainerRef container
          const absoluteX = canvasElRect.left - canvasContainerRect.left + (center.x * scaleX);
          const absoluteY = canvasElRect.top - canvasContainerRect.top + (center.y * scaleY);
          
          const color = palette[shape.fillIndex]?.color || '#000000';
          
          return (
            <div
              key={shape.id}
              onMouseDown={handleCenterPointMouseDown(shape.id)}
              className={`absolute rounded-full cursor-move transition-transform ${
                draggingShapeId === shape.id ? 'scale-125' : 'hover:scale-110'
              }`}
              style={{
                left: `${absoluteX}px`,
                top: `${absoluteY}px`,
                transform: 'translate(-50%, -50%)',
                width: '20px',
                height: '20px',
                backgroundColor: color,
                border: '3px solid white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                zIndex: draggingShapeId === shape.id ? 1000 : 10,
                pointerEvents: 'auto',
              }}
            />
          );
        })}
      
      {/* Canvas Size Info - Fixed at bottom */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 rounded-lg bg-white px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-600 shadow-md border border-gray-200">
        <svg className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
        <span className="font-semibold">{canvas.width} × {canvas.height}px</span>
        <span className="text-gray-300 hidden sm:inline">•</span>
        <span className="text-gray-500 capitalize hidden sm:inline">
          {canvas.width === canvas.height ? 'Square' : 
           canvas.width > canvas.height ? 'Landscape' : 'Portrait'}
        </span>
      </div>
    </div>
  );
}
