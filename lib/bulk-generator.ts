import { toPng } from 'html-to-image';
import { BulkItem, BulkItemTypography, GeneratedImage, textToFileName } from '@/store/bulk-store';
import { DesignStore } from '@/store/design-store';

interface ExportSettings {
  format: 'png' | 'webp';
  quality: 1 | 2 | 3;
  width: number;
  height: number;
}

// Font family mapping from Tailwind classes to CSS font-family
const fontFamilyMap: Record<string, string> = {
  'font-inter': 'Inter, system-ui, sans-serif',
  'font-roboto': 'Roboto, system-ui, sans-serif',
  'font-open-sans': '"Open Sans", system-ui, sans-serif',
  'font-montserrat': 'Montserrat, system-ui, sans-serif',
  'font-poppins': 'Poppins, system-ui, sans-serif',
  'font-lato': 'Lato, system-ui, sans-serif',
  'font-raleway': 'Raleway, system-ui, sans-serif',
  'font-oswald': 'Oswald, system-ui, sans-serif',
  'font-playfair': '"Playfair Display", serif',
  'font-merriweather': 'Merriweather, serif',
  'font-lora': 'Lora, serif',
  'font-pt-serif': '"PT Serif", serif',
  'font-source-code-pro': '"Source Code Pro", monospace',
  'font-fira-code': '"Fira Code", monospace',
  'font-jetbrains-mono': '"JetBrains Mono", monospace',
  'font-ibm-plex-mono': '"IBM Plex Mono", monospace',
  'font-bebas-neue': '"Bebas Neue", sans-serif',
  'font-anton': 'Anton, sans-serif',
  'font-alfa-slab-one': '"Alfa Slab One", serif',
  'font-righteous': 'Righteous, sans-serif',
  'font-permanent-marker': '"Permanent Marker", cursive',
  'font-caveat': 'Caveat, cursive',
  'font-dancing-script': '"Dancing Script", cursive',
  'font-pacifico': 'Pacifico, cursive',
  'font-comic-neue': '"Comic Neue", cursive',
  'font-bangers': 'Bangers, cursive',
  'font-press-start': '"Press Start 2P", monospace',
  'font-vt323': 'VT323, monospace',
  'font-ibm-plex-sans-condensed': '"IBM Plex Sans Condensed", sans-serif',
};

// Delay helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Create a hidden canvas element for rendering
function createHiddenCanvas(
  designStore: DesignStore,
  text: string,
  customBackground?: string,
  customTypography?: BulkItemTypography
): HTMLDivElement {
  const {
    fontSize: defaultFontSize,
    lineHeight: defaultLineHeight,
    maxWidth: defaultMaxWidth,
    fontColor: defaultFontColor,
    fontFamily: defaultFontFamily,
    textAlign: defaultTextAlign,
    padding,
    backgroundMode,
    backgroundColor,
    customGradient,
    textureEnabled,
    textureType,
    textureIntensity,
    getFrameDimensions,
  } = designStore;

  // Use custom typography if provided, otherwise use defaults
  const fontSize = customTypography?.fontSize ?? defaultFontSize;
  const lineHeight = customTypography?.lineHeight ?? defaultLineHeight;
  const maxWidth = customTypography?.maxWidth ?? defaultMaxWidth;
  const fontColor = customTypography?.fontColor ?? defaultFontColor;
  const fontFamily = customTypography?.fontFamily ?? defaultFontFamily;
  const textAlign = customTypography?.textAlign ?? defaultTextAlign;

  const { width, height } = getFrameDimensions();

  // Create container
  const container = document.createElement('div');
  container.id = 'bulk-canvas-temp';
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = `${width}px`;
  container.style.height = `${height}px`;
  container.style.overflow = 'hidden';
  container.style.zIndex = '-1';

  // Get background - use custom if provided, otherwise use design store settings
  let background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  if (customBackground) {
    background = customBackground;
  } else if (backgroundMode === 'solid') {
    background = backgroundColor || '#6366f1';
  } else if (customGradient && customGradient.trim() !== '') {
    background = customGradient;
  }

  container.style.background = background;
  container.style.backgroundSize = 'cover';
  container.style.backgroundPosition = 'center';

  // Add texture overlay if enabled
  if (textureEnabled) {
    const textureUrl = getTextureUrl(textureType);
    if (textureUrl) {
      const textureDiv = document.createElement('div');
      textureDiv.style.position = 'absolute';
      textureDiv.style.inset = '0';
      textureDiv.style.backgroundImage = `url(${textureUrl})`;
      textureDiv.style.backgroundRepeat = 'repeat';
      textureDiv.style.backgroundSize = 'auto';
      textureDiv.style.opacity = String(textureIntensity / 100);
      textureDiv.style.pointerEvents = 'none';
      container.appendChild(textureDiv);
    }
  }

  // Create text container
  const textContainer = document.createElement('div');
  textContainer.style.position = 'relative';
  textContainer.style.zIndex = '50';
  textContainer.style.display = 'flex';
  textContainer.style.height = '100%';
  textContainer.style.alignItems = 'center';
  textContainer.style.justifyContent = 'center';
  textContainer.style.padding = `${padding}px`;

  // Create text element
  const textEl = document.createElement('h1');
  // Use actual CSS font-family instead of Tailwind class
  const cssFontFamily = fontFamilyMap[fontFamily] || 'Inter, system-ui, sans-serif';
  textEl.style.fontFamily = cssFontFamily;
  textEl.style.fontSize = `${fontSize}px`;
  textEl.style.lineHeight = String(lineHeight);
  textEl.style.color = fontColor;
  textEl.style.textAlign = textAlign;
  textEl.style.fontWeight = '700';
  textEl.style.maxWidth = `${maxWidth}%`;
  textEl.style.wordWrap = 'break-word';
  textEl.style.margin = '0';
  textEl.textContent = text;

  textContainer.appendChild(textEl);
  container.appendChild(textContainer);

  return container;
}

// Get texture URL
function getTextureUrl(textureType: string): string | null {
  switch (textureType) {
    case 'noise':
      return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="200" height="200" filter="url(%23n)" opacity="0.3"/%3E%3C/svg%3E';
    case 'fine':
      return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="1" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="50" height="50" filter="url(%23n)" opacity="0.15"/%3E%3C/svg%3E';
    case 'medium':
      return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23n)" opacity="0.2"/%3E%3C/svg%3E';
    case 'coarse':
      return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="200" height="200" filter="url(%23n)" opacity="0.25"/%3E%3C/svg%3E';
    case 'paper':
      return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="turbulence" baseFrequency="0.05" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="300" height="300" filter="url(%23n)" opacity="0.1"/%3E%3C/svg%3E';
    default:
      return null;
  }
}

// Generate single thumbnail by manipulating the actual canvas
async function generateSingleThumbnail(
  text: string,
  designStore: DesignStore,
  settings: ExportSettings,
  customBackground?: string,
  customTypography?: BulkItemTypography
): Promise<string> {
  // Get the actual canvas element
  const canvasElement = document.getElementById('canvas-export');
  if (!canvasElement) {
    throw new Error('Canvas element not found');
  }

  // Get the canvas wrapper (parent) and save original styles
  const canvasWrapper = canvasElement.parentElement?.parentElement;
  const originalWrapperStyle = canvasWrapper?.getAttribute('style') || '';

  // Store original values
  const originalText = designStore.text;
  const originalBgMode = designStore.backgroundMode;
  const originalBgColor = designStore.backgroundColor;
  const originalGradient = designStore.customGradient;
  // Store original typography values
  const originalFontSize = designStore.fontSize;
  const originalFontFamily = designStore.fontFamily;
  const originalFontColor = designStore.fontColor;
  const originalTextAlign = designStore.textAlign;
  const originalLineHeight = designStore.lineHeight;
  const originalMaxWidth = designStore.maxWidth;

  try {
    // Make canvas visible for capture (but keep off-screen)
    if (canvasWrapper) {
      canvasWrapper.style.cssText = 'position: fixed; top: -9999px; left: 0; z-index: -9999; visibility: visible; opacity: 1;';
    }

    // Temporarily update the design store with bulk item values
    designStore.setText(text);
    
    if (customBackground) {
      if (customBackground.includes('gradient') || customBackground.includes('linear') || customBackground.includes('radial')) {
        designStore.setBackgroundMode('gradient');
        designStore.setCustomGradient(customBackground);
      } else if (customBackground.includes('url')) {
        designStore.setBackgroundMode('gradient');
        designStore.setCustomGradient(customBackground);
      } else {
        designStore.setBackgroundMode('solid');
        designStore.setBackgroundColor(customBackground);
      }
    }

    // Apply custom typography if provided
    if (customTypography) {
      if (customTypography.fontSize !== undefined) designStore.setFontSize(customTypography.fontSize);
      if (customTypography.fontFamily !== undefined) designStore.setFontFamily(customTypography.fontFamily);
      if (customTypography.fontColor !== undefined) designStore.setFontColor(customTypography.fontColor);
      if (customTypography.textAlign !== undefined) designStore.setTextAlign(customTypography.textAlign);
      if (customTypography.lineHeight !== undefined) designStore.setLineHeight(customTypography.lineHeight);
      if (customTypography.maxWidth !== undefined) designStore.setMaxWidth(customTypography.maxWidth);
    }

    // Wait for React to re-render
    await delay(150);
    
    // Wait for fonts
    try {
      await document.fonts.ready;
    } catch (e) {}
    
    await delay(200);

    // Export the canvas
    const dataUrl = await toPng(canvasElement, {
      quality: 0.95,
      pixelRatio: settings.quality,
      cacheBust: true,
      skipAutoScale: true,
      backgroundColor: undefined,
      fetchRequestInit: {
        mode: 'cors',
        cache: 'no-cache',
      },
    });

    return dataUrl;
  } finally {
    // Restore original values
    designStore.setText(originalText);
    designStore.setBackgroundMode(originalBgMode);
    designStore.setBackgroundColor(originalBgColor);
    designStore.setCustomGradient(originalGradient);
    // Restore original typography values
    designStore.setFontSize(originalFontSize);
    designStore.setFontFamily(originalFontFamily);
    designStore.setFontColor(originalFontColor);
    designStore.setTextAlign(originalTextAlign);
    designStore.setLineHeight(originalLineHeight);
    designStore.setMaxWidth(originalMaxWidth);
    
    // Restore canvas wrapper style
    if (canvasWrapper) {
      canvasWrapper.setAttribute('style', originalWrapperStyle);
    }
    
    // Wait for restore
    await delay(50);
  }
}

// Main bulk generation function
export async function generateBulkThumbnails(
  items: BulkItem[],
  designStore: DesignStore,
  settings: ExportSettings,
  onProgress: (index: number, image: GeneratedImage) => void,
  shouldCancel: () => boolean
): Promise<GeneratedImage[]> {
  const results: GeneratedImage[] = [];

  for (let i = 0; i < items.length; i++) {
    // Check for cancellation
    if (shouldCancel()) {
      console.log('Bulk generation cancelled');
      break;
    }

    const item = items[i];
    const fileName = textToFileName(item.text);
    const id = `bulk-${i}-${Date.now()}`;

    // Create pending image
    const pendingImage: GeneratedImage = {
      id,
      text: item.text,
      fileName,
      dataUrl: '',
      status: 'generating',
    };

    onProgress(i + 1, pendingImage);

    try {
      // Generate thumbnail with optional custom background and typography
      const dataUrl = await generateSingleThumbnail(
        item.text, 
        designStore, 
        settings,
        item.background,
        item.typography
      );

      const completedImage: GeneratedImage = {
        ...pendingImage,
        dataUrl,
        status: 'done',
      };

      results.push(completedImage);
      onProgress(i + 1, completedImage);

      // Small delay between generations
      await delay(150);
    } catch (error) {
      console.error(`Failed to generate thumbnail for: ${item.text}`, error);
      
      const errorImage: GeneratedImage = {
        ...pendingImage,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      results.push(errorImage);
      onProgress(i + 1, errorImage);
    }
  }

  return results;
}
