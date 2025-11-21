"use client";

import { useState } from "react";
import { Canvas } from "@/components/Canvas";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { FrameSizePaddingControls } from "@/components/FrameSizePaddingControls";
import { ZoomControls } from "@/components/ZoomControls";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar 
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isMobileMenuOpen={isSidebarOpen}
      />
      
      {/* Frame Size & Padding Controls - Below Navbar */}
      <FrameSizePaddingControls />
      
      <main className="relative flex flex-1 overflow-hidden">
        {/* Canvas Area */}
        <div className="flex flex-1 flex-col items-center justify-center gap-4 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="relative z-20">
            <ZoomControls />
          </div>
          <Canvas />
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden w-[380px] border-l border-gray-200 bg-white shadow-xl lg:block xl:w-[420px]">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
            
            {/* Sidebar Drawer */}
            <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l border-gray-200 bg-white shadow-2xl transition-transform lg:hidden">
              <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </div>
          </>
        )}

        {/* Mobile Floating Button (when sidebar closed) */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transition-all hover:shadow-xl lg:hidden"
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
    </div>
  );
}
