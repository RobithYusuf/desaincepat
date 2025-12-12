"use client";

import { ReactNode, InputHTMLAttributes, SelectHTMLAttributes } from 'react';

// ============================================
// Shared Styles
// ============================================

const FOCUS_STYLES = "focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20";
const BASE_INPUT_STYLES = "rounded-lg border border-gray-200 bg-white text-xs font-medium";

// ============================================
// TopBar Label
// ============================================

interface TopBarLabelProps {
  children: ReactNode;
  className?: string;
}

export function TopBarLabel({ children, className = "" }: TopBarLabelProps) {
  return (
    <label className={`text-xs font-medium text-gray-700 whitespace-nowrap ${className}`}>
      {children}
    </label>
  );
}

// ============================================
// TopBar Select
// ============================================

interface TopBarSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
}

export function TopBarSelect({ children, className = "", ...props }: TopBarSelectProps) {
  return (
    <select
      className={`flex-1 sm:flex-none h-9 px-3 ${BASE_INPUT_STYLES} ${FOCUS_STYLES} ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

// ============================================
// TopBar Input (for numbers like width/height)
// ============================================

interface TopBarInputProps extends InputHTMLAttributes<HTMLInputElement> {
  width?: "sm" | "md";
}

export function TopBarInput({ width = "md", className = "", ...props }: TopBarInputProps) {
  const widthClass = width === "sm" ? "w-16 sm:w-20" : "w-20";
  
  return (
    <input
      type="text"
      inputMode="numeric"
      className={`${widthClass} h-9 px-2 ${BASE_INPUT_STYLES} ${FOCUS_STYLES} ${className}`}
      {...props}
    />
  );
}

// ============================================
// TopBar Separator (× or other text)
// ============================================

interface TopBarSeparatorProps {
  children?: ReactNode;
}

export function TopBarSeparator({ children = "×" }: TopBarSeparatorProps) {
  return <span className="text-xs text-gray-500">{children}</span>;
}

// ============================================
// TopBar Unit (px, %, etc)
// ============================================

interface TopBarUnitProps {
  children?: ReactNode;
}

export function TopBarUnit({ children = "px" }: TopBarUnitProps) {
  return <span className="text-xs text-gray-500">{children}</span>;
}

// ============================================
// TopBar Group (for grouping controls)
// ============================================

interface TopBarGroupProps {
  children: ReactNode;
  className?: string;
}

export function TopBarGroup({ children, className = "" }: TopBarGroupProps) {
  return (
    <div className={`flex items-center gap-2 w-full sm:w-auto ${className}`}>
      {children}
    </div>
  );
}

// ============================================
// TopBar Section (left or right side)
// ============================================

interface TopBarSectionProps {
  children: ReactNode;
  position?: "left" | "right";
}

export function TopBarSection({ children, position = "left" }: TopBarSectionProps) {
  if (position === "right") {
    return (
      <div className="flex items-center gap-2 w-full sm:w-auto">
        {children}
      </div>
    );
  }
  
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 w-full sm:w-auto">
      {children}
    </div>
  );
}
