# 🌊 Liquid Glass

A beautiful, highly customizable liquid glass component for React Three Fiber inspired by iOS design language. Create stunning glassmorphism effects with smooth animations and intuitive interactions.

<!-- [![NPM Version](https://img.shields.io/npm/v/@your-org/liquid-glass.svg)](https://www.npmjs.com/package/@your-org/liquid-glass)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@your-org/liquid-glass.svg)](https://bundlephobia.com/package/@your-org/liquid-glass)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/npm/l/@your-org/liquid-glass.svg)](https://github.com/your-org/liquid-glass/blob/main/LICENSE) -->

## ✨ Features

- 🎨 **Stunning Visual Effects** - Realistic glass materials with transmission, refraction, and chromatic aberration
- 🎭 **Framer Motion-like API** - Intuitive animation system with variants, transitions, and gesture states
- 🎯 **Developer Friendly** - Full TypeScript support with comprehensive type definitions
- 🎮 **Interactive States** - Built-in hover, tap, focus, active, and disabled states
- 🎪 **Preset System** - Ready-made glass styles (crystal, frosted, mercury, etc.)
- 📱 **Accessible** - ARIA support and keyboard navigation
- ⚡ **Performance Optimized** - Efficient animations with spring physics and easing functions
- 🎨 **Highly Customizable** - Every aspect can be customized while maintaining simplicity

## 🚀 Quick Start

### Installation

```bash
npm install @your-org/liquid-glass @react-three/fiber @react-three/drei three
# or
yarn add @your-org/liquid-glass @react-three/fiber @react-three/drei three
# or
pnpm add @your-org/liquid-glass @react-three/fiber @react-three/drei three
```

### Basic Usage

```jsx
import { Canvas } from "@react-three/fiber"
import { LiquidGlass } from "@your-org/liquid-glass"

function App() {
  return (
    <Canvas>
      <LiquidGlass
        width={2}
        height={1}
        onClick={() => console.log("Clicked!")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      />
    </Canvas>
  )
}
```

## 📖 Documentation

### Props Reference

#### Geometry Props

```typescript
interface GeometryProps {
  width?: number // Width of the glass panel (default: 1)
  height?: number // Height of the glass panel (default: 1)
  borderRadius?: number // Corner radius (0-0.5, default: 0.1)
  position?: [number, number, number] // 3D position
  rotation?: [number, number, number] // 3D rotation
  scale?: number | [number, number, number] // Uniform or per-axis scaling
  segments?: number // Corner smoothness (default: 8)
}
```

#### Material Props

```typescript
interface MaterialProps {
  preset?:
    | "crystal"
    | "window"
    | "frosted"
    | "mercury"
    | "tinted"
    | "bubble"
    | "acrylic"
  transmission?: number // Glass transparency (0-1, default: 1)
  roughness?: number // Surface roughness (0-1, default: 0)
  ior?: number // Index of refraction (default: 1.3)
  chromaticAberration?: number // Color separation effect (default: 0)
  color?: string | THREE.Color // Glass tint
  thickness?: number // Glass thickness (default: 0.35)
  clearcoat?: number // Surface coating (0-1)
  clearcoatRoughness?: number // Coating roughness (0-1)
}
```

#### Animation Props

```typescript
interface AnimationProps {
  // Animation states
  whileHover?: AnimationValues // Animation on hover
  whileTap?: AnimationValues // Animation when pressed
  whileFocus?: AnimationValues // Animation when focused
  whileActive?: AnimationValues // Animation when active
  whileDisabled?: AnimationValues // Animation when disabled

  // Variant system
  variants?: Record<string, AnimationValues>
  initial?: string | AnimationValues // Initial state
  animate?: string | AnimationValues // Target animation
  exit?: string | AnimationValues // Exit animation

  // Global transition
  transition?: TransitionConfig
}
```

### Animation Values

```typescript
interface AnimationValues {
  x?: number // X position
  y?: number // Y position
  z?: number // Z position
  scale?: number // Uniform scale
  scaleX?: number // X-axis scale
  scaleY?: number // Y-axis scale
  scaleZ?: number // Z-axis scale
  rotationX?: number // X-axis rotation
  rotationY?: number // Y-axis rotation
  rotationZ?: number // Z-axis rotation
  opacity?: number // Material opacity
  transition?: TransitionConfig // Per-animation transition
}
```

### Transition Configuration

```typescript
interface TransitionConfig {
  duration?: number // Animation duration in seconds
  delay?: number // Delay before starting
  ease?: EasingFunction // Easing function

  // Spring physics (when ease: "spring")
  stiffness?: number // Spring stiffness (default: 300)
  damping?: number // Spring damping (default: 20)
  mass?: number // Spring mass (default: 1)
}
```

## 🎨 Examples

### Glass Presets

```jsx
// Ultra-clear crystal glass
<LiquidGlass preset="crystal" />

//
```
