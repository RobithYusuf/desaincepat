// ============================================
// Prompt Templates for Thumbnail Image Generation
// Best Practices 2025 - Gemini 2.5 Flash / 3 Pro
// ============================================

export interface ThumbnailPromptConfig {
  topic: string;
  style: string;
  audience: string;
  resolution: string;
  additionalNotes?: string;
}

// Frame size options (matches design-store)
export const FRAME_SIZE_OPTIONS = [
  { value: 'youtube', label: 'YouTube Thumbnail', width: 1280, height: 720, aspectRatio: '16:9', platform: 'YouTube' },
  { value: 'instagram', label: 'Instagram Portrait', width: 1080, height: 1350, aspectRatio: '4:5', platform: 'Instagram' },
  { value: 'twitter', label: 'Twitter Banner', width: 1500, height: 500, aspectRatio: '3:1', platform: 'Twitter' },
  { value: 'custom', label: 'Custom Size', width: 1280, height: 720, aspectRatio: 'custom', platform: 'Custom' },
] as const;

// Style options for UI
export const STYLE_OPTIONS = [
  { value: 'modern-gradient', label: 'Modern Gradient' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'bold-colorful', label: 'Bold & Colorful' },
  { value: 'professional', label: 'Professional' },
  { value: 'playful', label: 'Playful' },
  { value: 'dark-mode', label: 'Dark Mode' },
  { value: 'neon-glow', label: 'Neon Glow' },
  { value: 'retro-vintage', label: 'Retro/Vintage' },
  { value: 'cinematic', label: 'Cinematic' },
  { value: '3d-render', label: '3D Render' },
] as const;

// Audience options for UI
export const AUDIENCE_OPTIONS = [
  { value: 'general', label: 'General Audience' },
  { value: 'developers', label: 'Developers/Tech' },
  { value: 'business', label: 'Business/Corporate' },
  { value: 'students', label: 'Students/Education' },
  { value: 'gamers', label: 'Gamers' },
  { value: 'creators', label: 'Content Creators' },
  { value: 'kids', label: 'Kids/Family' },
] as const;

// Font options that match the app
export const FONT_OPTIONS = [
  'Inter', 'Roboto', 'Open Sans', 'Montserrat', 'Poppins', 'Lato',
  'Raleway', 'Nunito', 'Ubuntu', 'Oswald', 'Bebas Neue', 'Righteous',
  'Bangers', 'Russo One', 'Merriweather', 'Playfair Display'
] as const;

// Detailed style descriptions optimized for thumbnail generation (Best Practice 2025)
// Each description includes: visual elements, colors, lighting, composition, and thumbnail-specific guidance
// Style descriptions for BACKGROUND generation (no text - text added by app)
const STYLE_SCENE_DESCRIPTIONS: Record<string, string> = {
  'modern-gradient': `A beautiful modern gradient background with smooth flowing color transitions from rich purple through vibrant blue to soft pink or orange. Elegant glassmorphism shapes float subtly in the composition - translucent rectangles and circles with frosted glass effect. Soft bokeh light orbs add depth and dimension. Clean, uncluttered center area reserved for content. Professional studio lighting creates a premium, contemporary aesthetic. Perfect for tech and creative content.`,

  'minimalist': `An ultra-clean minimalist background with generous negative space. Soft white or light gray canvas with maximum empty area (80% clean). A single subtle accent element positioned thoughtfully using rule of thirds. Premium Apple-style aesthetic with perfect simplicity. Soft, even lighting with no harsh shadows. Sophisticated and elegant, letting content breathe.`,

  'bold-colorful': `A vibrant, high-energy background with bold geometric shapes and dynamic color blocking. Rich saturated colors: electric yellow, hot pink, and cyan create visual excitement. Paint splashes or abstract brush strokes add artistic flair. Strong contrast between light and dark areas. The composition flows diagonally, creating movement and energy. Studio lighting with soft shadows. IMPORTANT: Keep a clean, high-contrast title zone (center area) with minimal visual noise; place the busiest shapes and splashes toward the edges to frame the title.`,

  'professional': `A sophisticated corporate background with a deep navy blue to slate gradient. Subtle golden accent lines create elegant geometric patterns. Clean, minimal design with abstract business-inspired shapes floating softly. Soft studio lighting creates depth. Professional and trustworthy atmosphere, suitable for business content. Polished, high-end aesthetic. Keep patterns and accents away from the title area; let the edges carry detail while the center stays clean for readability.`,

  'playful': `A cheerful, fun background bursting with positive energy. Soft pastel colors: sunny yellow, coral pink, sky blue, and mint green blend harmoniously. Floating elements like bubbles, confetti, stars, and organic curved shapes. Cartoon-style clouds add whimsy. Bright, even lighting creates a welcoming atmosphere. Kid-friendly yet stylish, perfect for entertainment content. IMPORTANT: Arrange playful elements mostly around the borders/corners to frame the center; keep a clear, calmer center area for the title text.`,

  'dark-mode': `A sleek dark-mode tech background with rich charcoal black gradient. Subtle cyan and magenta neon accents glow softly at the edges. Faint grid lines or circuit board patterns add technical depth. Modern developer aesthetic with clean lines. Dramatic rim lighting creates separation. Moody but professional atmosphere, perfect for coding or tech tutorials. Keep patterns subtle and concentrated toward edges; preserve a clean, high-contrast center area for the title.`,

  'neon-glow': `A cyberpunk-inspired background with deep dark purple-black base. Intense neon lights in hot pink and electric cyan create dramatic glow effects. Light bloom and lens flare add cinematic quality. Reflective wet surfaces hint at a futuristic city. Blade Runner aesthetic with high contrast. Dramatic, edgy atmosphere perfect for gaming or tech content. IMPORTANT: Do NOT place lens flares or heavy bloom over the title area; keep the title region crisp and readable, with neon accents primarily on edges.`,

  'retro-vintage': `A nostalgic retro background inspired by 1970s design. Warm muted colors: burnt orange, mustard yellow, olive green, and brown. Subtle film grain texture adds authenticity. Sunburst rays and halftone patterns add retro energy, but keep them low-contrast behind the title area so readability stays high. Halftone dot patterns and vignette edges complete the vintage look. Warm, cozy lighting creates comfortable nostalgia.`,

  'cinematic': `A dramatic cinematic background with Hollywood-style color grading. Rich teal shadows contrast with warm orange highlights. Atmospheric fog or haze creates depth and mystery. Dramatic light rays pierce through, adding epic scale. Strong foreground-background separation. Film-like quality with high dynamic range. Perfect for storytelling content. IMPORTANT: Maintain strong local contrast where the title sits (a clean darker/lighter plate behind text); avoid haze or light rays washing out the title area.`,

  '3d-render': `A modern 3D rendered background with glossy translucent objects floating in space. Glass-like cubes, spheres, and abstract geometric shapes catch the light beautifully. Deep gradient backdrop transitioning from navy blue through purple to dark teal. Professional studio lighting with soft shadows and subtle reflections.

Composition guidance: DO NOT cluster all 3D assets in the center. Distribute multiple objects across the frame edges (left, right, top, bottom) using rule-of-thirds and asymmetry. Some objects may be partially off-frame to feel immersive. Layer objects at different depths and sizes to create a full, balanced scene while keeping a clean, calm center area reserved for text/readability. Objects have a subtle glow effect. Clean, premium tech aesthetic like Apple product shots. Moody but vibrant atmosphere.`,
};

// Audience-specific visual elements for thumbnail optimization
const AUDIENCE_VISUAL_ELEMENTS: Record<string, string> = {
  'general': `Target: Universal appeal for all viewers.
- Clean, relatable imagery without niche-specific elements
- Balanced composition that works across demographics
- Accessible color choices with good contrast
- Friendly but not childish aesthetic`,

  'developers': `Target: Software developers and tech enthusiasts.
- Include subtle code elements: syntax highlighting colors, curly braces {}, angle brackets <>
- Terminal/IDE inspired dark backgrounds with monospace font hints
- Tech icons: git branches, API symbols, database icons floating subtly
- Matrix-style or circuit board patterns in background
- Colors: VS Code dark theme palette, green (#22C55E) on dark`,

  'business': `Target: Business professionals and entrepreneurs.
- Include abstract data visualization: subtle line charts trending up, pie charts
- Professional icons: briefcase, handshake, growth arrows
- Corporate color palette: navy, gold accents, clean whites
- Confidence-inspiring imagery: skyscrapers silhouette, success symbols
- Clean, trustworthy aesthetic without being boring`,

  'students': `Target: Students and learners of all ages.
- Educational symbols: lightbulbs (ideas), books, graduation caps, brain icons
- Encouraging, aspirational mood with bright hopeful colors
- Study-related elements: notebooks, pencils, sticky notes floating
- Growth mindset imagery: stairs, progress bars, checkmarks
- Approachable and motivating visual language`,

  'gamers': `Target: Gaming community and esports fans.
- High-energy dynamic composition with action feel
- RGB lighting effects: rainbow gradients, LED strip glows
- Gaming elements: controller silhouettes, health bars, XP icons
- Competitive aesthetic: flames, speed lines, power-up symbols
- Bold neon colors on dark: electric blue, hot pink, toxic green`,

  'creators': `Target: Content creators and digital artists.
- Creative tools floating: camera, microphone, paint brush, play button
- Multi-platform icons subtly integrated: video, audio, social
- Artistic splashes, gradients, creative chaos organized beautifully  
- Inspiring, aspirational mood with trendy color palettes
- Modern influencer/creator aesthetic`,

  'kids': `Target: Children and family-friendly content.
- Bright, saturated cheerful colors: primary colors, rainbow elements
- Friendly rounded shapes, no sharp edges
- Cartoon-style clouds, stars, hearts, smiley elements
- Safe, wholesome imagery - nothing scary or complex
- Fun, playful, educational aesthetic with high energy`,
};

// Get frame details based on frame size
function getFrameDetails(frameSize: string) {
  const frameMap: Record<string, { width: number; height: number; aspectRatio: string; platform: string; label: string }> = {
    'youtube': { width: 1280, height: 720, aspectRatio: '16:9', platform: 'YouTube', label: 'YouTube Thumbnail' },
    'instagram': { width: 1080, height: 1350, aspectRatio: '4:5', platform: 'Instagram', label: 'Instagram Portrait' },
    'twitter': { width: 1500, height: 500, aspectRatio: '3:1', platform: 'Twitter', label: 'Twitter Banner' },
    'custom': { width: 1280, height: 720, aspectRatio: 'custom', platform: 'Custom', label: 'Custom Size' },
  };
  return frameMap[frameSize] || frameMap['youtube'];
}

/**
 * Build optimized JSON prompt configuration (Best Practices 2025)
 * Based on Gemini documentation: narrative-based, specific, cinematic language
 */
export function buildPromptJson(config: ThumbnailPromptConfig): object {
  const frame = getFrameDetails(config.resolution);
  const styleScene = STYLE_SCENE_DESCRIPTIONS[config.style] || STYLE_SCENE_DESCRIPTIONS['modern-gradient'];
  const audienceElements = AUDIENCE_VISUAL_ELEMENTS[config.audience] || AUDIENCE_VISUAL_ELEMENTS['general'];

  return {
    // Task definition with clear objective
    task: {
      type: "image_generation",
      objective: `Generate a professional ${frame.platform} image`,
      platform: frame.platform
    },
    
    // Image specifications
    image_specs: {
      resolution: `${frame.width}x${frame.height}`,
      aspect_ratio: frame.aspectRatio,
      format: frame.label
    },
    
    // Scene description (narrative-based prompting - Best Practice)
    scene: {
      subject: config.topic,
      visual_style: styleScene,
      audience_elements: audienceElements,
      custom_notes: config.additionalNotes || null
    },
    
    // Typography specifications (critical for thumbnails)
    typography: {
      main_text: {
        content: "Display the topic/title prominently",
        size: "Extra large, occupying 40-60% of the image width",
        weight: "Bold or Extra Bold",
        style: "Impact, Bebas Neue, Montserrat Black, or similar display font",
        color: "High contrast against background (white on dark, dark on light)",
        effects: ["Subtle drop shadow for depth", "Optional outline for readability"]
      },
      placement: {
        position: "Center or rule-of-thirds placement",
        hierarchy: "Title dominates, supporting elements secondary",
        breathing_room: "Adequate padding from edges (safe zone)"
      }
    },
    
    // Composition rules
    composition: {
      focal_point: "Text as primary focus with supporting visuals",
      balance: "Asymmetric or centered based on style",
      depth: "Layered elements create visual interest",
      contrast: "High contrast for thumbnail visibility at small sizes"
    },
    
    // Quality requirements
    quality: {
      rendering: "Photorealistic or stylized based on style choice",
      details: "Sharp, crisp edges on text and key elements",
      lighting: "Professional lighting setup matching the style",
      finish: "Production-ready, no artifacts or blur"
    }
  };
}

/**
 * Build optimized MODULAR prompt for Gemini Image Generation
 * Based on Best Practices 2025 - Narrative description, not keyword lists
 * Structure: SUBJECT → COMPOSITION → STYLE → CONSTRAINTS
 */
export function buildCopyPrompt(config: ThumbnailPromptConfig): string {
  const frame = getFrameDetails(config.resolution);
  const styleScene = STYLE_SCENE_DESCRIPTIONS[config.style] || STYLE_SCENE_DESCRIPTIONS['modern-gradient'];
  
  // Modular prompt with text included - Gemini 3 Pro handles text well
  return `[SUBJECT]: A ${frame.platform} thumbnail about "${config.topic}" with the title displayed prominently in large, bold typography.

[COMPOSITION]: ${frame.aspectRatio} aspect ratio. Title "${config.topic}" centered, large and readable. Keep ALL important content (especially the title) inside a 20% safe margin from all edges. No element may touch or go beyond the edges.

[STYLE]: ${styleScene}

[TEXT]: Title "${config.topic}" in bold Impact/Bebas Neue font. White text with dark shadow on dark backgrounds, or dark text on light backgrounds. Text must be crisp and readable.

[CONSTRAINTS]: Single cohesive image. No watermarks. No cut-off elements. Do not crop or clip the title or any important element; keep extra breathing room near borders.${config.additionalNotes ? ` ${config.additionalNotes}` : ''}`
}


