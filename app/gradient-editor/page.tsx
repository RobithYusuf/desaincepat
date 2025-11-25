'use client';

import { useEffect, useState, useRef } from 'react';
import { useGradientStore } from '@/store/gradient-store';
import { InteractiveGradientCanvas } from '@/components/gradient-editor/InteractiveGradientCanvas';
import { ControlsSidebar } from '@/components/gradient-editor/ControlsSidebar';
import { Button } from '@/components/ui/button';
import { Download, Shuffle, Sparkles, Undo, Redo, Image, FileCode, Link, Check, Save, FolderOpen, Trash2 } from 'lucide-react';
import { generateMeshGradient, randomizeShapes, GRADIENT_PRESETS } from '@/lib/mesh-generator';
import { renderForExport, exportCanvasAsPNG, exportCanvasAsWebP, exportCanvasAsSVG } from '@/lib/canvas-renderer';
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
    loadSharedState,
  } = useGradientStore();
  
  const canUndo = useGradientStore((state) => state.canUndo());
  const canRedo = useGradientStore((state) => state.canRedo());

  const [isExporting, setIsExporting] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savedGradients, setSavedGradients] = useState<Array<{id: string, name: string, timestamp: number, preview?: string}>>([]);
  const [saveName, setSaveName] = useState('');
  const [copiedCSS, setCopiedCSS] = useState(false);
  const [copiedURL, setCopiedURL] = useState(false);
  const exportModalRef = useRef<HTMLDivElement>(null);
  const saveModalRef = useRef<HTMLDivElement>(null);
  const loadedFromURLRef = useRef(false);
  const initializedRef = useRef(false);

  // Storage key and limit for saved gradients
  const STORAGE_KEY = 'desaincepat-saved-gradients';
  const MAX_SAVED_GRADIENTS = 20;

  // Load shared state from URL or initialize with default
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    
    // Check for shared state in URL
    const urlParams = new URLSearchParams(window.location.search);
    const stateParam = urlParams.get('state');
    
    if (stateParam) {
      try {
        const sharedState = JSON.parse(atob(stateParam));
        console.log('🔗 Loading shared state from URL', sharedState);
        loadedFromURLRef.current = true; // Flag to prevent regeneration
        loadSharedState(sharedState);
        
        // Clear URL parameter after loading
        window.history.replaceState({}, '', window.location.pathname);
        return;
      } catch (error) {
        console.error('Failed to load shared state:', error);
      }
    }
    
    // Default initialization if no shared state
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
    saveHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track previous palette length to detect actual user changes (not initial load)
  const prevPaletteLengthRef = useRef<number | null>(null);
  
  // Regenerate shapes when palette length changes (colors added/removed by user)
  useEffect(() => {
    // Skip if loaded from URL - shapes already set
    if (loadedFromURLRef.current) {
      loadedFromURLRef.current = false;
      prevPaletteLengthRef.current = palette.length;
      console.log('⏭️ Skipping regeneration - loaded from URL');
      return;
    }
    
    // Skip first render (initialization handles this)
    if (prevPaletteLengthRef.current === null) {
      prevPaletteLengthRef.current = palette.length;
      return;
    }
    
    // Only regenerate if palette length actually changed by user action
    if (prevPaletteLengthRef.current === palette.length) {
      return;
    }
    
    console.log(`🔄 Palette changed: ${prevPaletteLengthRef.current} → ${palette.length}`);
    prevPaletteLengthRef.current = palette.length;
    
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
      saveHistory();
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

  // Close export modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportModalRef.current && !exportModalRef.current.contains(e.target as Node)) {
        setShowExportModal(false);
      }
    };

    if (showExportModal) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showExportModal]);

  // Close save modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (saveModalRef.current && !saveModalRef.current.contains(e.target as Node)) {
        setShowSaveModal(false);
      }
    };

    if (showSaveModal) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSaveModal]);

  // Load saved gradients from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSavedGradients(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved gradients:', e);
      }
    }
  }, []);

  // Generate thumbnail from current gradient
  const generateThumbnail = async (): Promise<string> => {
    const { buildSVG } = await import('@/lib/svg-builder');
    
    // Create thumbnail at reasonable size for preview
    const thumbSize = 120;
    const aspectRatio = canvas.width / canvas.height;
    const thumbWidth = aspectRatio >= 1 ? thumbSize : Math.round(thumbSize * aspectRatio);
    const thumbHeight = aspectRatio >= 1 ? Math.round(thumbSize / aspectRatio) : thumbSize;
    
    // Scale shapes to thumbnail size
    const scale = thumbWidth / canvas.width;
    const scaledShapes = shapes.map(shape => ({
      ...shape,
      points: shape.points.map(p => ({
        x: p.x * scale,
        y: p.y * scale,
      })),
      center: {
        x: shape.center.x * scale,
        y: shape.center.y * scale,
      },
    }));
    
    // Scale blur proportionally (blur is relative to canvas size)
    const scaledBlur = Math.max(5, filters.blur * scale);
    
    // Build SVG for thumbnail (skip grain, reduced blur)
    const svg = buildSVG({
      canvas: { ...canvas, width: thumbWidth, height: thumbHeight },
      shapes: scaledShapes,
      palette,
      filters: { ...filters, grainEnabled: false, blur: scaledBlur },
      includeCenterPoints: false,
      includeVertices: false,
    });
    
    // Convert to data URL using proper encoding
    const encoded = encodeURIComponent(svg)
      .replace(/'/g, '%27')
      .replace(/"/g, '%22');
    
    return `data:image/svg+xml,${encoded}`;
  };

  // Save gradient to localStorage
  const handleSaveGradient = async () => {
    if (!saveName.trim()) return;
    
    // Check limit
    if (savedGradients.length >= MAX_SAVED_GRADIENTS) {
      alert(`Maximum ${MAX_SAVED_GRADIENTS} gradients can be saved. Please delete some to save new ones.`);
      return;
    }
    
    // Generate thumbnail
    const thumbnail = await generateThumbnail();
    
    const gradientData = {
      palette: palette.map(c => ({ id: c.id, color: c.color })),
      shapes: shapes.map(s => ({
        id: s.id,
        points: s.points,
        center: s.center,
        fillIndex: s.fillIndex,
        opacity: s.opacity,
        blur: s.blur,
        rotation: s.rotation,
      })),
      filters: {
        blur: filters.blur,
        grain: filters.grain,
        grainEnabled: filters.grainEnabled,
        opacity: filters.opacity,
        spread: filters.spread,
      },
      canvas: {
        width: canvas.width,
        height: canvas.height,
        background: canvas.background,
      },
    };

    const newSave = {
      id: crypto.randomUUID(),
      name: saveName.trim(),
      timestamp: Date.now(),
      thumbnail,
      data: gradientData,
    };

    const updated = [newSave, ...savedGradients];
    setSavedGradients(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSaveName('');
    setShowSaveModal(false);
  };

  // Load gradient from saved
  const handleLoadGradient = (id: string) => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    
    const gradients = JSON.parse(saved);
    const gradient = gradients.find((g: { id: string }) => g.id === id);
    if (gradient?.data) {
      loadedFromURLRef.current = true;
      loadSharedState(gradient.data);
      setShowSaveModal(false);
    }
  };

  // Delete saved gradient
  const handleDeleteGradient = (id: string) => {
    const updated = savedGradients.filter(g => g.id !== id);
    setSavedGradients(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

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
    saveHistory();
  };

  const handleShuffle = () => {
    shuffle();
  };

  const handleExport = async (format: 'png' | 'webp' | 'svg' = 'png') => {
    setIsExporting(true);
    try {
      // Scale shapes to export size
      const scaledShapes = shapes.map(shape => ({
        ...shape,
        points: shape.points.map(p => ({
          x: (p.x / canvas.width) * exportWidth,
          y: (p.y / canvas.height) * exportHeight,
        })),
        center: {
          x: (shape.center.x / canvas.width) * exportWidth,
          y: (shape.center.y / canvas.height) * exportHeight,
        },
      }));

      const exportOptions = {
        canvas: {
          width: exportWidth,
          height: exportHeight,
          background: canvas.background,
        },
        shapes: scaledShapes,
        palette,
        filters,
      };

      if (format === 'svg') {
        // Export full SVG with all filters
        exportCanvasAsSVG(exportOptions, 'gradient.svg');
      } else {
        // Create offscreen canvas at export resolution
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = exportWidth;
        exportCanvas.height = exportHeight;
        
        // Wait for render to complete (force full render, skip cache)
        await renderForExport(exportCanvas, exportOptions);

        if (format === 'png') {
          exportCanvasAsPNG(exportCanvas, 'gradient.png');
        } else if (format === 'webp') {
          exportCanvasAsWebP(exportCanvas, 'gradient.webp', 0.95);
        }
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Generate CSS with SVG data URL (includes all filters)
  const generateCSS = () => {
    // Import buildSVG to generate full SVG with filters
    const { buildSVG } = require('@/lib/svg-builder');
    
    const svg = buildSVG({
      canvas,
      shapes,
      palette,
      filters,
      includeCenterPoints: false,
      includeVertices: false,
    });
    
    // Encode SVG for CSS url()
    const encodedSvg = encodeURIComponent(svg)
      .replace(/'/g, '%27')
      .replace(/"/g, '%22');
    
    return `background-image: url("data:image/svg+xml;utf8,${encodedSvg}");\nbackground-size: 100% 100%;`;
  };

  const handleCopyCSS = async () => {
    const css = generateCSS();
    try {
      await navigator.clipboard.writeText(css);
      setCopiedCSS(true);
      setTimeout(() => setCopiedCSS(false), 2000);
    } catch (error) {
      console.error('Failed to copy CSS:', error);
    }
  };

  const handleShareURL = async () => {
    // Create shareable URL with FULL state (including shapes)
    const stateData = {
      palette: palette.map(c => ({ id: c.id, color: c.color })),
      shapes: shapes.map(s => ({
        id: s.id,
        points: s.points,
        center: s.center,
        fillIndex: s.fillIndex,
        opacity: s.opacity,
        blur: s.blur,
        rotation: s.rotation,
      })),
      filters: {
        blur: filters.blur,
        grain: filters.grain,
        grainEnabled: filters.grainEnabled,
        opacity: filters.opacity,
        spread: filters.spread,
      },
      canvas: {
        width: canvas.width,
        height: canvas.height,
        background: canvas.background,
      },
    };
    const encoded = btoa(JSON.stringify(stateData));
    const shareUrl = `${window.location.origin}/gradient-editor?state=${encoded}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedURL(true);
      setTimeout(() => setCopiedURL(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
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

            {/* Right: My Gradients & Export */}
            <div className="flex items-center gap-1 sm:gap-2 pointer-events-auto">
              {/* My Gradients Button */}
              <div className="relative" ref={saveModalRef}>
                <Button
                  onClick={() => setShowSaveModal(!showSaveModal)}
                  variant="outline"
                  className="flex items-center gap-1 sm:gap-2 bg-white text-xs sm:text-sm px-3 sm:px-4 h-7 sm:h-auto"
                >
                  <FolderOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">My Gradients</span>
                  {savedGradients.length > 0 && (
                    <span className="hidden sm:inline-flex items-center justify-center w-5 h-5 text-[10px] font-medium bg-blue-100 text-blue-600 rounded-full">
                      {savedGradients.length}
                    </span>
                  )}
                </Button>

                {/* My Gradients Modal */}
                {showSaveModal && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                      <h2 className="text-sm font-semibold text-gray-900">My Gradients</h2>
                      <p className="text-xs text-gray-500">Save and load your gradients</p>
                    </div>

                    <div className="p-3 space-y-3">
                      {/* Save Current Gradient */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Save className="h-4 w-4 text-blue-600" />
                          <h3 className="text-xs font-semibold text-gray-700">Save Current</h3>
                        </div>
                        {savedGradients.length >= MAX_SAVED_GRADIENTS ? (
                          <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                            Storage full. Delete some gradients to save new ones.
                          </p>
                        ) : (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={saveName}
                              onChange={(e) => setSaveName(e.target.value)}
                              placeholder="Enter gradient name..."
                              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              onKeyDown={(e) => e.key === 'Enter' && handleSaveGradient()}
                            />
                            <Button
                              onClick={handleSaveGradient}
                              disabled={!saveName.trim()}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                            >
                              Save
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Saved Gradients List */}
                      <div className="space-y-2 pt-3 border-t">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FolderOpen className="h-4 w-4 text-purple-600" />
                            <h3 className="text-xs font-semibold text-gray-700">Saved Gradients</h3>
                          </div>
                          <span className={`text-xs ${savedGradients.length >= MAX_SAVED_GRADIENTS ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                            {savedGradients.length}/{MAX_SAVED_GRADIENTS}
                          </span>
                        </div>
                        
                        {savedGradients.length === 0 ? (
                          <div className="text-center py-6">
                            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center">
                              <FolderOpen className="h-6 w-6 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-500">No saved gradients</p>
                            <p className="text-xs text-gray-400">Save your first gradient above</p>
                          </div>
                        ) : (
                          <div className="max-h-52 overflow-y-auto space-y-1">
                            {savedGradients.map((g: { id: string; name: string; timestamp: number; thumbnail?: string }) => (
                              <div
                                key={g.id}
                                className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-gray-50 group border border-transparent hover:border-gray-200 transition-all"
                              >
                                <button
                                  onClick={() => handleLoadGradient(g.id)}
                                  className="flex-1 flex items-center gap-3 text-left"
                                >
                                  {g.thumbnail ? (
                                    <img 
                                      src={g.thumbnail} 
                                      alt={g.name}
                                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-200"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex-shrink-0" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-gray-900 truncate">{g.name}</div>
                                    <div className="text-xs text-gray-500">
                                      {new Date(g.timestamp).toLocaleDateString('id-ID', { 
                                        day: 'numeric', 
                                        month: 'short',
                                        year: 'numeric'
                                      })}
                                    </div>
                                  </div>
                                </button>
                                <button
                                  onClick={() => handleDeleteGradient(g.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                  title="Delete gradient"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Export Button */}
              <div className="relative" ref={exportModalRef}>
                <Button
                  onClick={() => setShowExportModal(!showExportModal)}
                  disabled={isExporting}
                  className="flex items-center gap-1 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-3 sm:px-4 h-7 sm:h-auto"
                >
                  <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>{isExporting ? 'Exporting...' : 'Export'}</span>
                </Button>

              {/* Export Dropdown - Compact, positioned below button */}
              {showExportModal && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                  {/* Header */}
                  <div className="px-4 py-3 border-b bg-gray-50">
                    <h2 className="text-sm font-semibold text-gray-900">Export options</h2>
                  </div>

                  <div className="p-3 space-y-3">
                    {/* Export Section */}
                    <div className="space-y-1">
                      <h3 className="text-xs font-medium text-gray-400 px-2">Export</h3>
                      
                      <button
                        onClick={() => { handleExport('png'); setShowExportModal(false); }}
                        className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Image className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-medium text-gray-900">PNG</div>
                          <div className="text-xs text-gray-500">for web</div>
                        </div>
                      </button>

                      <button
                        onClick={() => { handleExport('webp'); setShowExportModal(false); }}
                        className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Image className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-medium text-gray-900">WebP</div>
                          <div className="text-xs text-gray-500">smaller size</div>
                        </div>
                      </button>

                      <button
                        onClick={() => { handleExport('svg'); setShowExportModal(false); }}
                        className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-purple-50 transition-colors"
                      >
                        <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <FileCode className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-medium text-gray-900">SVG</div>
                          <div className="text-xs text-gray-500">for print</div>
                        </div>
                      </button>
                    </div>

                    {/* Dev Section */}
                    <div className="space-y-1 pt-2 border-t">
                      <h3 className="text-xs font-medium text-gray-400 px-2">Dev</h3>
                      
                      <button
                        onClick={handleCopyCSS}
                        className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-orange-50 transition-colors"
                      >
                        <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <FileCode className="h-4 w-4 text-orange-600" />
                        </div>
                        <div className="text-left flex-1">
                          <div className="text-sm font-medium text-gray-900">CSS</div>
                          <div className="text-xs text-gray-500">Copy CSS</div>
                        </div>
                        {copiedCSS && (
                          <span className="text-xs text-green-600 flex items-center gap-1">
                            <Check className="h-3 w-3" /> Copied!
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Share Section */}
                    <div className="space-y-1 pt-2 border-t">
                      <h3 className="text-xs font-medium text-gray-400 px-2">Share</h3>
                      
                      <button
                        onClick={handleShareURL}
                        className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-green-50 transition-colors"
                      >
                        <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Link className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="text-left flex-1">
                          <div className="text-sm font-medium text-gray-900">Share URL</div>
                          <div className="text-xs text-gray-500">share with others</div>
                        </div>
                        {copiedURL && (
                          <span className="text-xs text-green-600 flex items-center gap-1">
                            <Check className="h-3 w-3" /> Copied!
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
