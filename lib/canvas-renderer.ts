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

/**
 * Render SVG to canvas using Image element
 * This approach uses native SVG filters (feTurbulence + feSpecularLighting) 
 * which produces the SAME grain quality as Better Gradient
 */
async function renderSVGToCanvas(
  svg: string,
  targetCanvas: HTMLCanvasElement
): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const dataURL = svgToDataURL(svg);

    img.onload = () => {
      const ctx = targetCanvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Clear canvas
      ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
      
      // Enable high-quality image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Draw image to canvas
      ctx.drawImage(img, 0, 0, targetCanvas.width, targetCanvas.height);
      
      resolve();
    };

    img.onerror = (error) => {
      console.error('Failed to load SVG image:', error);
      reject(error);
    };

    img.src = dataURL;
  });
}

/**
 * Render mesh gradient to canvas element
 * NOW USING SVG APPROACH - Same as Better Gradient!
 */
export async function renderToCanvas(
  targetCanvas: HTMLCanvasElement,
  options: RenderOptions
): Promise<void> {
  const { canvas, shapes, palette, filters, includeCenterPoints, includeVertices } = options;
  
  // Set canvas size
  targetCanvas.width = canvas.width;
  targetCanvas.height = canvas.height;
  
  // Generate SVG with all filters (blur + grain)
  const svg = buildSVG({
    canvas,
    shapes,
    palette,
    filters,
    includeCenterPoints,
    includeVertices,
  });
  
  // Render SVG to canvas
  try {
    await renderSVGToCanvas(svg, targetCanvas);
  } catch (error) {
    console.error('Failed to render SVG to canvas:', error);
    
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
