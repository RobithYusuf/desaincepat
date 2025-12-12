"use client";

import { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, ExternalLink, Loader2, Settings, Download, ImageIcon, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ApiKeySettingsModal } from './ApiKeySettingsModal';
import {
  STYLE_OPTIONS,
  AUDIENCE_OPTIONS,
  FRAME_SIZE_OPTIONS,
  buildCopyPrompt,
  buildPromptJson,
} from '@/lib/prompt-templates';
import {
  hasApiKey,
  generateThumbnailImage,
  generateOptimalPrompt,
  GeneratedImage,
} from '@/lib/gemini-client';
import { useDesignStore } from '@/store/design-store';

interface PromptGeneratorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GEMINI_STUDIO_URL = 'https://aistudio.google.com/app/prompts/new_chat';

export function PromptGeneratorModal({ open, onOpenChange }: PromptGeneratorModalProps) {
  // Get frame size from design store
  const { frameSize, getFrameDimensions } = useDesignStore();
  const { width, height } = getFrameDimensions();
  
  // Form state
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('modern-gradient');
  const [audience, setAudience] = useState('general');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Copy prompt state
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [promptError, setPromptError] = useState<string | null>(null);

  // AI Generate state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [apiKeyExists, setApiKeyExists] = useState(false);

  // Settings modal
  const [showSettings, setShowSettings] = useState(false);

  // Check API key on mount
  useEffect(() => {
    if (open) {
      setApiKeyExists(hasApiKey());
    }
  }, [open, showSettings]);

  // Build JSON config using frame size from canvas
  const buildConfig = () => ({
    topic: topic.trim(),
    style,
    audience,
    resolution: frameSize, // Use frame size from canvas
    additionalNotes: additionalNotes.trim() || undefined,
  });

  // Build fallback prompt (tanpa AI)
  const buildFallbackPrompt = () => buildCopyPrompt(buildConfig());

  // Generate prompt using AI
  const handleGeneratePrompt = async () => {
    if (!topic.trim()) return;
    
    // Jika tidak ada API key, gunakan fallback template
    if (!apiKeyExists) {
      setGeneratedPrompt(buildFallbackPrompt());
      return;
    }

    setIsGeneratingPrompt(true);
    setPromptError(null);

    const jsonConfig = buildPromptJson(buildConfig());
    const result = await generateOptimalPrompt(jsonConfig);

    if (result.success) {
      setGeneratedPrompt(result.prompt);
    } else {
      setPromptError(result.error);
      // Fallback ke template jika AI gagal
      setGeneratedPrompt(buildFallbackPrompt());
    }

    setIsGeneratingPrompt(false);
  };

  // Copy to clipboard
  const handleCopy = async () => {
    const promptToCopy = generatedPrompt || buildFallbackPrompt();
    try {
      await navigator.clipboard.writeText(promptToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = promptToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Open Gemini Studio
  const handleOpenGemini = () => {
    window.open(GEMINI_STUDIO_URL, '_blank', 'noopener,noreferrer');
  };

  // Copy and redirect
  const handleCopyAndGo = async () => {
    await handleCopy();
    setTimeout(() => handleOpenGemini(), 300);
  };

  // Generate with AI
  const handleAIGenerate = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    setAiError(null);
    setGeneratedImage(null);

    // Gunakan prompt yang sudah di-generate atau fallback
    const prompt = generatedPrompt || buildFallbackPrompt();
    const result = await generateThumbnailImage(prompt);

    if (result.success) {
      setGeneratedImage(result.data);
    } else {
      setAiError(result.error);
    }

    setIsGenerating(false);
  };

  // Download generated image
  const handleDownloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = `data:${generatedImage.mimeType};base64,${generatedImage.base64}`;
    link.download = `thumbnail-${topic.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.click();
  };

  // Reset form
  const handleReset = () => {
    setGeneratedPrompt('');
    setGeneratedImage(null);
    setAiError(null);
    setPromptError(null);
  };

  const isFormValid = topic.trim().length > 0;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-green-500" />
                AI Thumbnail Generator
              </span>
              <Button variant="ghost" size="sm" onClick={() => setShowSettings(true)} className="text-gray-500">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          {/* Form */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="topic" className="text-sm">Topik / Judul *</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => { setTopic(e.target.value); handleReset(); }}
                placeholder="Contoh: Tutorial React Hooks"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1.5">
                <Label className="text-sm">Gaya</Label>
                <Select value={style} onValueChange={(v) => { setStyle(v); handleReset(); }}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STYLE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm">Audience</Label>
                <Select value={audience} onValueChange={(v) => { setAudience(v); handleReset(); }}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AUDIENCE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm">Frame</Label>
                <div className="h-9 flex items-center px-3 rounded-lg border border-gray-200 bg-gray-50 text-xs font-medium text-gray-700">
                  {width}×{height} ({frameSize})
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes" className="text-sm">Catatan (opsional)</Label>
              <Input
                id="notes"
                value={additionalNotes}
                onChange={(e) => { setAdditionalNotes(e.target.value); handleReset(); }}
                placeholder="Contoh: Warna biru, tambah icon code"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="copy" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="copy">Copy Prompt</TabsTrigger>
              <TabsTrigger value="generate">AI Generate</TabsTrigger>
            </TabsList>

            {/* Copy Prompt Tab */}
            <TabsContent value="copy" className="space-y-3 mt-3">
              {!apiKeyExists && (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-2.5">
                  <p className="text-xs text-yellow-800">
                    <strong>Tanpa API key:</strong> Menggunakan template prompt standar.{' '}
                    <button onClick={() => setShowSettings(true)} className="underline">Setup API Key</button> untuk prompt AI yang lebih optimal.
                  </p>
                </div>
              )}

              {!generatedPrompt && !isGeneratingPrompt ? (
                <Button onClick={handleGeneratePrompt} disabled={!isFormValid} className="w-full">
                  {apiKeyExists ? 'Generate Prompt dengan AI' : 'Generate Prompt'}
                </Button>
              ) : isGeneratingPrompt ? (
                <Button disabled className="w-full">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  AI sedang generate prompt...
                </Button>
              ) : (
                <>
                  {promptError && (
                    <div className="rounded-lg border border-orange-200 bg-orange-50 p-2.5">
                      <p className="text-xs text-orange-800">
                        <strong>AI gagal:</strong> {promptError}. Menggunakan template fallback.
                      </p>
                    </div>
                  )}

                  {apiKeyExists && !promptError && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">AI Generated</span>
                    </div>
                  )}
                  
                  <Textarea value={generatedPrompt} readOnly className="h-36 font-mono text-xs resize-none" />

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleOpenGemini} className="flex-1">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Buka Gemini
                    </Button>
                    <Button onClick={handleCopy} className="flex-1">
                      {copied ? <Check className="h-4 w-4 mr-1 text-green-500" /> : <Copy className="h-4 w-4 mr-1" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>

                  <Button variant="outline" onClick={handleReset} className="w-full text-gray-600 border-gray-300 hover:bg-gray-100" size="sm">
                    Reset
                  </Button>
                </>
              )}
            </TabsContent>

            {/* AI Generate Tab */}
            <TabsContent value="generate" className="space-y-3 mt-3">
              {!apiKeyExists && (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-yellow-800">API key belum diatur</p>
                      <Button variant="link" size="sm" onClick={() => setShowSettings(true)} className="p-0 h-auto text-yellow-700">
                        Setup API Key
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {!generatedImage && !aiError && (
                <Button
                  onClick={handleAIGenerate}
                  disabled={!isFormValid || !apiKeyExists || isGenerating}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Generate Thumbnail
                    </>
                  )}
                </Button>
              )}

              {aiError && (
                <div className="space-y-3">
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <p className="text-sm text-red-800">{aiError}</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setAiError(null)} className="w-full">
                    Coba Lagi
                  </Button>
                </div>
              )}

              {generatedImage && (
                <div className="space-y-3">
                  <div className="rounded-lg border overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`data:${generatedImage.mimeType};base64,${generatedImage.base64}`}
                      alt="Generated thumbnail"
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleDownloadImage} className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" onClick={handleReset} className="flex-1">
                      Generate Lagi
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <ApiKeySettingsModal open={showSettings} onOpenChange={(open) => {
        setShowSettings(open);
        if (!open) setApiKeyExists(hasApiKey());
      }} />
    </>
  );
}
