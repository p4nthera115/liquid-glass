import * as THREE from "three"

export interface LiquidGlassProps {
  // Geometry
  width?: number
  height?: number
  borderRadius?: number
  borderSmoothness?: number

  // Transform
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]

  // Material properties
  transmission?: number
  roughness?: number
  ior?: number
  chromaticAberration?: number
  anisotropicBlur?: number
  blur?: number
  color?: string | THREE.Color
  thickness?: number
  wireframe?: boolean

  // Animation states
  whileHover?: AnimationValues
  whileTap?: AnimationValues
  whileActive?: AnimationValues
  whileDisabled?: AnimationValues

  // State
  active?: boolean
  disabled?: boolean
  visible?: boolean

  // Callbacks
  onClick?: () => void
  onToggle?: (active: boolean) => void
  onHoverStart?: () => void
  onHoverEnd?: () => void
  onTapStart?: () => void
  onTapEnd?: () => void

  // Spring animation settings
  springStrength?: number
  damping?: number
  animationThreshold?: number

  // Geometry extrusion settings
  extrudeSettings?: ExtrudeSettings

  // Accessibility
  "aria-label"?: string
  tabIndex?: number

  // Children (for advanced use cases like custom materials)
  children?: React.ReactNode
}

export interface ExtrudeSettings {
  depth?: number
  bevelEnabled?: boolean
  bevelThickness?: number
  bevelSize?: number
  bevelSegments?: number
}

/**
 * Animation values for whileHover, whileTap, whileActive, whileDisabled
 *
 * Behavior:
 * - `width` / `height` - Animates actual dimensions, PRESERVES border radius
 * - `scaleX` / `scaleY` - Multiplies base width/height, PRESERVES border radius
 * - `scale` / `scaleZ` - Uniform scale transform, SCALES border radius too
 * - `x` / `y` / `z` - Position animation
 * - `rotateX` / `rotateY` / `rotateZ` - Rotation animation (radians)
 * - `opacity` - Material opacity animation
 */
export interface AnimationValues {
  // Position
  x?: number
  y?: number
  z?: number

  // Uniform scale (scales everything including border radius)
  scale?: number

  // Dimensional scale (preserves border radius by regenerating geometry)
  scaleX?: number // Multiplies width
  scaleY?: number // Multiplies height
  scaleZ?: number // Affects uniform scale

  // Explicit dimensions (preserves border radius)
  width?: number
  height?: number

  // Rotation (radians, added to base rotation)
  rotateX?: number
  rotateY?: number
  rotateZ?: number

  // Opacity
  opacity?: number
}
