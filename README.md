# Liquid Glass

A performant React Three Fiber component for creating Apple-style liquid glass effects in 3D.

![Liquid Glass Demo](https://via.placeholder.com/800x400/0a0a0f/667eea?text=Liquid+Glass)

## Features

- 🎨 **Apple-style liquid glass aesthetic** - Transmission materials with chromatic aberration
- ⚡ **Performance optimized** - Geometry cached, animations use GPU transforms
- 🎭 **Interactive states** - Built-in hover, tap, active, and disabled animations
- 🔄 **Spring physics** - Natural feeling animations with configurable spring/damping
- 📐 **Flexible geometry** - Customizable rounded rectangles with beveled edges
- 🎯 **TypeScript** - Full type definitions included
- ♿ **Accessible** - ARIA label support

## Installation

```bash
pnpm install
```

## Quick Start

```tsx
import { Canvas } from "@react-three/fiber"
import { LiquidGlass } from "./components/liquid-glass"

function App() {
  return (
    <Canvas>
      <LiquidGlass
        width={2}
        height={1.5}
        borderRadius={0.3}
        position={[0, 0, 0]}
        rotation={[0, Math.PI / 8, 0]}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      />
    </Canvas>
  )
}
```

## Props

### Geometry

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number` | `1` | Width of the glass panel |
| `height` | `number` | `1` | Height of the glass panel |
| `borderRadius` | `number` | `0.2` | Corner radius |
| `borderSmoothness` | `number` | `30` | Smoothness of corner curves |

### Transform

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `[x, y, z]` | `[0, 0, 0]` | Position in 3D space |
| `rotation` | `[x, y, z]` | `[0, 0, 0]` | Rotation in radians (Euler angles) |
| `scale` | `number \| [x, y, z]` | `1` | Scale factor |

### Material

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `transmission` | `number` | `1` | Light transmission (0-1) |
| `roughness` | `number` | `0` | Surface roughness |
| `ior` | `number` | `2.5` | Index of refraction |
| `chromaticAberration` | `number` | `0` | Rainbow edge effect |
| `thickness` | `number` | `0.35` | Material thickness |
| `color` | `string \| THREE.Color` | `white` | Tint color |
| `wireframe` | `boolean` | `false` | Show wireframe |
| `blur` | `number` | `1000` | Blur resolution |

### Animation States

| Prop | Type | Description |
|------|------|-------------|
| `whileHover` | `AnimationValues` | Animation when hovered |
| `whileTap` | `AnimationValues` | Animation when pressed |
| `whileActive` | `AnimationValues` | Animation when active |
| `whileDisabled` | `AnimationValues` | Animation when disabled |

### AnimationValues

```ts
interface AnimationValues {
  x?: number        // Position X
  y?: number        // Position Y
  z?: number        // Position Z
  scale?: number    // Uniform scale
  scaleX?: number   // X-axis scale
  scaleY?: number   // Y-axis scale
  scaleZ?: number   // Z-axis scale
  rotateX?: number  // X rotation (radians)
  rotateY?: number  // Y rotation (radians)
  rotateZ?: number  // Z rotation (radians)
  opacity?: number  // Opacity (0-1)
}
```

### Spring Animation

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `springStrength` | `number` | `15` | Spring stiffness |
| `damping` | `number` | `0.8` | Damping factor |
| `animationThreshold` | `number` | `0.001` | Min change to animate |

### State & Callbacks

| Prop | Type | Description |
|------|------|-------------|
| `active` | `boolean` | Active state |
| `disabled` | `boolean` | Disabled state |
| `visible` | `boolean` | Visibility toggle |
| `onClick` | `() => void` | Click handler |
| `onToggle` | `(active: boolean) => void` | Toggle handler |
| `onHoverStart` | `() => void` | Hover start handler |
| `onHoverEnd` | `() => void` | Hover end handler |

### Extrude Settings

```ts
interface ExtrudeSettings {
  depth?: number           // Extrusion depth (default: 0)
  bevelEnabled?: boolean   // Enable beveled edges (default: true)
  bevelThickness?: number  // Bevel depth (default: 0.02)
  bevelSize?: number       // Bevel width (default: 0.03)
  bevelSegments?: number   // Bevel smoothness (default: 32)
}
```

## Material Presets

Pre-configured material settings for common effects:

```tsx
import { MATERIAL_PRESETS } from "./components/liquid-glass"

// Available presets
MATERIAL_PRESETS.frosted  // Soft blur, like frosted glass
MATERIAL_PRESETS.crystal  // Clear with high refraction
MATERIAL_PRESETS.water    // Water droplet effect
MATERIAL_PRESETS.blur     // Strong blur effect

// Usage
<LiquidGlass {...MATERIAL_PRESETS.frosted} />
```

## Performance Considerations

The component is optimized for performance:

1. **Geometry caching** - Shape geometry is only created when dimensions change, not during animations
2. **GPU transforms** - Animations use scale/position/rotation transforms instead of geometry recreation
3. **Spring physics in render loop** - No React re-renders during animation
4. **Configurable quality** - Adjust `borderSmoothness` and `bevelSegments` for performance/quality tradeoff

### Triangle Count Guidelines

Keep total triangles under **150,000** for smooth performance:

- Each panel with default settings ≈ 2,000-5,000 triangles
- Reduce `bevelSegments` (default: 32) for fewer triangles
- Reduce `borderSmoothness` (default: 30) for simpler corners
- Use the `r3f-perf` monitor to track triangle counts

## Examples

### Basic Button

```tsx
<LiquidGlass
  width={1}
  height={0.4}
  borderRadius={0.2}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => console.log("clicked")}
/>
```

### Toggle Button

```tsx
const [active, setActive] = useState(false)

<LiquidGlass
  active={active}
  onToggle={setActive}
  whileActive={{ scale: 1.1, z: 0.1 }}
  color={active ? new THREE.Color(0.3, 0.5, 1) : undefined}
/>
```

### Rotated Panel

```tsx
<LiquidGlass
  width={2}
  height={1.5}
  position={[0, 0, 0]}
  rotation={[0, Math.PI / 6, 0]}  // 30° Y rotation
  whileHover={{ rotateY: 0.1 }}   // Additional rotation on hover
/>
```

### Custom Material via Children

```tsx
<LiquidGlass width={2} height={2}>
  <meshPhysicalMaterial
    transmission={0.9}
    roughness={0.1}
    // ... custom material props
  />
</LiquidGlass>
```

## Development

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Lint
pnpm lint
```

## Architecture

```
src/
├── components/
│   └── liquid-glass/
│       ├── index.ts          # Exports
│       ├── liquid-glass.tsx  # Main component
│       ├── types.ts          # TypeScript interfaces
│       ├── constants.ts      # Default values & presets
│       └── utils.ts          # Geometry & utility functions
└── pages/
    └── landing/              # Demo landing page
        ├── LandingPage.tsx
        ├── landing.css
        └── sections/
            ├── HeroSection.tsx
            ├── ShowcaseSection.tsx
            └── ControlCenterExample.tsx
```

## Changes in This Version

### Performance Improvements

- **Removed geometry recreation during animations** - Previously, width/height animations would trigger geometry recreation on every frame. Now animations use GPU-accelerated scale transforms, only recreating geometry when base dimensions actually change.
- **Reduced default bevelSegments** from 50 to 32 for better performance while maintaining visual quality.
- **Extracted spring physics helper** for cleaner, more maintainable animation code.

### New Features

- **`rotation` prop** - Initial rotation for the component (Euler angles in radians)
- **`scale` prop** - Initial scale, can be uniform number or `[x, y, z]` tuple
- **`visible` prop** - Toggle visibility without unmounting
- **`forwardRef` support** - Access the underlying THREE.Mesh via ref
- **`children` prop** - Inject custom materials or content
- **Material presets** - Pre-configured material settings (frosted, crystal, water, blur)

### Improved Types

- Separated `ExtrudeSettings` interface
- Added `AnimationState` type for internal state management
- Better documentation via JSDoc comments

## License

MIT
