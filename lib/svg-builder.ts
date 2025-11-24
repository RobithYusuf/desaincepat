import { Point, Shape, Color, Canvas, Filters } from '@/store/gradient-store';

interface SVGExportOptions {
  canvas: Canvas;
  shapes: Shape[];
  palette: Color[];
  filters: Filters;
  outputSize?: {
    width: number;
    height: number;
  };
  includeVertices?: boolean;
  vertexSizePx?: number;
  includeCenterPoints?: boolean;
}

/**
 * Build SVG path from points
 */
function buildPath(points: Point[]): string {
  if (points.length === 0) return '';

  const [first, ...rest] = points;
  const start = `M ${first.x.toFixed(2)} ${first.y.toFixed(2)}`;
  const lines = rest.map((p) => `L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ');

  return `${start} ${lines} Z`;
}

/**
 * Calculate blur margin for filter bounds
 * Better Gradient uses max(blur * 2, 64) for margin calculation
 */
function calculateBlurMargin(blur: number): number {
  return Math.max(blur * 2, 64);
}

/**
 * Build SVG string from gradient data
 */
export function buildSVG(options: SVGExportOptions): string {
  const {
    canvas,
    shapes,
    palette,
    filters,
    outputSize,
    includeVertices = false,
    vertexSizePx = 16,
    includeCenterPoints = false,
  } = options;

  const blur = Math.max(0, Math.min(filters.blur, 256));
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const outputWidth = outputSize?.width ?? canvasWidth;
  const outputHeight = outputSize?.height ?? canvasHeight;

  const blurMargin = calculateBlurMargin(blur);
  const includeGrain = filters.grainEnabled;
  const vertexSize = Math.max(2, Math.min(64, vertexSizePx));

  const svg: string[] = [];

  // SVG header
  svg.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${outputWidth}" height="${outputHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}" preserveAspectRatio="none">`
  );

  // Defs section
  svg.push('<defs>');

  // Calculate filter bounds
  let minX = 0;
  let minY = 0;
  let maxX = canvasWidth;
  let maxY = canvasHeight;

  if (shapes.length > 0) {
    const allX = shapes.flatMap((s) => s.points.map((p) => p.x));
    const allY = shapes.flatMap((s) => s.points.map((p) => p.y));
    minX = Math.min(0, ...allX);
    minY = Math.min(0, ...allY);
    maxX = Math.max(canvasWidth, ...allX);
    maxY = Math.max(canvasHeight, ...allY);
  }

  const filterX = Math.floor(Math.min(-blurMargin, minX - blurMargin));
  const filterY = Math.floor(Math.min(-blurMargin, minY - blurMargin));
  const filterWidth = Math.ceil(Math.max(canvasWidth + blurMargin * 2, maxX + blurMargin) - filterX);
  const filterHeight = Math.ceil(Math.max(canvasHeight + blurMargin * 2, maxY + blurMargin) - filterY);

  // Blur filter - EXACT match with Better Gradient (no color enhancement)
  svg.push(
    `<filter id="blur" x="${filterX}" y="${filterY}" width="${filterWidth}" height="${filterHeight}" filterUnits="userSpaceOnUse">` +
    `<feGaussianBlur stdDeviation="${blur}"/>` +
    `</filter>`
  );

  // Grain filter - EXACT match with Better Gradient
  if (includeGrain) {
    svg.push(
      `<filter id="grain" x="${filterX}" y="${filterY}" width="${filterWidth}" height="${filterHeight}" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" color-interpolation-filters="linearRGB">` +
      `<feTurbulence type="fractalNoise" baseFrequency=".2" numOctaves="4" seed="15" stitchTiles="no-stitch" x="0" y="0" width="${canvasWidth}" height="${canvasHeight}" result="turbulence"/>` +
      `<feSpecularLighting surfaceScale="10" specularConstant="1.21" specularExponent="20" lighting-color="#fff" x="0" y="0" width="${canvasWidth}" height="${canvasHeight}" in="turbulence" result="specularLighting">` +
      `<feDistantLight azimuth="3" elevation="100"/>` +
      `</feSpecularLighting>` +
      `</filter>`
    );
  }

  // Individual blur filters for shapes with custom blur
  const blurValues = Array.from(new Set(shapes.map((s) => Math.max(0, Math.min(s.blur ?? blur, 256)))));
  const blurFilters: Record<number, string> = {};

  for (const blurValue of blurValues) {
    const filterId = blurValue === blur ? 'blur' : `blur_${blurValue}`;
    blurFilters[blurValue] = filterId;

    if (filterId !== 'blur') {
      svg.push(
        `<filter id="${filterId}" x="${filterX}" y="${filterY}" width="${filterWidth}" height="${filterHeight}" filterUnits="userSpaceOnUse">` +
        `<feGaussianBlur stdDeviation="${blurValue}"/>` +
        `</filter>`
      );
    }
  }

  svg.push('</defs>');

  // Background rect
  svg.push(`<rect width="${canvasWidth}" height="${canvasHeight}" fill="${canvas.background.color}"/>`);

  // Shapes
  for (const shape of shapes) {
    const shapeBlur = Math.max(0, Math.min(shape.blur ?? blur, 256));
    const filterId = blurFilters[shapeBlur] ?? 'blur';
    const color = palette[shape.fillIndex]?.color ?? palette[0]?.color ?? '#000000';
    const opacity = Math.max(0, Math.min(shape.opacity ?? filters.opacity, 100)) / 100;

    svg.push(
      `<path d="${buildPath(shape.points)}" fill="${color}" fill-opacity="${opacity}" filter="url(#${filterId})"/>`
    );
  }

  // Vertices (for debugging/editing)
  if (includeVertices) {
    const scaleX = outputWidth / canvasWidth;
    const scaleY = outputHeight / canvasHeight;
    const avgScale = (scaleX + scaleY) / 2;
    // Make vertices more visible
    const radius = Math.max(4, vertexSize / avgScale);

    for (const shape of shapes) {
      for (const point of shape.points) {
        svg.push(
          `<circle cx="${point.x}" cy="${point.y}" r="${radius}" fill="#FFFFFF" stroke="#333333" stroke-width="2" opacity="0.9"/>`
        );
      }
    }
  }

  // DEBUG: Center points and lines to verify positioning
  if (includeCenterPoints) {
    for (const shape of shapes) {
      const color = palette[shape.fillIndex]?.color || '#000000';
      
      // Draw lines from stored center to all vertex points (for debugging)
      for (const point of shape.points) {
        svg.push(
          `<line x1="${shape.center.x}" y1="${shape.center.y}" x2="${point.x}" y2="${point.y}" stroke="#FF0000" stroke-width="1" opacity="0.5"/>`
        );
      }
      
      // Draw cross at stored center (for precise visual verification)
      const crossSize = 20;
      svg.push(
        `<line x1="${shape.center.x - crossSize}" y1="${shape.center.y}" x2="${shape.center.x + crossSize}" y2="${shape.center.y}" stroke="#FF0000" stroke-width="2"/>`
      );
      svg.push(
        `<line x1="${shape.center.x}" y1="${shape.center.y - crossSize}" x2="${shape.center.x}" y2="${shape.center.y + crossSize}" stroke="#FF0000" stroke-width="2"/>`
      );
      
      // Draw center point circle
      svg.push(
        `<circle cx="${shape.center.x}" cy="${shape.center.y}" r="8" fill="#FF0000" stroke="#FFFFFF" stroke-width="2" opacity="1" data-shape-id="${shape.id}"/>`
      );
    }
  }

  // Grain overlay
  if (includeGrain) {
    const grainOpacity = Math.max(0, Math.min(filters.grain, 100)) / 100;
    svg.push(
      `<rect width="${canvasWidth}" height="${canvasHeight}" fill="#FFFFFF" filter="url(#grain)" opacity="${grainOpacity}"/>`
    );
  }

  svg.push('</svg>');

  return svg.join('');
}

/**
 * Convert SVG to data URL
 */
export function svgToDataURL(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Export SVG as PNG using canvas
 */
export async function exportAsPNG(
  svg: string,
  scale: number = 1
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const dataURL = svgToDataURL(svg);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const width = Math.max(1, Math.round(img.width * scale));
      const height = Math.max(1, Math.round(img.height * scale));

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = (error) => reject(error);
    img.src = dataURL;
  });
}

/**
 * Export SVG as WebP using canvas
 */
export async function exportAsWebP(
  svg: string,
  scale: number = 1,
  quality: number = 0.95
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const dataURL = svgToDataURL(svg);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const width = Math.max(1, Math.round(img.width * scale));
      const height = Math.max(1, Math.round(img.height * scale));

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL('image/webp', quality));
    };

    img.onerror = (error) => reject(error);
    img.src = dataURL;
  });
}

/**
 * Download file from data URL
 */
export function downloadFile(dataURL: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
