import { Point, Shape } from '@/store/gradient-store';
import Delaunay from 'delaunator';

interface GenerateOptions {
  width: number;
  height: number;
  numColors: number;
  overscan?: number;
  insideFraction?: number;
  insideRadius?: { min: number; max: number };
  outsideRadius?: { min: number; max: number };
  maxPlacementTries?: number;
  spread?: number;
}

const DEFAULT_OPTIONS = {
  overscan: 0.2, // 20% overscan to allow shapes to extend beyond edges
  insideFraction: 0.6, // 60% points inside, 40% outside for better coverage
  insideRadius: { min: 0.27, max: 0.47 }, // Slight spacing increase (balanced)
  outsideRadius: { min: 0.32, max: 0.52 }, // Slight spacing increase (balanced)
  maxPlacementTries: 300,
};

/**
 * Generate random point within bounds
 */
function randomPoint(
  minX: number,
  maxX: number,
  minY: number,
  maxY: number
): Point {
  return {
    x: minX + Math.random() * (maxX - minX),
    y: minY + Math.random() * (maxY - minY),
  };
}

/**
 * Calculate distance between two points
 */
function distance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Check if point is too close to existing points
 */
function isTooClose(
  point: Point,
  existingPoints: Point[],
  minDistance: number
): boolean {
  return existingPoints.some((p) => distance(point, p) < minDistance);
}

/**
 * Generate points with minimum distance constraint
 */
function generatePoints(options: GenerateOptions): Point[] {
  const {
    width,
    height,
    numColors,
    overscan = DEFAULT_OPTIONS.overscan,
    insideFraction = DEFAULT_OPTIONS.insideFraction,
    insideRadius = DEFAULT_OPTIONS.insideRadius,
    outsideRadius = DEFAULT_OPTIONS.outsideRadius,
    maxPlacementTries = DEFAULT_OPTIONS.maxPlacementTries,
  } = options;

  const points: Point[] = [];
  // Slightly reduce points for subtle spacing between shapes
  const totalPoints = Math.max(numColors * 1.7, 9); // Balanced: not too many, not too few
  const numInsidePoints = Math.floor(totalPoints * insideFraction);
  const numOutsidePoints = totalPoints - numInsidePoints;

  // Calculate bounds
  const overscanX = width * overscan;
  const overscanY = height * overscan;
  const minX = -overscanX;
  const maxX = width + overscanX;
  const minY = -overscanY;
  const maxY = height + overscanY;

  // Calculate min distances
  const canvasSize = Math.max(width, height);
  const insideMinDist = canvasSize * insideRadius.min;
  const outsideMinDist = canvasSize * outsideRadius.min;

  // Very small margin to maximize shape size and coverage
  const margin = Math.min(width, height) * 0.05; // 5% margin for point generation
  
  // Generate inside points with margin
  for (let i = 0; i < totalPoints; i++) {
    let point: Point | null = null;
    let tries = 0;
    const minDist = i < numInsidePoints ? insideMinDist : outsideMinDist;

    while (!point && tries < maxPlacementTries) {
      const candidate = randomPoint(margin, width - margin, margin, height - margin);
      if (!isTooClose(candidate, points, minDist)) {
        point = candidate;
      }
      tries++;
    }

    if (point) {
      points.push(point);
    }
  }

  return points;
}

/**
 * Convert Delaunay triangles to polygon shapes
 */
function trianglesToShapes(
  points: Point[],
  triangles: number[],
  numColors: number
): Shape[] {
  const shapes: Shape[] = [];

  // Group triangles into shapes (every 3 indices = 1 triangle)
  for (let i = 0; i < triangles.length; i += 3) {
    const p1 = points[triangles[i]];
    const p2 = points[triangles[i + 1]];
    const p3 = points[triangles[i + 2]];

    if (p1 && p2 && p3) {
      const trianglePoints = [p1, p2, p3];
      // Calculate centroid of triangle
      const centroid = {
        x: (p1.x + p2.x + p3.x) / 3,
        y: (p1.y + p2.y + p3.y) / 3,
      };
      
      shapes.push({
        id: `blob_${Math.random().toString(36).substr(2, 9)}`,
        center: centroid,
        points: trianglePoints,
        fillIndex: Math.floor(Math.random() * numColors),
      });
    }
  }

  return shapes;
}

/**
 * Generate more organic blob shapes using Voronoi-like approach
 */
function generateOrganicShapes(
  points: Point[],
  width: number,
  height: number,
  numColors: number,
  spread: number = 100
): Shape[] {
  const shapes: Shape[] = [];
  const spreadFactor = spread / 100;
  
  // Create color assignments array - ensure ALL colors are used at least once
  const colorAssignments: number[] = [];
  
  // First: assign each color at least once (guaranteed usage)
  for (let i = 0; i < numColors; i++) {
    colorAssignments.push(i);
  }
  
  // Then: fill remaining slots with distributed colors (avoid consecutive duplicates)
  for (let i = numColors; i < points.length; i++) {
    // Pick a random color, but prefer colors that haven't been used much
    const colorCounts = new Array(numColors).fill(0);
    colorAssignments.forEach(c => colorCounts[c]++);
    
    // Find least used color
    const minCount = Math.min(...colorCounts);
    const leastUsedColors = colorCounts
      .map((count, idx) => count === minCount ? idx : -1)
      .filter(idx => idx !== -1);
    
    // Pick random from least used
    const selectedColor = leastUsedColors[Math.floor(Math.random() * leastUsedColors.length)];
    colorAssignments.push(selectedColor);
  }
  
  // Shuffle to distribute colors evenly across canvas
  for (let i = colorAssignments.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [colorAssignments[i], colorAssignments[j]] = [colorAssignments[j], colorAssignments[i]];
  }
  
  let assignmentIndex = 0; // Track which color to assign next

  for (let i = 0; i < points.length; i++) {
    const center = points[i];
    
    // NO margin - allow shapes to extend beyond canvas (blur will handle edges)
    const blobMargin = 0;
    
    // Calculate max radius - can be LARGER than distance to edge
    const distanceToEdge = Math.min(
      center.x,
      width - center.x,
      center.y,
      height - center.y
    );
    
    // Allow shapes to extend beyond canvas edges for full coverage
    // Balanced base size - 29-33% of canvas dimension (subtle spacing)
    const baseRadius = Math.min(width, height) * (0.29 + Math.random() * 0.04); // 29-33% of canvas
    const maxRadius = baseRadius * spreadFactor * 1.25; // 1.25x multiplier for balanced shapes
    
    // Random orientation for elongated shapes
    const elongationAngle = Math.random() * Math.PI * 2;
    const elongationFactor = 0.7 + Math.random() * 0.5; // 0.7 to 1.2 - moderate elongation
    
    // Fewer points for larger, smoother shapes
    const numPoints = Math.floor(Math.random() * 6) + 10; // 10-15 points per blob

    const blobPoints: Point[] = [];

    for (let j = 0; j < numPoints; j++) {
      const angle = (j / numPoints) * Math.PI * 2;
      
      // Calculate distance from elongation axis
      const angleFromElongation = angle - elongationAngle;
      
      // Radius varies more along elongation axis
      const elongationEffect = Math.cos(angleFromElongation * 2);
      const radiusVariation = elongationEffect * 0.3 + 0.9; // 0.6 to 1.2
      
      // Add noise for organic feel (less noise for smoother shapes)
      const noise = (Math.sin(angle * 3.7) + Math.cos(angle * 5.3)) * 0.08;
      
      // Final radius with all variations - LARGE and BOLD
      const r = maxRadius * radiusVariation * (1 + noise) * (0.85 + Math.random() * 0.25);
      
      // Calculate point position - NO clamping, allow to extend beyond canvas
      const x = center.x + Math.cos(angle) * r;
      const y = center.y + Math.sin(angle) * r;
      
      blobPoints.push({ x, y });
    }
    
    // Calculate actual centroid from blob points for accurate center
    const centroid = {
      x: blobPoints.reduce((sum, p) => sum + p.x, 0) / blobPoints.length,
      y: blobPoints.reduce((sum, p) => sum + p.y, 0) / blobPoints.length,
    };

    // Assign color from pre-shuffled assignments (guarantees all colors used)
    const assignedColor = colorAssignments[assignmentIndex % colorAssignments.length];
    assignmentIndex++;

    shapes.push({
      id: `blob_${Math.random().toString(36).substr(2, 9)}`,
      center: centroid, // Store actual centroid for accurate center  
      points: blobPoints,
      fillIndex: assignedColor,
    });
  }

  console.log(`✅ Generated ${shapes.length} LARGE shapes with ${numColors} colors (full coverage mode)`);
  
  // Verify all colors are used
  const usedColors = new Set(shapes.map(s => s.fillIndex));
  console.log(`🎨 Colors used: ${Array.from(usedColors).sort().join(', ')} (${usedColors.size}/${numColors})`);
  
  return shapes;
}

/**
 * Main function to generate mesh gradient
 */
export function generateMeshGradient(options: GenerateOptions): Shape[] {
  const points = generatePoints(options);

  if (points.length < 3) {
    console.warn('Not enough points generated for mesh');
    return [];
  }

  // Use organic blob approach for better-looking gradients
  const shapes = generateOrganicShapes(
    points,
    options.width,
    options.height,
    options.numColors,
    options.spread
  );
  
  // NO validation - shapes are ALLOWED to extend beyond canvas for full coverage
  // The blur effect will naturally blend edges
  console.log('🔍 Shapes generated (full coverage mode - no bounds validation):', {
    canvasSize: { width: options.width, height: options.height },
    shapesCount: shapes.length,
    note: 'Shapes extend beyond canvas for maximum blur coverage'
  });
  
  return shapes;
}

/**
 * Randomize existing shapes (move points)
 */
export function randomizeShapes(
  shapes: Shape[],
  width: number,
  height: number
): Shape[] {
  const margin = Math.min(width, height) * 0.02; // Small margin for safety
  
  return shapes.map((shape) => {
    // Random movement
    const dx = (Math.random() - 0.5) * 100;
    const dy = (Math.random() - 0.5) * 100;
    
    // Move all points by delta with clamping to keep inside canvas
    const newPoints = shape.points.map((point) => ({
      x: Math.max(margin, Math.min(width - margin, point.x + dx)),
      y: Math.max(margin, Math.min(height - margin, point.y + dy)),
    }));
    
    // Calculate new centroid from moved points
    const newCentroid = {
      x: newPoints.reduce((sum, p) => sum + p.x, 0) / newPoints.length,
      y: newPoints.reduce((sum, p) => sum + p.y, 0) / newPoints.length,
    };
    
    return {
      ...shape,
      center: newCentroid,
      points: newPoints,
    };
  });
}

/**
 * Generate preset gradients
 */
export const GRADIENT_PRESETS = [
  {
    title: 'Golden Mist',
    config: {
      palette: [
        { id: crypto.randomUUID(), color: '#ffffff' },
        { id: crypto.randomUUID(), color: '#609EFF' },
        { id: crypto.randomUUID(), color: '#FCB055' },
        { id: crypto.randomUUID(), color: '#FB847C' },
        { id: crypto.randomUUID(), color: '#B6B8FD' },
      ],
      shapes: [] as Shape[], // Will be generated dynamically
    },
  },
  {
    title: 'Coral Breeze',
    config: {
      palette: [
        { id: crypto.randomUUID(), color: '#ffffff' },
        { id: crypto.randomUUID(), color: '#FF6B9D' },
        { id: crypto.randomUUID(), color: '#FEC3A6' },
        { id: crypto.randomUUID(), color: '#EAE4E9' },
        { id: crypto.randomUUID(), color: '#C2E9FB' },
      ],
      shapes: [] as Shape[],
    },
  },
  {
    title: 'Summer Tide',
    config: {
      palette: [
        { id: crypto.randomUUID(), color: '#ffffff' },
        { id: crypto.randomUUID(), color: '#A8EDEA' },
        { id: crypto.randomUUID(), color: '#FED6E3' },
        { id: crypto.randomUUID(), color: '#FCECD1' },
        { id: crypto.randomUUID(), color: '#C6EFFE' },
      ],
      shapes: [] as Shape[],
    },
  },
  {
    title: 'Frosted Glow',
    config: {
      palette: [
        { id: crypto.randomUUID(), color: '#ffffff' },
        { id: crypto.randomUUID(), color: '#6E95BC' },
        { id: crypto.randomUUID(), color: '#8391B8' },
        { id: crypto.randomUUID(), color: '#DB7E56' },
        { id: crypto.randomUUID(), color: '#E8DFE0' },
      ],
      shapes: [] as Shape[],
    },
  },
  {
    title: 'Purple Dream',
    config: {
      palette: [
        { id: crypto.randomUUID(), color: '#ffffff' },
        { id: crypto.randomUUID(), color: '#667eea' },
        { id: crypto.randomUUID(), color: '#764ba2' },
        { id: crypto.randomUUID(), color: '#f093fb' },
        { id: crypto.randomUUID(), color: '#f5576c' },
      ],
      shapes: [] as Shape[],
    },
  },
];
