"use client";

import { useState } from 'react';
import { useDesignStore } from '@/store/design-store';
import { Save, Bookmark, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function TemplateManager() {
  const { templates, saveTemplate, loadTemplate, deleteTemplate } = useDesignStore();
  const [isAdding, setIsAdding] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [loadedTemplateId, setLoadedTemplateId] = useState<string | null>(null);

  const handleSaveTemplate = () => {
    if (templateName.trim()) {
      saveTemplate(templateName.trim());
      setTemplateName('');
      setIsAdding(false);
    }
  };

  const handleLoadTemplate = (templateId: string) => {
    loadTemplate(templateId);
    setLoadedTemplateId(templateId);
    
    // Reset loaded indicator after 2 seconds
    setTimeout(() => {
      setLoadedTemplateId(null);
    }, 2000);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Bookmark className="h-3.5 w-3.5 text-gray-600" />
          <h3 className="text-xs font-semibold text-gray-900">Templates</h3>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="text-xs font-medium text-purple-600 hover:text-purple-700 transition-colors"
        >
          {isAdding ? 'Cancel' : '+ New'}
        </button>
      </div>

      {/* Save New Template Form */}
      {isAdding && (
        <div className="mb-3 space-y-2 rounded-lg bg-purple-50 p-2.5 border border-purple-200">
          <Input
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Template name..."
            className="h-8 text-xs"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSaveTemplate();
              }
            }}
          />
          <Button
            onClick={handleSaveTemplate}
            disabled={!templateName.trim()}
            className="w-full h-7 text-xs bg-purple-600 hover:bg-purple-700"
          >
            <Save className="mr-1.5 h-3 w-3" />
            Save Template
          </Button>
        </div>
      )}

      {/* Templates List */}
      {templates.length === 0 ? (
        <div className="text-center py-6 text-xs text-gray-500">
          <Bookmark className="h-8 w-8 mx-auto mb-2 opacity-20" />
          <p>No templates saved yet.</p>
          <p className="mt-1">Create one to reuse your design!</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`group rounded-lg border p-2.5 transition-all ${
                loadedTemplateId === template.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-gray-50 hover:border-purple-300 hover:bg-purple-50'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-semibold text-gray-900 truncate">
                      {template.name}
                    </h4>
                    {loadedTemplateId === template.id && (
                      <Check className="h-3 w-3 text-green-600 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {formatDate(template.createdAt)}
                  </p>
                  
                  {/* Template Config Preview */}
                  <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 rounded bg-white px-1.5 py-0.5 text-[10px] text-gray-600 border border-gray-200">
                      <span className="font-medium">{template.config.frameSize}</span>
                    </span>
                    <div 
                      className="h-3 w-3 rounded border border-gray-300"
                      style={{ background: template.config.customGradient || template.config.backgroundColor }}
                    />
                    <span className="text-[10px] text-gray-500">
                      {template.config.fontFamily.replace('font-', '')}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1">
                  <button
                    onClick={() => handleLoadTemplate(template.id)}
                    className="rounded px-2 py-1 text-xs font-medium text-purple-600 hover:bg-purple-100 transition-colors"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => deleteTemplate(template.id)}
                    className="rounded p-1 text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete template"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
