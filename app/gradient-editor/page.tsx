'use client';

import { useEffect, useState } from 'react';
import { useGradientStore } from '@/store/gradient-store';
import { InteractiveGradientCanvas } from '@/components/gradient-editor/InteractiveGradientCanvas';
import { ControlsSidebar } from '@/components/gradient-editor/ControlsSidebar';
import { Button } from '@/components/ui/button';
import { Download, Shuffle, Sparkles, Undo, Redo } from 'lucide-react';
import { generateMeshGradient, randomizeShapes, GRADIENT_PRESETS } from '@/lib/mesh-generator';
import { renderToCanvas, exportCanvasAsPNG, exportCanvasAsWebP, exportCanvasAsSVG } from '@/lib/canvas-renderer';
import { Navbar } from '@/components/Navbar';

export default function GradientEditorPage() {
  const {
    canvas,
    palette,
    shapes,
    filters,
    exportWidth,
    exportHeight,
    setShapes,
    shuffle,
    undo,
    redo,
    saveHistory,
  } = useGradientStore();
  
  const canUndo = useGradientStore((state) => state.canUndo());
  const canRedo = useGradientStore((state) => state.canRedo());

  const [isExporting, setIsExporting] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Initialize with first preset on mount
  useEffect(() => {
    if (shapes.length === 0) {
      const { filters } = useGradientStore.getState();
      const initialShapes = generateMeshGradient({
        width: canvas.width,
        height: canvas.height,
        numColors: palette.length,
        spread: filters.spread,
      });
      setShapes(initialShapes);
      console.log('🎨 Initial gradient generated with', palette.length, 'colors');
      
      // Save initial state to history
      setTimeout(() => saveHistory(), 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Regenerate shapes when palette length changes (colors added/removed)
  useEffect(() => {
    if (shapes.length > 0 && palette.length > 0) {
      const { filters } = useGradientStore.getState();
      const newShapes = generateMeshGradient({
        width: canvas.width,
        height: canvas.height,
        numColors: palette.length,
        spread: filters.spread,
      });
      setShapes(newShapes);
      console.log('🔄 Shapes regenerated for', palette.length, 'colors');
      setTimeout(() => saveHistory(), 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [palette.length]);
  
  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        redo();
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const handleRandomize = () => {
    const { filters } = useGradientStore.getState();
    const newShapes = generateMeshGradient({
      width: canvas.width,
      height: canvas.height,
      numColors: palette.length,
      spread: filters.spread,
    });
    setShapes(newShapes);
    console.log('🔄 Randomized gradient with', palette.length, 'colors');
    setTimeout(() => saveHistory(), 0);
  };

  const handleShuffle = () => {
    shuffle();
    setTimeout(() => saveHistory(), 0);
  };

  const handleExport = async (format: 'png' | 'webp' | 'svg' = 'png') => {
    setIsExporting(true);
    try {
      // Create offscreen canvas at export resolution
      const exportCanvas = document.createElement('canvas');
      
      // Render gradient at export size
      renderToCanvas(exportCanvas, {
        canvas: {
          width: exportWidth,
          height: exportHeight,
          background: canvas.background,
        },
        shapes: shapes.map(shape => ({
          ...shape,
          // Scale shape points to export size
          points: shape.points.map(p => ({
            x: (p.x / canvas.width) * exportWidth,
            y: (p.y / canvas.height) * exportHeight,
          })),
          center: {
            x: (shape.center.x / canvas.width) * exportWidth,
            y: (shape.center.y / canvas.height) * exportHeight,
          },
        })),
        palette,
        filters,
      });

      if (format === 'svg') {
        exportCanvasAsSVG({
          canvas: {
            width: exportWidth,
            height: exportHeight,
            background: canvas.background,
          },
          shapes: shapes.map(shape => ({
            ...shape,
            points: shape.points.map(p => ({
              x: (p.x / canvas.width) * exportWidth,
              y: (p.y / canvas.height) * exportHeight,
            })),
            center: {
              x: (shape.center.x / canvas.width) * exportWidth,
              y: (shape.center.y / canvas.height) * exportHeight,
            },
          })),
          palette,
          filters,
        }, 'gradient.svg');
      } else if (format === 'png') {
        exportCanvasAsPNG(exportCanvas, 'gradient.png');
      } else if (format === 'webp') {
        exportCanvasAsWebP(exportCanvas, 'gradient.webp', 0.95);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar */}
        <div className="hidden sm:block">
          <ControlsSidebar />
        </div>
        
        {/* Mobile Sidebar Overlay */}
        {showMobileSidebar && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-40 sm:hidden"
              onClick={() => setShowMobileSidebar(false)}
            />
            <div className="fixed left-0 top-0 bottom-0 w-full max-w-sm bg-white z-50 sm:hidden overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                <h2 className="font-bold text-lg text-gray-900">Gradient Controls</h2>
                <button
                  onClick={() => setShowMobileSidebar(false)}
                  className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                >
                  <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Mobile Action Buttons */}
              <div className="flex gap-2 p-4 border-b border-gray-200 bg-gray-50">
                <Button
                  onClick={() => {
                    handleRandomize();
                    setShowMobileSidebar(false);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Sparkles className="h-4 w-4" />
                  Randomize
                </Button>
                <Button
                  onClick={() => {
                    handleShuffle();
                    setShowMobileSidebar(false);
                  }}
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Shuffle className="h-4 w-4" />
                  Shuffle
                </Button>
              </div>
              
              <ControlsSidebar />
            </div>
          </>
        )}
        
        <div className="flex flex-1 flex-col relative overflow-hidden">
          {/* Top toolbar with undo/redo, randomize/shuffle, and export */}
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-20 flex items-center justify-between pointer-events-none">
            {/* Left: Undo/Redo */}
            <div className="flex items-center gap-1 sm:gap-2 pointer-events-auto">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileSidebar(true)}
                className="sm:hidden flex items-center justify-center h-8 w-8 bg-white rounded-lg shadow-md hover:bg-gray-50"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Button
                variant="outline"
                size="icon"
                disabled={!canUndo}
                onClick={undo}
                className="h-7 w-7 sm:h-8 sm:w-8 bg-white"
                title="Undo (Ctrl+Z)"
              >
                <Undo className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                disabled={!canRedo}
                onClick={redo}
                className="h-7 w-7 sm:h-8 sm:w-8 bg-white"
                title="Redo (Ctrl+Shift+Z)"
              >
                <Redo className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </div>

            {/* Center: Randomize/Shuffle buttons */}
            <div className="hidden sm:flex items-center gap-2 pointer-events-auto">
              <Button
                onClick={handleRandomize}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-2 sm:px-4"
              >
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Randomize</span>
              </Button>

              <Button
                onClick={handleShuffle}
                variant="outline"
                className="flex items-center gap-2 bg-white text-xs sm:text-sm px-2 sm:px-4"
              >
                <Shuffle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Shuffle</span>
              </Button>
            </div>

            {/* Right: Export */}
            <div className="flex items-center gap-1 sm:gap-2 pointer-events-auto">
              <div className="relative group">
                <Button
                  onClick={() => handleExport('png')}
                  disabled={isExporting}
                  className="flex items-center gap-1 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-2 sm:px-4 h-7 sm:h-auto"
                >
                  <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Export'}</span>
                </Button>

                {/* Export format dropdown */}
                <div className="absolute top-full right-0 mt-2 hidden w-32 rounded-lg border border-gray-200 bg-white py-1 shadow-lg group-hover:block">
                  <button
                    onClick={() => handleExport('png')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  >
                    Export PNG
                  </button>
                  <button
                    onClick={() => handleExport('webp')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  >
                    Export WebP
                  </button>
                  <button
                    onClick={() => handleExport('svg')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  >
                    Export SVG
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <InteractiveGradientCanvas />
          </div>
        </div>
      </div>
    </div>
  );
}
