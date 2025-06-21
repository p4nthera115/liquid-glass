import * as THREE from "three"

// Base animation values
export interface AnimationValues {
  x?: number
  y?: number
  z?: number
  scale?: number
  scaleX?: number
  scaleY?: number
  scaleZ?: number
  rotationX?: number
  rotationY?: number
  rotationZ?: number
  opacity?: number
  transition?: TransitionConfig
}

// Enhanced transition configuration
export interface TransitionConfig {
  duration?: number
  delay?: number
  ease?: EasingFunction

  // Spring physics
  stiffness?: number
  damping?: number
  mass?: number

  // Bounce physics
  bounceStiffness?: number
  bounceDamping?: number

  // Custom easing
  customEasing?: (t: number) => number
}

// More comprehensive easing options
export type EasingFunction =
  | "linear"
  | "ease"
  | "ease-in"
  | "ease-out"
  | "ease-in-out"
  | "spring"
  | "bounce"

// Animation variants
export interface Variants {
  [key: string]: AnimationValues
}

// Glass material properties
export interface GlassMaterialProps {
  transmission?: number
  roughness?: number
  ior?: number
  chromaticAberration?: number
  color?: string | THREE.Color
  thickness?: number
  clearcoat?: number
  clearcoatRoughness?: number
  envMapIntensity?: number
}

// Geometry configuration
export interface GeometryConfig {
  width?: number
  height?: number
  borderRadius?: number
  extrudeSettings?: ExtrudeSettings
  segments?: number
  cornerSmoothing?: number
}

export interface ExtrudeSettings {
  depth?: number
  bevelEnabled?: boolean
  bevelThickness?: number
  bevelSize?: number
  bevelSegments?: number
  curveSegments?: number
}

// Interaction states
export type InteractionState =
  | "idle"
  | "hovered"
  | "pressed"
  | "active"
  | "disabled"

// Event handlers
export interface LiquidGlassEventHandlers {
  onClick?: (event: THREE.Event) => void
  onToggle?: (active: boolean) => void
  onHoverStart?: (event: THREE.Event) => void
  onHoverEnd?: (event: THREE.Event) => void
  onTapStart?: (event: THREE.Event) => void
  onTapEnd?: (event: THREE.Event) => void
  onAnimationStart?: (variant: string) => void
  onAnimationComplete?: (variant: string) => void
  onAnimationUpdate?: (progress: number) => void
}

// Accessibility props
export interface AccessibilityProps {
  "aria-label"?: string
  "aria-pressed"?: boolean
  "aria-disabled"?: boolean
  "aria-describedby"?: string
  role?: string
  tabIndex?: number
}

// Main component props
export interface LiquidGlassProps
  extends GeometryConfig,
    GlassMaterialProps,
    LiquidGlassEventHandlers,
    AccessibilityProps {
  // Position and transform
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]

  // Animation states
  whileHover?: AnimationValues
  whileTap?: AnimationValues
  whileActive?: AnimationValues
  whileDisabled?: AnimationValues
  whileInView?: AnimationValues

  // State management
  active?: boolean
  disabled?: boolean
  loading?: boolean

  // Animation variants
  variants?: Variants
  initial?: string | AnimationValues
  animate?: string | AnimationValues
  exit?: string | AnimationValues

  // Global transition
  transition?: TransitionConfig

  // Advanced features
  layoutId?: string
  dragConstraints?:
    | boolean
    | { left?: number; right?: number; top?: number; bottom?: number }
  drag?: boolean | "x" | "y"

  // Performance
  frustumCulled?: boolean
  renderOrder?: number

  // Children and content
  children?: React.ReactNode
}

// Internal animation state
export interface AnimationState {
  current: Required<Omit<AnimationValues, "transition">>
  target: Required<Omit<AnimationValues, "transition">>
  velocity: Required<Omit<AnimationValues, "transition">>
  activeTransition: TransitionConfig
  animationProgress: number
  animatingTo: string
  previousState: InteractionState
  currentState: InteractionState
}

// Hook return types
export interface UseAnimationReturn {
  animationState: React.RefObject<AnimationState>
  applyAnimation: (
    animation: AnimationValues,
    transition?: TransitionConfig
  ) => void
  getCurrentAnimation: () => AnimationValues
  isAnimating: boolean
}

export interface UseGlassInteractionsReturn {
  isHovered: boolean
  isPressed: boolean
  handlers: {
    onPointerEnter: () => void
    onPointerLeave: () => void
    onPointerDown: () => void
    onPointerUp: () => void
  }
}
