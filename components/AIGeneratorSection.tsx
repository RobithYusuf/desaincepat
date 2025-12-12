"use client";

import { useState, useEffect } from 'react';
import { Loader2, Settings, AlertCircle, Wand2, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ApiKeySettingsModal } from './ApiKeySettingsModal';
import { buildCopyPrompt } from '@/lib/prompt-templates';

// Style options with descriptions (Indonesian)
const STYLE_OPTIONS = [
  { value: 'modern-gradient', label: 'Modern Gradient', desc: 'Gradien purple-blue/orange-pink, glassmorphism, bokeh' },
  { value: 'minimalist', label: 'Minimalist', desc: 'Bersih, 80% ruang kosong, Apple-style' },
  { value: 'bold-colorful', label: 'Bold & Colorful', desc: 'Warna saturasi tinggi, color blocks, eye-catching' },
  { value: 'professional', label: 'Professional', desc: 'Navy-gold, korporat, chart abstrak' },
  { value: 'playful', label: 'Playful', desc: 'Cerah ceria, confetti, bubbly shapes' },
  { value: 'dark-mode', label: 'Dark Mode', desc: 'Gelap + neon glow, tech/developer vibe' },
  { value: 'neon-glow', label: 'Neon Glow', desc: 'Cyberpunk, neon pink-cyan, light bloom' },
  { value: 'retro-vintage', label: 'Retro/Vintage', desc: '70s-80s, film grain, warna muted warm' },
  { value: 'cinematic', label: 'Cinematic', desc: 'Teal-orange grading, movie poster epic' },
  { value: '3d-render', label: '3D Render', desc: 'Isometric 3D, glossy objects, Pixar-style' },
] as const;

// Audience options with descriptions (Indonesian)
const AUDIENCE_OPTIONS = [
  { value: 'general', label: 'General', desc: 'Universal, semua kalangan' },
  { value: 'developers', label: 'Developers', desc: 'Code syntax, terminal, VS Code vibes' },
  { value: 'business', label: 'Business', desc: 'Chart, growth arrows, corporate trust' },
  { value: 'students', label: 'Students', desc: 'Books, lightbulb ideas, motivational' },
  { value: 'gamers', label: 'Gamers', desc: 'RGB glow, controller, esports energy' },
  { value: 'creators', label: 'Creators', desc: 'Camera, mic, creative tools floating' },
  { value: 'kids', label: 'Kids/Family', desc: 'Cerah, rounded shapes, fun & safe' },
] as const;
import {
  hasApiKey,
  generateThumbnailImage,
  findBestAspectRatio,
  getRecommendedFrameSize,
  ASPECT_RATIO_RESOLUTIONS,
} from '@/lib/gemini-client';
import { useDesignStore } from '@/store/design-store';
import { useHistoryStore } from '@/store/history-store';

export function AIGeneratorSection() {
  const { frameSize, setBackgroundMode, setCustomGradient, getFrameDimensions, setIsAIGenerating, setBackgroundSizing } = useDesignStore();
  const { addItem: addToHistory } = useHistoryStore();
  
  // Form state
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('modern-gradient');
  const [audience, setAudience] = useState('general');
  const [qualityMode, setQualityMode] = useState(false); // Quick Mode by default

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [apiKeyExists, setApiKeyExists] = useState(false);
  const [lastGeneratedSize, setLastGeneratedSize] = useState<string | null>(null);

  // Settings modal
  const [showSettings, setShowSettings] = useState(false);

  // Check API key on mount
  useEffect(() => {
    setApiKeyExists(hasApiKey());
  }, [showSettings]);

  // Build config for prompt generation
  const buildConfig = () => ({
    topic: topic.trim(),
    style,
    audience,
    resolution: frameSize,
  });

  // Get frame dimensions
  const { width: frameWidth, height: frameHeight } = getFrameDimensions();

  // Get best aspect ratio for current frame size (auto-detect for custom)
  const aspectRatio = findBestAspectRatio(frameWidth, frameHeight);
  
  // Check if frame size is supported
  const frameSizeInfo = getRecommendedFrameSize(frameWidth, frameHeight);
  const maxRes = ASPECT_RATIO_RESOLUTIONS[aspectRatio];

  // Get frame label for prompt
  const getFrameLabel = (): string => {
    switch (frameSize) {
      case 'youtube': return 'YouTube Thumbnail';
      case 'instagram': return 'Instagram Post';
      case 'twitter': return 'Twitter/X Banner';
      case 'custom': return 'Custom Image';
      default: return 'Image';
    }
  };

  // Generate thumbnail and apply to canvas
  const handleGenerate = async () => {
    if (!topic.trim() || !apiKeyExists) return;
    
    setIsGenerating(true);
    setIsAIGenerating(true); // Show loading on canvas
    setError(null);
    setGenerationStep('');

    try {
      const frameLabel = getFrameLabel();
      const resolution = qualityMode ? '4K' : '2K'; // Quick: 2K, Quality: 4K
      let finalPrompt: string;

      // Build prompt using modular structure (Nano Banana Best Practice 2025)
      // Both modes use same prompt - difference is only resolution (2K vs 4K)
      const basePrompt = buildCopyPrompt(buildConfig());
      const resolutionLabel = qualityMode ? '4K' : '2K';
      const dimensions = qualityMode ? `${maxRes.width}×${maxRes.height}` : `${Math.round(maxRes.width/2)}×${Math.round(maxRes.height/2)}`;
      
      finalPrompt = `${basePrompt}

[OUTPUT]: ${frameLabel}, ${dimensions}px (${resolutionLabel}), ${aspectRatio} ${frameHeight > frameWidth ? 'portrait' : 'landscape'}.`;

      setGenerationStep('Generating image...');
      const result = await generateThumbnailImage(finalPrompt, aspectRatio, resolution as '2K' | '4K');

      if (result.success) {
        // Apply generated image as canvas background
        const dataUrl = `data:${result.data.mimeType};base64,${result.data.base64}`;
        setBackgroundMode('gradient');
        setCustomGradient(`url(${dataUrl})`);
        setBackgroundSizing('cover'); // Fill canvas completely (may crop edges slightly)
        
        // Calculate and display image size
        const sizeBytes = new Blob([dataUrl]).size;
        const sizeKB = (sizeBytes / 1024).toFixed(2);
        const sizeMB = (sizeBytes / (1024 * 1024)).toFixed(2);
        setLastGeneratedSize(`${sizeMB} MB (${sizeKB} KB)`);
        console.log(`[AI Generator] Image size: ${sizeMB} MB (${sizeKB} KB) - Resolution: ${resolution}`);
        
        // Only save to history if image is small enough (< 2MB to prevent quota issues)
        const maxHistorySize = 2 * 1024 * 1024; // 2MB
        if (sizeBytes < maxHistorySize) {
          try {
            addToHistory({
              imageDataUrl: dataUrl,
              topic: topic.trim(),
              style,
              audience,
              frameSize,
              resolution,
              mode: qualityMode ? 'quality' : 'quick',
            });
          } catch (storageError) {
            console.warn('[AI Generator] Failed to save to history:', storageError);
          }
        } else {
          console.log(`[AI Generator] Image too large for history (${sizeMB} MB > 2 MB), skipping save`);
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }

    setGenerationStep('');
    setIsGenerating(false);
    setIsAIGenerating(false); // Hide loading on canvas
  };

  const isFormValid = topic.trim().length > 0;

  return (
    <>
      <div className="space-y-3">
        {/* API Key Warning */}
        {!apiKeyExists && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-2">
            <div className="flex items-start gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-yellow-800">
                <span className="font-medium">API key required.</span>{' '}
                <button 
                  onClick={() => setShowSettings(true)} 
                  className="underline hover:no-underline"
                >
                  Setup now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Frame Size Info */}
        {apiKeyExists && (
          <div className={`rounded-lg border p-2 ${frameSizeInfo.supported ? 'border-gray-200 bg-gray-50' : 'border-orange-200 bg-orange-50'}`}>
            <div className="text-[10px] text-gray-600">
              <div className="flex justify-between">
                <span>Frame: {frameWidth}×{frameHeight}</span>
                <span className="font-medium">Ratio: {aspectRatio}</span>
              </div>
              <div className="flex justify-between mt-0.5">
                <span>AI Max: {maxRes.width}×{maxRes.height}</span>
                <span className={frameSizeInfo.supported ? 'text-green-600' : 'text-orange-600'}>
                  {frameSizeInfo.supported ? '✓ OK' : '⚠ Oversized'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Topic Input */}
        <div className="space-y-1">
          <Label htmlFor="ai-topic" className="text-xs text-gray-700">
            Describe your thumbnail
          </Label>
          <Textarea
            id="ai-topic"
            value={topic}
            onChange={(e) => { setTopic(e.target.value); setError(null); }}
            placeholder="e.g., Tutorial React Hooks untuk pemula, dengan visual coding dan warna biru tech"
            className="min-h-[60px] text-xs resize-none"
            disabled={isGenerating}
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey && isFormValid && apiKeyExists && !isGenerating) {
                e.preventDefault();
                handleGenerate();
              }
            }}
          />
          <p className="text-[10px] text-gray-400">Ctrl+Enter untuk generate</p>
        </div>

        {/* Style Selection */}
        <div className="space-y-1">
          <Label className="text-xs text-gray-700">Style</Label>
          <Select value={style} onValueChange={setStyle} disabled={isGenerating}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue>
                {STYLE_OPTIONS.find(s => s.value === style)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {STYLE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs py-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{opt.label}</span>
                    <span className="text-[10px] text-gray-500">{opt.desc}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Audience Selection */}
        <div className="space-y-1">
          <Label className="text-xs text-gray-700">Target Audience</Label>
          <Select value={audience} onValueChange={setAudience} disabled={isGenerating}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue>
                {AUDIENCE_OPTIONS.find(a => a.value === audience)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {AUDIENCE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs py-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{opt.label}</span>
                    <span className="text-[10px] text-gray-500">{opt.desc}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quality Mode Toggle */}
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-2">
          <div className="flex items-center gap-2">
            {qualityMode ? (
              <Sparkles className="h-4 w-4 text-purple-500" />
            ) : (
              <Zap className="h-4 w-4 text-yellow-500" />
            )}
            <div>
              <p className="text-xs font-medium text-gray-700">
                {qualityMode ? 'Quality Mode' : 'Quick Mode'}
              </p>
              <p className="text-[10px] text-gray-500">
                {qualityMode ? '4K + AI prompt optimization (~1-3 min)' : '2K fast generation (~15-30 sec)'}
              </p>
            </div>
          </div>
          <Switch
            checked={qualityMode}
            onCheckedChange={setQualityMode}
            disabled={isGenerating}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-2">
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}

        {/* Last Generated Size Info */}
        {lastGeneratedSize && !isGenerating && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-2">
            <p className="text-xs text-blue-700">
              <span className="font-medium">Last image size:</span> {lastGeneratedSize}
            </p>
          </div>
        )}

        {/* Generate Button + Settings */}
        <div className="flex gap-2">
          <Button
            onClick={handleGenerate}
            disabled={!isFormValid || !apiKeyExists || isGenerating}
            className={`flex-1 h-9 text-xs ${
              qualityMode 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                {generationStep || 'Generating...'}
              </>
            ) : (
              <>
                {qualityMode ? (
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                ) : (
                  <Zap className="h-3.5 w-3.5 mr-1.5" />
                )}
                {qualityMode ? 'Generate (Quality)' : 'Generate (Quick)'}
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowSettings(true)}
            className="h-9 w-9 flex-shrink-0"
            title="API Key Settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Settings Modal */}
      <ApiKeySettingsModal 
        open={showSettings} 
        onOpenChange={(open) => {
          setShowSettings(open);
          if (!open) setApiKeyExists(hasApiKey());
        }} 
      />
    </>
  );
}
