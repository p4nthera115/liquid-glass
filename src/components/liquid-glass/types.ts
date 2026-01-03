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

export interface AnimationValues {
  x?: number
  y?: number
  z?: number
  scale?: number
  scaleX?: number
  scaleY?: number
  scaleZ?: number
  width?: number
  height?: number
  rotateX?: number
  rotateY?: number
  rotateZ?: number
  opacity?: number
}

// Internal animation state type for better type safety
export interface AnimationState {
  // Current values
  currentScaleX: number
  currentScaleY: number
  currentScaleZ: number
  currentPosition: [number, number, number]
  currentRotation: [number, number, number]
  currentOpacity: number

  // Target values
  targetScaleX: number
  targetScaleY: number
  targetScaleZ: number
  targetPosition: [number, number, number]
  targetRotation: [number, number, number]
  targetOpacity: number

  // Velocities for spring physics
  scaleXVelocity: number
  scaleYVelocity: number
  scaleZVelocity: number
  positionVelocity: [number, number, number]
  rotationVelocity: [number, number, number]
  opacityVelocity: number

  // Base values for calculations
  basePosition: [number, number, number]
  baseRotation: [number, number, number]
}
