"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import { Canvas } from "@/components/Canvas";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { FrameSizePaddingControls } from "@/components/FrameSizePaddingControls";
import { ZoomControls } from "@/components/ZoomControls";
import { UndoRedoControls } from "@/components/UndoRedoControls";
import { BulkPreviewGrid } from "@/components/bulk";
import { ApiKeySettingsModal } from "@/components/ApiKeySettingsModal";
import { useBulkStore } from "@/store/bulk-store";
import { useDesignStore } from "@/store/design-store";
import { useHistoryTracker } from "@/hooks/useHistoryTracker";
import { useBulkHistoryTracker } from "@/hooks/useBulkHistoryTracker";

export default function Home() {
  // Track design changes for undo/redo
  useHistoryTracker();
  useBulkHistoryTracker();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { isBulkMode, bulkItems } = useBulkStore();
  const { frameSize, getFrameDimensions } = useDesignStore();
  const { width, height } = getFrameDimensions();

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      {/* Frame Size & Padding Controls - Below Navbar */}
      <FrameSizePaddingControls />
      
      <main className="relative flex flex-1 overflow-hidden">
        {/* Desktop Sidebar - LEFT SIDE */}
        <div className="hidden w-64 border-r border-gray-200 bg-white shadow-xl md:w-72 lg:block lg:w-80">
          <Sidebar />
        </div>

        {/* Canvas Area */}
        <div className="relative flex flex-1 flex-col items-center overflow-auto p-4 sm:p-6 lg:p-8">
          {/* Top Controls - Sticky with gradient editor style */}
          <div className="sticky top-0 z-20 mb-4 flex items-center gap-2 rounded-xl bg-white/95 backdrop-blur-sm px-3 py-2 shadow-lg border border-gray-200">
            {/* Undo/Redo */}
            <UndoRedoControls minimal />
            
            {/* Separator */}
            <div className="h-6 w-px bg-gray-300" />
            
            {/* Zoom Controls */}
            <ZoomControls minimal />
            
            {/* Separator */}
            <div className="h-6 w-px bg-gray-300" />
            
            {/* AI Settings Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
              title="AI API Key Settings"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">AI Settings</span>
            </button>
          </div>
          
          {/* Canvas (always rendered for export) */}
          <div style={isBulkMode ? { position: 'fixed', top: 0, left: 0, zIndex: -9999, visibility: 'hidden' } : undefined}>
            <Canvas />
          </div>
          
          {/* Bulk Preview (shown only in bulk mode) */}
          {isBulkMode && (
            <div className="w-full max-w-6xl px-2 sm:px-0">
              <BulkPreviewGrid />
              {/* Canvas Size Info */}
              <div className="mt-4 flex justify-center">
                <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm">
                  <span>{width} × {height}px</span>
                  <span className="text-gray-400">•</span>
                  <span className="capitalize">{frameSize}</span>
                  <span className="text-gray-400">•</span>
                  <span>{bulkItems.length} items</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
            
            {/* Sidebar Drawer - LEFT SIDE on mobile */}
            <div className="fixed inset-y-0 left-0 z-50 w-full max-w-sm border-r border-gray-200 bg-white shadow-2xl transition-transform lg:hidden">
              <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </div>
          </>
        )}

        {/* Mobile Floating Button (when sidebar closed) - LEFT SIDE */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed bottom-6 left-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg transition-all hover:shadow-xl lg:hidden"
            aria-label="Open settings"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
              />
            </svg>
          </button>
        )}
      </main>

      {/* AI API Key Settings Modal */}
      <ApiKeySettingsModal
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </div>
  );
}
