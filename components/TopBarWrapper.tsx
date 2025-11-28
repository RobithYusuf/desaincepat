"use client";

import { ReactNode } from 'react';

interface TopBarWrapperProps {
  children: ReactNode;
}

export function TopBarWrapper({ children }: TopBarWrapperProps) {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 px-4 py-3 sm:px-6">
        {children}
      </div>
    </div>
  );
}
