# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React Three Fiber component library for creating Apple-style liquid glass effects in 3D. Single-page app with a landing page that demonstrates the `LiquidGlass` component.

## Commands

- **Dev server:** `pnpm dev`
- **Build:** `pnpm build` (runs `tsc -b && vite build`)
- **Lint:** `pnpm lint`
- **Preview prod build:** `pnpm preview`

No test framework is configured.

## Architecture

### Core Component: `src/components/liquid-glass/`

Self-contained module with clean barrel exports via `index.ts`:

- **liquid-glass.tsx** — Main React Three Fiber mesh component with spring-based animation system, interactive state management (hover/tap/active/disabled), and dynamic geometry generation. Uses `forwardRef` for mesh access.
- **types.ts** — TypeScript interfaces (`LiquidGlassProps`, `AnimationValues`, `SpringConfig`, `BorderRadius`)
- **constants.ts** — Default prop values and material presets (frosted, crystal, water, blur)
- **utils.ts** — Geometry creation (`createRoundedRectangleShape`), border radius normalization, color parsing, animation merging, spring physics helpers

### Animation System

- Spring physics running in `useFrame` loop at 60fps — no React re-renders during animation
- State machine with layered animations: `base → active → disabled/pressed/hover`
- All animation state stored in `useRef` for performance
- Width/height/borderRadius changes trigger geometry regeneration; scale/position/rotation use GPU transforms (faster)
- Per-corner border radius support with independent spring animations
- Per-animation-type spring configs (`positionSpring`, `rotationSpring`) allow different physics feels

### Landing Page: `src/pages/landing/`

- **LandingPage.tsx** — Full-screen R3F Canvas with perf monitor
- **sections/HeroSection.tsx** — Central interactive glass panel with 4 orbiting panels
- **sections/ShowcaseSection.tsx** — Material preset demos
- **sections/ControlCenterExample.tsx** — iOS-style Control Center with 11 toggleable panels

### Entry Flow

`index.html` → `src/main.tsx` → `src/App.tsx` → `LandingPage`

No router — single page app.

## Key Technical Details

- **React 19** with **Three.js 0.177** via `@react-three/fiber` and `@react-three/drei`
- `MeshTransmissionMaterial` from drei provides the glass effect
- `maath` provides `RoundedPlaneGeometry`
- TypeScript strict mode enabled (`noUnusedLocals`, `noUnusedParameters`)
- ES modules throughout (`"type": "module"`)
- Plain CSS (no CSS modules, no Tailwind)
- Performance target: stay under 150k triangles (configurable via `borderSmoothness`, `bevelSegments`)
