import { Point, Shape, Color, Filters, Canvas as CanvasConfig } from '@/store/gradient-store';
import { buildSVG, svgToDataURL } from './svg-builder';

interface RenderOptions {
  canvas: CanvasConfig;
  shapes: Shape[];
  palette: Color[];
  filters: Filters;
  includeCenterPoints?: boolean;
  includeVertices?: boolean;
  fastMode?: boolean; // Skip heavy filters for real-time dragging
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
 */
async function renderSVGToCanvas(
  svg: string,
  targetCanvas: HTMLCanvasElement
): Promise<void> {
  const svgHash = hashSvg(svg);
  
  // Skip if same content
  if (svgHash === cachedSvgHash && cachedImage) {
    return;
  }
  
  return new Promise((resolve) => {
    const img = new Image();
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const blobUrl = URL.createObjectURL(blob);
    
    img.onload = () => {
      const ctx = targetCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, targetCanvas.width, targetCanvas.height);
        cachedImage = img;
        cachedSvgHash = svgHash;
      }
      URL.revokeObjectURL(blobUrl);
      resolve();
    };

    img.onerror = () => {
      URL.revokeObjectURL(blobUrl);
      // On error, keep showing cached image (no flicker)
      resolve();
    };

    img.src = blobUrl;
  });
}

/**
 * Render mesh gradient to canvas element
 */
export async function renderToCanvas(
  targetCanvas: HTMLCanvasElement,
  options: RenderOptions
): Promise<void> {
  const { canvas, shapes, palette, filters, includeCenterPoints, includeVertices, fastMode } = options;
  
  // Set canvas size only if changed
  if (targetCanvas.width !== canvas.width || targetCanvas.height !== canvas.height) {
    targetCanvas.width = canvas.width;
    targetCanvas.height = canvas.height;
  }
  
  // In fast mode, disable grain for smoother dragging
  const renderFilters = fastMode ? { ...filters, grainEnabled: false } : filters;
  
  // Generate SVG
  const svg = buildSVG({
    canvas,
    shapes,
    palette,
    filters: renderFilters,
    includeCenterPoints,
    includeVertices,
  });
  
  // Render SVG to canvas
  try {
    await renderSVGToCanvas(svg, targetCanvas);
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
 * Export canvas as SVG (for vector export compatibility)
 */
export function exportCanvasAsSVG(
  options: RenderOptions,
  filename: string = 'gradient.svg'
): void {
  const { canvas, shapes, palette } = options;
  
  // Build SVG string
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvas.width} ${canvas.height}" width="${canvas.width}" height="${canvas.height}">`;
  
  // Background
  svg += `<rect width="${canvas.width}" height="${canvas.height}" fill="${canvas.background?.color || '#ffffff'}" />`;
  
  // Shapes (without filters for simplicity - user can add in vector editor)
  shapes.forEach((shape) => {
    const color = palette[shape.fillIndex]?.color || '#000000';
    const points = shape.points.map(p => `${p.x},${p.y}`).join(' ');
    svg += `<polygon points="${points}" fill="${color}" />`;
  });
  
  svg += '</svg>';
  
  // Download
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  
  URL.revokeObjectURL(url);
}
