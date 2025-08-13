import * as THREE from "three"

export interface LiquidGlassProps {
  width?: number
  height?: number
  borderRadius?: number
  borderSmoothness?: number
  position?: [number, number, number]

  transmission?: number
  roughness?: number
  ior?: number
  chromaticAberration?: number
  anisotropicBlur?: number
  blur?: number
  color?: string | THREE.Color
  thickness?: number
  wireframe?: boolean

  whileHover?: AnimationValues
  whileTap?: AnimationValues
  whileActive?: AnimationValues
  whileDisabled?: AnimationValues

  active?: boolean
  disabled?: boolean

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

  extrudeSettings?: {
    depth?: number
    bevelEnabled?: boolean
    bevelThickness?: number
    bevelSize?: number
    bevelSegments?: number
  }

  "aria-label"?: string
  tabIndex?: number
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
