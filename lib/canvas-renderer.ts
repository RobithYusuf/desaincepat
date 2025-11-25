import { Point, Shape, Color, Filters, Canvas as CanvasConfig } from '@/store/gradient-store';
import { buildSVG, svgToDataURL } from './svg-builder';

interface RenderOptions {
  canvas: CanvasConfig;
  shapes: Shape[];
  palette: Color[];
  filters: Filters;
  includeCenterPoints?: boolean;
  includeVertices?: boolean;
}

/**
 * Create offscreen canvas for rendering
 */
function createOffscreenCanvas(width: number, height: number): HTMLCanvasElement {
  if (typeof document === 'undefined') {
    // Server-side: return mock
    return {
      width,
      height,
      getContext: () => null,
    } as any;
  }
  
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  return canvas;
}

// Cache last rendered image to prevent flicker
let cachedImage: HTMLImageElement | null = null;
let cachedSvgHash: string = '';

/**
 * Simple hash function for SVG content
 */
function hashSvg(svg: string): string {
  let hash = 0;
  for (let i = 0; i < svg.length; i++) {
    const char = svg.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
}

/**
 * Render SVG to canvas - keeps last frame visible until new one is ready
 * @param skipCache - Force render without caching (for export)
 */
async function renderSVGToCanvas(
  svg: string,
  targetCanvas: HTMLCanvasElement,
  skipCache: boolean = false
): Promise<void> {
  const svgHash = hashSvg(svg);
  
  // Skip if same content (unless skipCache is true for export)
  if (!skipCache && svgHash === cachedSvgHash && cachedImage) {
    return;
  }
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const blobUrl = URL.createObjectURL(blob);
    
    img.onload = () => {
      const ctx = targetCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, targetCanvas.width, targetCanvas.height);
        if (!skipCache) {
          cachedImage = img;
          cachedSvgHash = svgHash;
        }
      }
      URL.revokeObjectURL(blobUrl);
      resolve();
    };

    img.onerror = (error) => {
      URL.revokeObjectURL(blobUrl);
      if (skipCache) {
        // For export, we need to report the error
        reject(error);
      } else {
        // For preview, keep showing cached image (no flicker)
        resolve();
      }
    };

    img.src = blobUrl;
  });
}

/**
 * Render mesh gradient to canvas element (with caching for preview)
 */
export async function renderToCanvas(
  targetCanvas: HTMLCanvasElement,
  options: RenderOptions
): Promise<void> {
  const { canvas, shapes, palette, filters, includeCenterPoints, includeVertices } = options;
  
  // Set canvas size only if changed
  if (targetCanvas.width !== canvas.width || targetCanvas.height !== canvas.height) {
    targetCanvas.width = canvas.width;
    targetCanvas.height = canvas.height;
  }
  
  // Generate SVG with all filters
  const svg = buildSVG({
    canvas,
    shapes,
    palette,
    filters,
    includeCenterPoints,
    includeVertices,
  });
  
  // Render SVG to canvas (with caching for smooth preview)
  try {
    await renderSVGToCanvas(svg, targetCanvas, false);
  } catch (error) {
    // Fallback: draw background color
    const ctx = targetCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = canvas.background?.color || '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }
}

/**
 * Render mesh gradient to canvas for export (skip cache, force full render)
 */
export async function renderForExport(
  targetCanvas: HTMLCanvasElement,
  options: RenderOptions
): Promise<void> {
  const { canvas, shapes, palette, filters } = options;
  
  // Set canvas size
  targetCanvas.width = canvas.width;
  targetCanvas.height = canvas.height;
  
  // Generate SVG with all filters
  const svg = buildSVG({
    canvas,
    shapes,
    palette,
    filters,
    includeCenterPoints: false,
    includeVertices: false,
  });
  
  // Render SVG to canvas (skip cache for accurate export)
  await renderSVGToCanvas(svg, targetCanvas, true);
}

/**
 * Export canvas as PNG
 */
export function exportCanvasAsPNG(
  canvas: HTMLCanvasElement,
  filename: string = 'gradient.png'
): void {
  canvas.toBlob((blob) => {
    if (!blob) return;
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(url);
  }, 'image/png');
}

/**
 * Export canvas as WebP
 */
export function exportCanvasAsWebP(
  canvas: HTMLCanvasElement,
  filename: string = 'gradient.webp',
  quality: number = 0.92
): void {
  canvas.toBlob((blob) => {
    if (!blob) return;
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(url);
  }, 'image/webp', quality);
}

/**
 * Export canvas as SVG with full filters (blur, grain, opacity, rotation)
 */
export function exportCanvasAsSVG(
  options: RenderOptions,
  filename: string = 'gradient.svg'
): void {
  // Use the same buildSVG function to ensure consistency
  const svg = buildSVG({
    canvas: options.canvas,
    shapes: options.shapes,
    palette: options.palette,
    filters: options.filters,
    includeCenterPoints: false,
    includeVertices: false,
  });
  
  // Download
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  
  URL.revokeObjectURL(url);
}
