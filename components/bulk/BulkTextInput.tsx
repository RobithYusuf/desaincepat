"use client";

import { useBulkStore } from '@/store/bulk-store';
import { Trash2 } from 'lucide-react';

export function BulkTextInput() {
  const { rawInput, setRawInput, bulkItems, clearAllItems } = useBulkStore();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-700">Text (satu per baris)</label>
        {bulkItems.length > 0 && (
          <button
            onClick={clearAllItems}
            className="flex items-center gap-1 text-[10px] text-red-500 hover:text-red-600"
          >
            <Trash2 className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      <textarea
        value={rawInput}
        onChange={(e) => setRawInput(e.target.value)}
        placeholder="Tutorial React untuk Pemula&#10;Belajar Next.js dari Nol&#10;Tips CSS yang Wajib Tahu"
        className="w-full h-32 p-2.5 text-xs border border-gray-300 rounded-lg resize-none focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 placeholder:text-gray-400"
      />

      <p className="text-[10px] text-gray-500">
        {bulkItems.length > 0 ? (
          <span className="text-green-600 font-medium">{bulkItems.length} items</span>
        ) : (
          'Masukkan text, satu per baris'
        )}
      </p>
    </div>
  );
}
