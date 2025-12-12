"use client";

import { useState, useEffect } from 'react';
import { Key, ExternalLink, Check, X, Loader2, Eye, EyeOff, Trash2, Zap, Crown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  getStoredApiKey,
  saveApiKey,
  removeApiKey,
  testApiKey,
  getStoredModel,
  saveModel,
  IMAGE_MODELS,
  type ImageModelId,
} from '@/lib/gemini-client';

interface ApiKeySettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categoryConfig = {
  quality: { label: 'Recommended', color: 'bg-green-100 text-green-700 border-green-200', icon: Zap },
  premium: { label: 'Premium', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Crown },
};

export function ApiKeySettingsModal({ open, onOpenChange }: ApiKeySettingsModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ valid: boolean; error?: string } | null>(null);
  const [hasExistingKey, setHasExistingKey] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ImageModelId>('gemini-2.5-flash-image');

  useEffect(() => {
    if (open) {
      const existingKey = getStoredApiKey();
      if (existingKey) {
        setApiKey(existingKey);
        setHasExistingKey(true);
      } else {
        setApiKey('');
        setHasExistingKey(false);
      }
      setSelectedModel(getStoredModel());
      setTestResult(null);
      setSaveSuccess(false);
    }
  }, [open]);

  const handleTestKey = async () => {
    if (!apiKey.trim()) return;
    setIsTesting(true);
    setTestResult(null);
    const result = await testApiKey(apiKey.trim());
    setTestResult(result);
    setIsTesting(false);
  };

  const handleSave = () => {
    if (!apiKey.trim()) return;
    saveApiKey(apiKey.trim());
    saveModel(selectedModel);
    setHasExistingKey(true);
    setSaveSuccess(true);
  };

  const handleModelChange = (modelId: ImageModelId) => {
    setSelectedModel(modelId);
    saveModel(modelId);
  };

  const handleRemove = () => {
    removeApiKey();
    setApiKey('');
    setHasExistingKey(false);
    setTestResult(null);
  };

  const maskedKey = apiKey 
    ? `${apiKey.slice(0, 6)}${'•'.repeat(Math.min(20, apiKey.length - 10))}${apiKey.slice(-4)}`
    : '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Pengaturan AI Generator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-green-200 bg-green-50 p-3">
            <p className="text-sm text-green-800 mb-2">
              Dapatkan API key gratis dari Google AI Studio:
            </p>
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-800"
            >
              <ExternalLink className="h-4 w-4" />
              Dapatkan API Key
            </a>
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showKey ? 'text' : 'password'}
                value={showKey ? apiKey : (hasExistingKey && apiKey ? maskedKey : apiKey)}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setTestResult(null);
                }}
                placeholder="AIzaSy..."
                className="pr-20"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                {hasExistingKey && (
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="p-1 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <Label>Pilih Model AI</Label>
            <Select value={selectedModel} onValueChange={(value) => handleModelChange(value as ImageModelId)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih model...">
                  {(() => {
                    const model = IMAGE_MODELS.find(m => m.id === selectedModel);
                    if (!model) return 'Pilih model...';
                    const config = categoryConfig[model.category];
                    return (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{model.name}</span>
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${config.color}`}>
                          {config.label}
                        </span>
                        <span className={`text-xs ${model.pricePerImage === 0 ? 'text-green-600' : 'text-gray-500'}`}>
                          {model.price}
                        </span>
                      </div>
                    );
                  })()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {IMAGE_MODELS.map((model) => {
                  const config = categoryConfig[model.category];
                  const IconComponent = config.icon;
                  
                  return (
                    <SelectItem key={model.id} value={model.id} className="py-2.5">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{model.name}</span>
                          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${config.color}`}>
                            <IconComponent className="h-2.5 w-2.5" />
                            {config.label}
                          </span>
                          {model.supports4K && (
                            <span className="text-[10px] text-purple-600 font-medium bg-purple-50 px-1 rounded">4K</span>
                          )}
                          <span className={`text-xs font-semibold ml-auto ${model.pricePerImage === 0 ? 'text-green-600' : 'text-gray-500'}`}>
                            {model.price}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{model.description}</p>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {testResult && !saveSuccess && (
            <div className={`rounded-lg p-3 ${testResult.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center gap-2">
                {testResult.valid ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800">API key valid!</span>
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-800">{testResult.error}</span>
                  </>
                )}
              </div>
            </div>
          )}

          {saveSuccess && (
            <div className="rounded-lg p-4 bg-green-50 border border-green-200">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800">API Key berhasil disimpan!</p>
                  <p className="text-xs text-green-600 mt-1">Anda sekarang dapat menggunakan AI Generator</p>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button 
                    variant="outline"
                    onClick={() => { setSaveSuccess(false); handleTestKey(); }}
                    disabled={isTesting}
                  >
                    {isTesting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Test API
                  </Button>
                  <Button 
                    onClick={() => onOpenChange(false)} 
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Tutup
                  </Button>
                </div>
              </div>
            </div>
          )}

          {!saveSuccess && (
            <>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleTestKey} disabled={!apiKey.trim() || isTesting} className="flex-1">
                  {isTesting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Test
                </Button>
                <Button onClick={handleSave} disabled={!apiKey.trim()} className="flex-1">
                  Simpan
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                API key disimpan di browser (localStorage)
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
