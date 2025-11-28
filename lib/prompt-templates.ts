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

// Detailed style descriptions with cinematic language (Best Practice 2025)
const STYLE_SCENE_DESCRIPTIONS: Record<string, string> = {
  'modern-gradient': 'A sleek, contemporary scene with smooth flowing gradient colors transitioning seamlessly across the background. Rich, saturated hues blend from deep purple to vibrant blue or warm orange to pink. Clean geometric shapes float subtly in the background. Studio-quality lighting with soft highlights.',
  'minimalist': 'A clean, elegant composition with generous negative space. Pure white or soft neutral background with minimal visual elements. Sharp, crisp edges and perfect alignment. Soft, even lighting that creates a sense of calm sophistication.',
  'bold-colorful': 'An explosion of vibrant, saturated colors with high contrast and dynamic energy. Bold color blocking with complementary hues. Dramatic shadows and highlights create depth. Elements pop with intensity and visual impact.',
  'professional': 'A refined corporate aesthetic with trustworthy blue and sophisticated gray tones. Clean lines, subtle gradients, and professional polish. Soft directional lighting creating gentle shadows. Business-appropriate elegance.',
  'playful': 'A fun, energetic scene bursting with bright cheerful colors. Rounded shapes, bouncy elements, and friendly visual appeal. Warm, inviting lighting with playful shadows. Cartoon-like charm with professional execution.',
  'dark-mode': 'A moody, sophisticated dark background with deep blacks and charcoal grays. Neon accent colors (cyan, magenta, electric blue) provide striking contrast. Subtle glow effects and rim lighting. Modern tech aesthetic with depth.',
  'neon-glow': 'A cyberpunk-inspired scene with intense neon lights cutting through darkness. Vivid pink, blue, and purple glows with realistic light bloom effects. Reflective surfaces catching the neon ambiance. Futuristic urban energy.',
  'retro-vintage': 'A nostalgic scene with warm, muted color palette reminiscent of vintage photography. Soft grain texture, faded edges, and classic typography styles. Golden hour lighting with warm orange and brown undertones.',
  'cinematic': 'A dramatic, movie-poster quality composition with professional cinematography. Cinematic aspect ratio feel, dramatic lighting with deep shadows and bright highlights. Rich color grading like a Hollywood production.',
  '3d-render': 'A polished 3D rendered scene with realistic materials and lighting. Smooth surfaces, accurate reflections, and professional CGI quality. Global illumination creating natural light bounce. Modern Pixar-quality aesthetic.',
};

// Audience-specific visual elements
const AUDIENCE_VISUAL_ELEMENTS: Record<string, string> = {
  'general': 'Universal visual appeal with relatable imagery. Balanced composition suitable for all ages. Clear, accessible design language.',
  'developers': 'Tech-inspired elements like code snippets, terminal windows, or abstract circuit patterns. Modern IDE color schemes. Binary or matrix-style accents.',
  'business': 'Professional imagery with charts, upward trends, or corporate iconography. Clean data visualization elements. Confidence-inspiring visual hierarchy.',
  'students': 'Educational elements like books, lightbulbs, or brain imagery. Encouraging and aspirational visuals. Clear learning-focused design.',
  'gamers': 'Dynamic gaming elements with action-oriented composition. RGB lighting effects, controller or game-inspired graphics. High-energy visual intensity.',
  'creators': 'Creative tools imagery, artistic elements, or content creation visuals. Inspiration-focused design with creative flair. Platform-agnostic appeal.',
  'kids': 'Bright, friendly characters or elements. Safe, cheerful imagery with rounded shapes. Educational yet entertaining visual approach.',
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
 * Build optimized narrative prompt for Gemini image generation (Best Practices 2025)
 * Narrative-only format for better image generation results
 */
export function buildCopyPrompt(config: ThumbnailPromptConfig): string {
  const frame = getFrameDetails(config.resolution);
  const styleScene = STYLE_SCENE_DESCRIPTIONS[config.style] || STYLE_SCENE_DESCRIPTIONS['modern-gradient'];
  const audienceElements = AUDIENCE_VISUAL_ELEMENTS[config.audience] || AUDIENCE_VISUAL_ELEMENTS['general'];
  
  return `Create a professional ${frame.platform} image (${frame.width}×${frame.height}, ${frame.aspectRatio} aspect ratio).

SCENE: ${styleScene}

SUBJECT: "${config.topic}"
${audienceElements}${config.additionalNotes ? `\n${config.additionalNotes}` : ''}

TEXT REQUIREMENTS (CRITICAL):
• Title "${config.topic}" must be LARGE and BOLD (40-60% of image width)
• Use Impact, Bebas Neue, or Montserrat Black font
• HIGH CONTRAST colors (white on dark or dark on light background)
• Add subtle drop shadow for depth
• Text must be readable even at small sizes

OUTPUT: Single high-quality ${frame.label} image, production-ready for ${frame.platform}.`;
}


