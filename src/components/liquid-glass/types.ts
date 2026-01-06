import * as THREE from "three"

/**
 * Border radius can be:
 * - A single number (all corners same)
 * - An array of 4 numbers: [topLeft, topRight, bottomRight, bottomLeft]
 */
export type BorderRadius = number | [number, number, number, number]

/**
 * Spring physics configuration for animations.
 * Used to control the "feel" of different animation types independently.
 */
export interface SpringConfig {
  /** How quickly the animation responds (higher = snappier). Default: 15 */
  strength?: number
  /** How quickly motion settles (0-1, higher = less bouncy). Default: 0.8 */
  damping?: number
}

export interface LiquidGlassProps {
  // Geometry
  width?: number
  height?: number
  /**
   * Border radius for corners.
   * - Single number: all corners same
   * - Array [topLeft, topRight, bottomRight, bottomLeft]: individual corners
   */
  borderRadius?: BorderRadius
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

  /**
   * Enable/disable the default tap animation.
   * When false, no animation plays on tap unless whileTap is explicitly provided.
   * @default true
   */
  animateOnTap?: boolean

  /**
   * Enable/disable the default hover animation.
   * When false, no animation plays on hover unless whileHover is explicitly provided.
   * @default true
   */
  animateOnHover?: boolean

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
  /** Default spring strength for all animations */
  springStrength?: number
  /** Default damping for all animations */
  damping?: number
  animationThreshold?: number

  /**
   * Spring config specifically for position animations (x, y, z).
   * Overrides springStrength/damping for position only.
   */
  positionSpring?: SpringConfig

  /**
   * Spring config specifically for rotation animations (rotateX, rotateY, rotateZ).
   * Overrides springStrength/damping for rotation only.
   */
  rotationSpring?: SpringConfig

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

  // Border radius
  borderRadius?: BorderRadius
}
