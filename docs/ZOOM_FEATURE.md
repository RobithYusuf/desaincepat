# Zoom Feature Documentation

## Overview

Canvas thumbnail sekarang memiliki kontrol zoom interaktif yang memungkinkan user untuk memperbesar/memperkecil preview thumbnail dengan mudah.

---

## Features

### Zoom Controls

Terletak di **atas canvas area**, terdiri dari 4 kontrol utama:

```
┌─────────────────────────────────┐
│  [-]  [100%]  [+]  | [⤢]       │
│  Out  Display  In    Fit        │
└─────────────────────────────────┘
```

### 1. Zoom Out Button (-)
- **Icon:** ZoomOut (minus icon)
- **Function:** Memperkecil zoom 25% per klik
- **Range:** Minimum 25%
- **Disabled state:** Saat zoom sudah 25%
- **Keyboard:** -
- **Tooltip:** "Zoom out (25%)"

### 2. Zoom Level Display
- **Display:** Persentase saat ini (e.g., "100%")
- **Clickable:** Ya - reset ke 100%
- **Range:** 25% - 200%
- **Function:** Reset zoom ke default (100%)
- **Tooltip:** "Reset zoom to 100%"

### 3. Zoom In Button (+)
- **Icon:** ZoomIn (plus icon)
- **Function:** Memperbesar zoom 25% per klik
- **Range:** Maximum 200%
- **Disabled state:** Saat zoom sudah 200%
- **Keyboard:** +
- **Tooltip:** "Zoom in (200%)"

### 4. Fit to Screen Button
- **Icon:** Maximize2
- **Function:** Reset zoom ke 100% (fit canvas ke screen)
- **Tooltip:** "Fit to screen"

---

## Zoom Levels

| Level | Percentage | Use Case |
|-------|------------|----------|
| 0.25  | 25%        | Lihat keseluruhan thumbnail kecil |
| 0.50  | 50%        | Preview medium |
| 0.75  | 75%        | Preview mendekati normal |
| 1.00  | **100%** (Default) | Ukuran normal optimal |
| 1.25  | 125%       | Zoom in ringan |
| 1.50  | 150%       | Detail checking |
| 1.75  | 175%       | Detail maksimal |
| 2.00  | 200%       | Maximum zoom untuk pixel-level detail |

---

## Technical Implementation

### State Management (Zustand)

```typescript
// store/design-store.ts
interface DesignState {
  zoomLevel: number; // 0.25 to 2.0
}

interface DesignActions {
  setZoomLevel: (level: number) => void;
  zoomIn: () => void;     // +25%
  zoomOut: () => void;    // -25%
  resetZoom: () => void;  // 100%
}
```

### Zoom Logic

```typescript
// Auto-clamping untuk prevent out of range
setZoomLevel: (zoomLevel) => {
  const clampedZoom = Math.max(0.25, Math.min(2, zoomLevel));
  set({ zoomLevel: clampedZoom });
}

// Zoom In dengan increment 0.25 (25%)
zoomIn: () => {
  const currentZoom = get().zoomLevel;
  const newZoom = Math.min(2, currentZoom + 0.25);
  set({ zoomLevel: newZoom });
}

// Zoom Out dengan decrement 0.25 (25%)
zoomOut: () => {
  const currentZoom = get().zoomLevel;
  const newZoom = Math.max(0.25, currentZoom - 0.25);
  set({ zoomLevel: newZoom });
}
```

### Canvas Scaling

```typescript
// Canvas.tsx
const baseScale = Math.min(
  (window.innerHeight * 0.6) / height,
  (window.innerWidth * 0.7) / width,
  1 // Never scale up beyond actual size
);

// Apply zoom on top of base scale
const scale = baseScale * zoomLevel;
```

**Formula:**
- Base Scale: Auto-fit canvas ke viewport (max 100%)
- Final Scale: Base Scale × Zoom Level
- Result: Smooth zoom tanpa pixelation

---

## UI/UX Details

### Visual Feedback

**Button States:**
- **Normal:** Gray text with white background
- **Hover:** Light gray background
- **Disabled:** 40% opacity, cursor not-allowed
- **Active/Focused:** Visual focus ring

**Zoom Display:**
- **Format:** "XX%"
- **Font:** Semibold, small size
- **Min Width:** 60px (prevent layout shift)
- **Clickable:** Yes (acts as reset button)

### Transitions

```css
/* Canvas smooth zoom transition */
transition-transform duration-200

/* Buttons hover */
transition-colors
```

### Accessibility

- ✅ All buttons have `aria-label`
- ✅ Tooltips dengan title attribute
- ✅ Disabled state properly marked
- ✅ Keyboard accessible
- ✅ Focus states visible
- ✅ Screen reader friendly

---

## User Interactions

### Mouse

1. **Click Zoom In (+)** → Canvas scales up 25%
2. **Click Zoom Out (-)** → Canvas scales down 25%
3. **Click Zoom Display (%)** → Reset to 100%
4. **Click Fit to Screen** → Reset to 100%

### Keyboard (Future Enhancement)

- `+` or `=` → Zoom in
- `-` or `_` → Zoom out
- `0` → Reset to 100%
- `Ctrl/Cmd + Mouse Wheel` → Zoom

### Touch (Mobile)

- Tap buttons work normally
- Pinch to zoom (future enhancement)

---

## Layout Changes

### Before Zoom Feature

```
┌─────────────────────────┐
│                         │
│      Canvas Preview     │
│                         │
│    [Dimension Badge]    │
└─────────────────────────┘
```

### After Zoom Feature

```
┌─────────────────────────┐
│   [Zoom Controls Bar]   │
│  [-] [100%] [+] | [⤢]  │
├─────────────────────────┤
│   ┌───────────────┐     │
│   │               │     │
│   │ Canvas Preview│     │ <- Scrollable if zoomed
│   │               │     │
│   └───────────────┘     │
│  [Dimension Badge]      │
└─────────────────────────┘
```

### Scroll Behavior

Saat zoom > 100%:
- Canvas bisa overflow
- Container `overflow-auto` aktif
- User bisa scroll untuk lihat area yang tidak visible

---

## Responsive Behavior

### Desktop (> 1024px)
- Full zoom controls visible
- Optimal spacing
- All features accessible

### Tablet (768px - 1023px)
- Same as desktop
- Slightly compact spacing

### Mobile (< 768px)
- Controls remain visible
- Button sizes maintained (touch-friendly)
- Zoom persists when sidebar opens/closes

---

## Performance

### Optimization Techniques

1. **Smooth Scaling**
   - CSS `transform: scale()` (GPU-accelerated)
   - No re-rendering of canvas content
   - Only transform property changes

2. **State Management**
   - Single zoom state in Zustand
   - No prop drilling
   - Efficient re-renders

3. **Transition Duration**
   - 200ms (optimal for smooth feel)
   - Not too fast, not too slow

4. **Clamping**
   - Prevents invalid zoom levels
   - No unnecessary state updates

---

## Edge Cases Handled

### ✅ Zoom Limits
- Can't zoom below 25%
- Can't zoom above 200%
- Buttons auto-disable at limits

### ✅ State Persistence
- Zoom level persists during:
  - Text changes
  - Color changes
  - Frame size changes
  - Gradient changes

### ✅ Responsive Zoom
- Works on all screen sizes
- Adapts to viewport changes
- Maintains aspect ratio

### ✅ Export Behavior
- Export uses **actual size** (not zoomed)
- Zoom only affects preview
- Downloaded image always full quality

---

## Future Enhancements

### Planned Features

1. **Keyboard Shortcuts**
   ```
   + / = → Zoom in
   - / _ → Zoom out
   0 → Reset
   Ctrl + Mouse Wheel → Smooth zoom
   ```

2. **Pinch to Zoom (Mobile)**
   ```typescript
   // Touch gesture support
   onPinch={(delta) => {
     const newZoom = zoomLevel * delta;
     setZoomLevel(newZoom);
   }}
   ```

3. **Zoom to Cursor**
   - Zoom in/out centered on mouse position
   - More intuitive for detail work

4. **Zoom Presets**
   - Quick buttons: 50%, 75%, 100%, 150%, 200%
   - Dropdown with preset options

5. **Pan Mode**
   - Hold spacebar + drag to pan
   - Useful when zoomed > 100%

6. **Mini Map**
   - Small thumbnail showing full canvas
   - Highlight visible area
   - Click to jump to position

---

## Usage Examples

### Example 1: Check Text Details
```
1. User edits text → "Typography Quality Check"
2. Click Zoom In (+) → 125%
3. Click Zoom In (+) again → 150%
4. Inspect font rendering closely
5. Click "100%" to reset
```

### Example 2: Export Workflow
```
1. User designs thumbnail at 100% zoom
2. Zoom in to 175% to check pixel details
3. Zoom out to 50% to see overall composition
4. Reset to 100% for final review
5. Click "Download PNG" → Exports at full resolution
```

### Example 3: Mobile Usage
```
1. Open app on phone
2. Tap floating button to open settings
3. Adjust text size
4. Tap zoom in button to see details
5. Pinch to zoom (future) for fine control
```

---

## Testing Checklist

### Functional Tests
- [x] Zoom in increases canvas size
- [x] Zoom out decreases canvas size
- [x] Zoom level display shows correct percentage
- [x] Reset button works (click display or fit button)
- [x] Buttons disable at min/max zoom
- [x] Smooth transition animation
- [x] Scroll appears when zoomed beyond viewport

### UI Tests
- [x] Controls positioned correctly
- [x] Buttons have proper spacing
- [x] Icons render correctly
- [x] Hover states work
- [x] Disabled states show properly
- [x] Tooltips appear on hover

### Integration Tests
- [x] Zoom persists across text changes
- [x] Zoom works with different frame sizes
- [x] Zoom doesn't affect export quality
- [x] Zoom works on mobile (responsive)
- [x] No layout shifts during zoom

### Accessibility Tests
- [x] Keyboard navigation works
- [x] Screen readers announce buttons
- [x] Focus states visible
- [x] Disabled state announced
- [x] ARIA labels present

---

## Known Limitations

1. **No Pinch Zoom Yet**
   - Mobile users must use buttons
   - Future enhancement planned

2. **No Keyboard Shortcuts Yet**
   - Must click buttons
   - Future enhancement planned

3. **Fixed Increment (25%)**
   - Can't zoom by custom amounts
   - Could add slider in future

4. **No Zoom to Cursor**
   - Always zooms from center
   - Future enhancement planned

---

## Code References

### Main Files

1. **`store/design-store.ts`**
   - Zoom state management
   - Zoom actions (in/out/reset)

2. **`components/ZoomControls.tsx`**
   - UI controls component
   - Button handlers

3. **`components/Canvas.tsx`**
   - Canvas scaling logic
   - Zoom integration

### Key Functions

```typescript
// Zustand Store
setZoomLevel(level: number): void
zoomIn(): void
zoomOut(): void
resetZoom(): void

// Canvas Component
const scale = baseScale * zoomLevel;
```

---

## Changelog

### v2.1 (Current)
- ✅ Added zoom in/out buttons
- ✅ Added zoom level display
- ✅ Added fit to screen button
- ✅ Smooth transitions
- ✅ Disabled states
- ✅ Accessibility support

### v2.0 (Previous)
- Responsive design
- Mobile sidebar drawer
- Floating settings button

### v1.0 (Initial)
- Basic thumbnail generator
- No zoom feature

---

**Last Updated:** November 2025  
**Version:** 2.1 (Zoom Edition)
