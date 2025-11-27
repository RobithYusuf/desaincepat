"use client";

import { useEffect, useCallback } from 'react';
import { Undo2, Redo2 } from 'lucide-react';
import { useDesignStore } from '@/store/design-store';

export function UndoRedoControls() {
  const { undo, redo, canUndo, canRedo, history, historyIndex } = useDesignStore();

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Check if focus is on an input/textarea
    const target = e.target as HTMLElement;
    const isInputFocused = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
    
    // Allow undo/redo in inputs for text, but use native behavior
    // For other elements, use our custom undo/redo
    if (isInputFocused) return;

    // Ctrl+Z or Cmd+Z for undo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      if (canUndo()) undo();
    }

    // Ctrl+Y or Cmd+Shift+Z for redo
    if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
      e.preventDefault();
      if (canRedo()) redo();
    }
  }, [undo, redo, canUndo, canRedo]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const isUndoDisabled = !canUndo();
  const isRedoDisabled = !canRedo();

  return (
    <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg">
      <button
        onClick={() => canUndo() && undo()}
        disabled={isUndoDisabled}
        className="flex h-9 w-9 items-center justify-center rounded text-gray-600 transition-colors hover:bg-gray-100 active:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        title="Undo (Ctrl+Z)"
        aria-label="Undo"
      >
        <Undo2 className="h-4 w-4" />
      </button>
      
      <button
        onClick={() => canRedo() && redo()}
        disabled={isRedoDisabled}
        className="flex h-9 w-9 items-center justify-center rounded text-gray-600 transition-colors hover:bg-gray-100 active:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        title="Redo (Ctrl+Y)"
        aria-label="Redo"
      >
        <Redo2 className="h-4 w-4" />
      </button>
    </div>
  );
}
