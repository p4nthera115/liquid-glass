# Liquid Glass Component

A React Three.js component that creates beautiful liquid glass effects with smooth spring animations and interactive states.

## Features

- **Liquid Glass Material**: Uses Three.js MeshTransmissionMaterial for realistic glass effects
- **Spring Animations**: Smooth, physics-based animations with configurable spring strength and damping
- **Interactive States**: Hover, tap, active, and disabled states with customizable animations
- **Dynamic Geometry**: Real-time geometry updates for width/height changes
- **Accessibility**: Built-in ARIA support and keyboard navigation
- **TypeScript**: Fully typed with comprehensive TypeScript support
- **Modular Architecture**: Clean separation of concerns with utilities and types

## Installation

```bash
npm install
npm run dev
```

## Usage

### Basic Usage

```tsx
import { Canvas } from "@react-three/fiber"
import LiquidGlass from "./components/liquid-glass"

function App() {
  return (
    <Canvas camera={{ position: [0, 0, 1] }}>
      <LiquidGlass
        width={1}
        height={1}
        borderRadius={0.2}
        onClick={() => console.log("Clicked!")}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      />
    </Canvas>
  )
}
```

## Project Structure

```
src/components/liquid-glass/
├── index.ts                    # Main exports
├── liquid-glass.tsx           # Main component
├── types.ts                   # TypeScript interfaces
├── constants.ts               # Default values and constants
└── utils.ts                   # Utility functions
```

## Props

### Geometry Props

- `width?: number` - Width of the glass (default: 1)
- `height?: number` - Height of the glass (default: 1)
- `borderRadius?: number` - Corner radius (default: 0.2)
- `borderSmoothness?: number` - Smoothness of corners (default: 30)
- `position?: [number, number, number]` - Position in 3D space (default: [0, 0, 0])

### Material Props

- `transmission?: number` - Light transmission (default: 1)
- `roughness?: number` - Surface roughness (default: 0)
- `ior?: number` - Index of refraction (default: 2.5)
- `chromaticAberration?: number` - Color dispersion (default: 0)
- `anisotropicBlur?: number` - Directional blur (default: 0)
- `blur?: number` - Blur resolution (default: 1000)
- `color?: string | THREE.Color` - Glass color (default: white)
- `thickness?: number` - Material thickness (default: 0.35)
- `wireframe?: boolean` - Show wireframe (default: false)

### Animation Props

- `whileHover?: AnimationValues` - Animation on hover
- `whileTap?: AnimationValues` - Animation on tap
- `whileActive?: AnimationValues` - Animation when active
- `whileDisabled?: AnimationValues` - Animation when disabled
- `springStrength?: number` - Spring animation strength (default: 15)
- `damping?: number` - Spring damping (default: 0.8)
- `animationThreshold?: number` - Animation precision threshold (default: 0.001)

### State Props

- `active?: boolean` - Active state (default: false)
- `disabled?: boolean` - Disabled state (default: false)

### Event Handlers

- `onClick?: () => void` - Click handler
- `onToggle?: (active: boolean) => void` - Toggle handler
- `onHoverStart?: () => void` - Hover start handler
- `onHoverEnd?: () => void` - Hover end handler
- `onTapStart?: () => void` - Tap start handler
- `onTapEnd?: () => void` - Tap end handler

### Extrusion Settings

- `extrudeSettings?: object` - Three.js extrude geometry settings

### Accessibility

- `aria-label?: string` - Accessibility label
- `tabIndex?: number` - Tab index (default: 0)

## Animation Values

The `AnimationValues` interface supports:

- `x, y, z?: number` - Position
- `scale, scaleX, scaleY, scaleZ?: number` - Scale
- `width, height?: number` - Dimensions
- `rotateX, rotateY, rotateZ?: number` - Rotation
- `opacity?: number` - Opacity

## Examples

### Basic Glass Button

```tsx
<LiquidGlass
  width={0.8}
  height={0.4}
  borderRadius={0.1}
  onClick={() => console.log("Button clicked!")}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
/>
```

### Colored Glass with Custom Animation

```tsx
<LiquidGlass
  width={1}
  height={1}
  color="#ff6b6b"
  transmission={0.8}
  whileHover={{
    scale: 1.1,
    rotateZ: 0.1,
  }}
  whileTap={{
    scale: 0.9,
    rotateZ: -0.05,
  }}
/>
```

### Disabled State

```tsx
<LiquidGlass
  disabled={true}
  whileDisabled={{
    scale: 0.8,
    opacity: 0.5,
  }}
/>
```

### Custom Spring Settings

```tsx
<LiquidGlass
  springStrength={20} // More responsive
  damping={0.6} // Less damping
  animationThreshold={0.0001} // More precise
  whileHover={{ scale: 1.2 }}
/>
```

## Development

This component is built with:

- React 18
- Three.js
- React Three Fiber
- TypeScript

The component uses spring physics for smooth animations and dynamically updates geometry for dimension changes.

### Architecture

The component is designed with a modular architecture:

1. **Main Component** (`liquid-glass.tsx`): Orchestrates the overall behavior
2. **Types** (`types.ts`): Comprehensive TypeScript definitions
3. **Constants** (`constants.ts`): Centralized default values and configurations
4. **Utilities** (`utils.ts`): Reusable functions for shape creation and color parsing

This structure makes the code more maintainable, testable, and reusable.
