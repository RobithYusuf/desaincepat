"use client";

import { useState, useEffect } from 'react';
import { Key, ExternalLink, Check, X, Loader2, Eye, EyeOff, Trash2 } from 'lucide-react';
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
  getStoredApiKey,
  saveApiKey,
  removeApiKey,
  testApiKey,
} from '@/lib/gemini-client';

interface ApiKeySettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApiKeySettingsModal({ open, onOpenChange }: ApiKeySettingsModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ valid: boolean; error?: string } | null>(null);
  const [hasExistingKey, setHasExistingKey] = useState(false);

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
      setTestResult(null);
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
    setHasExistingKey(true);
    onOpenChange(false);
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Key Gemini
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
            <p className="text-sm text-blue-800 mb-2">
              Dapatkan API key gratis dari Google AI Studio:
            </p>
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
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

          {testResult && (
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
