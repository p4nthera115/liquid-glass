# Liquid Glass

A performant React Three Fiber component for creating Apple-style liquid glass effects in 3D.

[Live Demo](https://liquid-glass-wine.vercel.app/)

## Features

- **Apple-style liquid glass aesthetic** — Transmission materials with chromatic aberration
- **Performance optimized** — Geometry cached, animations use GPU transforms
- **Interactive states** — Built-in hover, tap, active, and disabled animations
- **Spring physics** — Natural feeling animations with configurable spring/damping per animation type
- **Flexible geometry** — Rounded rectangles with per-corner border radius and beveled edges
- **Imperative animation API** — `setAnimationTargets` for flicker-free programmatic control
- **TypeScript** — Full type definitions included
- **Accessible** — ARIA label and tabIndex support

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
| `borderRadius` | `BorderRadius` | `0.2` | Corner radius — single number or per-corner array |
| `borderSmoothness` | `number` | `12` | Smoothness of corner curves (increase for larger panels) |

### BorderRadius

Border radius accepts either a single number (all corners equal) or a 4-element tuple for per-corner control:

```ts
type BorderRadius = number | [topLeft, topRight, bottomRight, bottomLeft]

// Examples
borderRadius={0.3}                    // All corners 0.3
borderRadius={[0.5, 0.5, 0.1, 0.1]}  // Rounded top, sharp bottom
```

Values are automatically clamped to half the smallest dimension.

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
| `anisotropicBlur` | `number` | `0` | Directional blur effect |
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
| `animateOnHover` | `boolean` | Enable default hover animation (default: `true`) |
| `animateOnTap` | `boolean` | Enable default tap animation (default: `true`) |

When `animateOnHover` or `animateOnTap` is `true` and no explicit `whileHover`/`whileTap` is provided, built-in defaults are used (scale 1.1 for hover, scale 0.95 for tap). Set to `false` to disable default animations entirely.

### AnimationValues

```ts
interface AnimationValues {
  // Position
  x?: number           // Position X
  y?: number           // Position Y
  z?: number           // Position Z

  // Uniform scale (scales everything including border radius)
  scale?: number

  // Dimensional scale (preserves border radius by regenerating geometry)
  scaleX?: number      // Multiplies base width
  scaleY?: number      // Multiplies base height
  scaleZ?: number      // Affects uniform scale

  // Explicit dimensions (preserves border radius)
  width?: number
  height?: number

  // Rotation (radians, added to base rotation)
  rotateX?: number
  rotateY?: number
  rotateZ?: number

  // Opacity
  opacity?: number     // 0-1

  // Border radius
  borderRadius?: BorderRadius
}
```

**Scale behavior:**
- `scale` / `scaleZ` — Uniform scale transform. Scales everything including border radius visually.
- `scaleX` / `scaleY` — Multiplies base width/height and regenerates geometry. Border radius is preserved at its original size.
- `width` / `height` — Animates to explicit dimensions. Border radius is preserved.

### Spring Animation

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `springStrength` | `number` | `15` | Default spring stiffness for all animations |
| `damping` | `number` | `0.8` | Default damping factor (0-1, higher = less bouncy) |
| `animationThreshold` | `number` | `0.001` | Minimum change to continue animating |
| `positionSpring` | `SpringConfig` | — | Spring config override for position animations |
| `rotationSpring` | `SpringConfig` | — | Spring config override for rotation animations |

```ts
interface SpringConfig {
  strength?: number  // Overrides springStrength for this animation type
  damping?: number   // Overrides damping for this animation type
}
```

`positionSpring` and `rotationSpring` allow different physics feels for different animation types. For example, a slow drift on position with a snappy rotation:

```tsx
<LiquidGlass
  positionSpring={{ strength: 5, damping: 0.9 }}
  rotationSpring={{ strength: 25, damping: 0.7 }}
  whileHover={{ y: 0.2, rotateY: 0.1 }}
/>
```

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
| `onTapStart` | `() => void` | Pointer down handler |
| `onTapEnd` | `() => void` | Pointer up handler |

### Accessibility

| Prop | Type | Description |
|------|------|-------------|
| `aria-label` | `string` | ARIA label for the mesh |
| `tabIndex` | `number` | Tab index for keyboard navigation |

### Extrude Settings

```ts
interface ExtrudeSettings {
  depth?: number           // Extrusion depth (default: 0)
  bevelEnabled?: boolean   // Enable beveled edges (default: true)
  bevelThickness?: number  // Bevel depth (default: 0.02)
  bevelSize?: number       // Bevel width (default: 0.03)
  bevelSegments?: number   // Bevel smoothness (default: 8)
}
```

## Imperative API: `setAnimationTargets`

For programmatic animation control (e.g., orchestrated sequences, layout transitions), the component exposes an imperative handle via `ref`. This updates base and target values directly without triggering React re-renders, avoiding the flicker that can occur with prop-driven updates.

```tsx
import { useRef } from "react"
import { LiquidGlass, LiquidGlassHandle } from "./components/liquid-glass"

function AnimatedPanel() {
  const glassRef = useRef<LiquidGlassHandle>(null)

  const moveTo = (x: number, y: number) => {
    glassRef.current?.setAnimationTargets({
      position: [x, y, 0],
    })
  }

  const resize = (w: number, h: number) => {
    glassRef.current?.setAnimationTargets({
      width: w,
      height: h,
    })
  }

  return (
    <LiquidGlass
      ref={glassRef}
      width={1}
      height={1}
      whileHover={{ scale: 1.05 }}
    />
  )
}
```

### AnimationTargetUpdate

```ts
interface AnimationTargetUpdate {
  width?: number
  height?: number
  borderRadius?: BorderRadius
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
}
```

Each field sets both the base value and the target value simultaneously. The spring animation then interpolates from the current value to the new target. Since base values are also updated, interaction animations (hover, tap) will use the new values as their origin.

### LiquidGlassHandle

The ref type extends `THREE.Mesh`, so you have full access to the underlying Three.js mesh in addition to the imperative API:

```ts
interface LiquidGlassHandle extends THREE.Mesh {
  setAnimationTargets: (targets: AnimationTargetUpdate) => void
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

1. **Geometry caching** — Shape geometry is only created when dimensions change, not during scale/position/rotation animations
2. **GPU transforms** — Scale, position, and rotation animations use direct mesh transforms instead of geometry recreation
3. **Spring physics in render loop** — All animation state is stored in refs. No React re-renders during animation.
4. **Configurable quality** — Adjust `borderSmoothness` and `bevelSegments` for performance/quality tradeoff

### Triangle Count Guidelines

Keep total triangles under **150,000** for smooth performance:

- Each panel with default settings produces a low triangle count
- Increase `bevelSegments` (default: 8) for smoother bevels at the cost of more triangles
- Increase `borderSmoothness` (default: 12) for smoother corners on larger panels
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

### Per-Corner Border Radius

```tsx
<LiquidGlass
  width={2}
  height={1}
  borderRadius={[0.5, 0.5, 0.1, 0.1]}  // Rounded top, sharp bottom
  whileHover={{ borderRadius: [0.1, 0.1, 0.5, 0.5] }}  // Animate corners on hover
/>
```

### Rotated Panel

```tsx
<LiquidGlass
  width={2}
  height={1.5}
  position={[0, 0, 0]}
  rotation={[0, Math.PI / 6, 0]}  // 30 degree Y rotation
  whileHover={{ rotateY: 0.1 }}   // Additional rotation on hover
/>
```

### Dimensional Animation (Preserves Border Radius)

```tsx
<LiquidGlass
  width={1}
  height={1}
  borderRadius={0.2}
  whileHover={{ width: 1.5, height: 1.2 }}  // Grows but corners stay 0.2
  whileTap={{ scaleX: 0.9, scaleY: 0.9 }}   // Shrinks dimensions, corners stay 0.2
/>
```

### Different Spring Physics Per Animation Type

```tsx
<LiquidGlass
  width={2}
  height={1}
  positionSpring={{ strength: 5, damping: 0.95 }}   // Slow, smooth drift
  rotationSpring={{ strength: 30, damping: 0.6 }}    // Snappy, bouncy rotation
  whileHover={{ y: 0.3, rotateZ: 0.05 }}
/>
```

### No Default Animations

```tsx
<LiquidGlass
  width={1.5}
  height={1}
  animateOnHover={false}
  animateOnTap={false}
  whileHover={{ rotateY: 0.1 }}  // Only this custom animation plays on hover
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

### Imperative Layout Animation

```tsx
const glassRef = useRef<LiquidGlassHandle>(null)

// Smoothly animate to new layout without React re-render flicker
useEffect(() => {
  glassRef.current?.setAnimationTargets({
    position: [newX, newY, 0],
    width: newWidth,
    height: newHeight,
  })
}, [newX, newY, newWidth, newHeight])

<LiquidGlass ref={glassRef} width={1} height={1} />
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
│       ├── liquid-glass.tsx   # Main component
│       ├── types.ts           # TypeScript interfaces
│       ├── constants.ts       # Default values & presets
│       └── utils.ts           # Geometry & utility functions
└── pages/
    └── landing/               # Demo landing page
        ├── LandingPage.tsx
        ├── landing.css
        └── sections/
            ├── HeroSection.tsx
            ├── ShowcaseSection.tsx
            └── ControlCenterExample.tsx
```

## License

MIT
