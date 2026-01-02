import * as THREE from "three"

/**
 * Animation transition configuration
 * Controls how animations interpolate between states
 */
export interface TransitionConfig {
  /** Spring stiffness - higher values = snappier animation (default: 15) */
  stiffness?: number
  /** Damping ratio - higher values = less oscillation (default: 0.8) */
  damping?: number
  /** Mass affects momentum - higher = slower to start/stop (default: 1) */
  mass?: number
  /** Animation threshold for completion (default: 0.001) */
  threshold?: number
}

/**
 * Animation values that can be animated between states
 */
export interface AnimationValues {
  /** Position offset on X axis */
  x?: number
  /** Position offset on Y axis */
  y?: number
  /** Position offset on Z axis */
  z?: number
  /** Uniform scale multiplier */
  scale?: number
  /** Scale multiplier on X axis (affects width) */
  scaleX?: number
  /** Scale multiplier on Y axis (affects height) */
  scaleY?: number
  /** Scale multiplier on Z axis */
  scaleZ?: number
  /** Explicit width override */
  width?: number
  /** Explicit height override */
  height?: number
  /** Rotation around X axis in radians */
  rotateX?: number
  /** Rotation around Y axis in radians */
  rotateY?: number
  /** Rotation around Z axis in radians */
  rotateZ?: number
  /** Opacity (0-1) */
  opacity?: number
  /** Custom transition config for this animation state */
  transition?: TransitionConfig
}

/**
 * Extrude geometry settings for the glass panel
 */
export interface ExtrudeSettings {
  /** Depth of extrusion (default: 0) */
  depth?: number
  /** Enable beveled edges (default: true) */
  bevelEnabled?: boolean
  /** Bevel thickness (default: 0.02) */
  bevelThickness?: number
  /** Bevel size (default: 0.03) */
  bevelSize?: number
  /** Number of bevel segments for smoothness (default: 50) */
  bevelSegments?: number
}

/**
 * Material preset names for quick styling
 */
export type MaterialPreset = 
  | "glass"
  | "frosted"
  | "crystal"
  | "water"
  | "diamond"
  | "plastic"
  | "ice"

/**
 * Main props interface for the LiquidGlass component
 */
export interface LiquidGlassProps {
  // === Dimensions & Shape ===
  /** Width of the glass panel (default: 1) */
  width?: number
  /** Height of the glass panel (default: 1) */
  height?: number
  /** Corner radius (default: 0.2) */
  borderRadius?: number
  /** Smoothness of corner curves - higher = smoother (default: 30) */
  borderSmoothness?: number
  
  // === Position & Transform ===
  /** 3D position as [x, y, z] (default: [0, 0, 0]) */
  position?: [number, number, number]
  /** Initial rotation as [x, y, z] in radians (default: [0, 0, 0]) */
  rotation?: [number, number, number]

  // === Material Properties ===
  /** Light transmission amount 0-1 (default: 1) */
  transmission?: number
  /** Surface roughness 0-1 (default: 0) */
  roughness?: number
  /** Index of refraction (default: 2.5) */
  ior?: number
  /** Color dispersion effect (default: 0) */
  chromaticAberration?: number
  /** Blur amount on transmission (default: 0) */
  anisotropicBlur?: number
  /** Blur resolution - higher = sharper (default: 1000) */
  blur?: number
  /** Base color of the glass */
  color?: string | THREE.Color
  /** Material thickness for refraction (default: 0.35) */
  thickness?: number
  /** Show wireframe (default: false) */
  wireframe?: boolean
  /** Use a material preset instead of individual properties */
  preset?: MaterialPreset

  // === Animation States ===
  /** Animation when hovered */
  whileHover?: AnimationValues
  /** Animation when pressed/tapped */
  whileTap?: AnimationValues
  /** Animation when active (controlled state) */
  whileActive?: AnimationValues
  /** Animation when disabled */
  whileDisabled?: AnimationValues
  /** Initial animation on mount (animates from these values to default) */
  initial?: AnimationValues | false
  /** Animation to play on mount */
  animate?: AnimationValues

  // === State ===
  /** Controlled active state */
  active?: boolean
  /** Disabled state - prevents interactions */
  disabled?: boolean

  // === Event Handlers ===
  /** Fired on click/tap */
  onClick?: () => void
  /** Fired when active state toggles (for toggle buttons) */
  onToggle?: (active: boolean) => void
  /** Fired when hover starts */
  onHoverStart?: () => void
  /** Fired when hover ends */
  onHoverEnd?: () => void
  /** Fired when press starts */
  onTapStart?: () => void
  /** Fired when press ends */
  onTapEnd?: () => void
  /** Fired when animation completes */
  onAnimationComplete?: () => void

  // === Animation Config ===
  /** Global transition config for all animations */
  transition?: TransitionConfig
  /** Legacy: spring strength (use transition.stiffness instead) */
  springStrength?: number
  /** Legacy: damping (use transition.damping instead) */
  damping?: number
  /** Legacy: threshold (use transition.threshold instead) */
  animationThreshold?: number

  // === Geometry ===
  /** Custom extrude geometry settings */
  extrudeSettings?: ExtrudeSettings

  // === Accessibility ===
  /** ARIA label for screen readers */
  "aria-label"?: string
  /** Tab index for keyboard navigation */
  tabIndex?: number
  /** Role for accessibility */
  role?: string
}

/**
 * Internal animation state tracking
 */
export interface AnimationState {
  // Current animated values
  currentWidth: number
  currentHeight: number
  currentScaleZ: number
  currentPosition: [number, number, number]
  currentRotation: [number, number, number]
  currentOpacity: number

  // Target values to animate towards
  targetWidth: number
  targetHeight: number
  targetScaleZ: number
  targetPosition: [number, number, number]
  targetRotation: [number, number, number]
  targetOpacity: number

  // Velocities for spring physics
  widthVelocity: number
  heightVelocity: number
  scaleZVelocity: number
  positionVelocity: [number, number, number]
  rotationVelocity: [number, number, number]
  opacityVelocity: number

  // Base values (props)
  baseWidth: number
  baseHeight: number
  basePosition: [number, number, number]
  baseRotation: [number, number, number]

  // Animation state
  isAnimating: boolean
  hasInitialized: boolean
}
