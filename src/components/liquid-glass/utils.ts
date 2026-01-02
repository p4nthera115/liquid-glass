import * as THREE from "three"
import type { AnimationValues, TransitionConfig, AnimationState } from "./types"
import { DEFAULT_TRANSITION } from "./constants"

/**
 * Create a rounded rectangle shape for extrusion
 * Uses mathematical approach for precise corner arcs with configurable smoothness
 */
export function createRoundedRectangleShape(
  width: number,
  height: number,
  radius: number,
  smoothness: number
): THREE.Shape {
  // Clamp radius to prevent overlapping corners
  const maxRadius = Math.min(width / 2, height / 2)
  const r = Math.min(radius, maxRadius)

  // Helper constants - half dimensions minus radius
  const wi = width / 2 - r
  const hi = height / 2 - r
  const w2 = width / 2
  const h2 = height / 2

  const shape = new THREE.Shape()

  // Start from bottom-left corner of the inner rectangle
  shape.moveTo(-wi, -h2)

  // Bottom edge
  shape.lineTo(wi, -h2)

  // Bottom-right corner arc
  if (r > 0) {
    createSmoothArc(shape, wi, -hi, r, -Math.PI / 2, 0, smoothness)
  }

  // Right edge
  shape.lineTo(w2, hi)

  // Top-right corner arc
  if (r > 0) {
    createSmoothArc(shape, wi, hi, r, 0, Math.PI / 2, smoothness)
  }

  // Top edge
  shape.lineTo(-wi, h2)

  // Top-left corner arc
  if (r > 0) {
    createSmoothArc(shape, -wi, hi, r, Math.PI / 2, Math.PI, smoothness)
  }

  // Left edge
  shape.lineTo(-w2, -hi)

  // Bottom-left corner arc
  if (r > 0) {
    createSmoothArc(shape, -wi, -hi, r, Math.PI, (3 * Math.PI) / 2, smoothness)
  }

  return shape
}

/**
 * Create a smooth arc by manually drawing line segments
 * This gives us control over the number of segments for performance tuning
 */
function createSmoothArc(
  shape: THREE.Shape,
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  segments: number
): void {
  const angleStep = (endAngle - startAngle) / segments

  for (let i = 1; i <= segments; i++) {
    const angle = startAngle + angleStep * i
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    shape.lineTo(x, y)
  }
}

/**
 * Merge multiple animations with proper priority (later animations override earlier)
 */
export function mergeAnimations(
  ...animations: (AnimationValues | undefined)[]
): AnimationValues {
  const merged: AnimationValues = {}
  for (const animation of animations) {
    if (animation) {
      Object.assign(merged, animation)
    }
  }
  return merged
}

/**
 * Parse color input to THREE.Color
 * Supports hex strings, named colors, and existing THREE.Color instances
 */
export function parseColor(color: string | THREE.Color): THREE.Color {
  if (color instanceof THREE.Color) return color
  return new THREE.Color(color)
}

/**
 * Merge transition configs, with later configs overriding earlier ones
 */
export function mergeTransition(
  ...configs: (TransitionConfig | undefined)[]
): Required<TransitionConfig> {
  const result = { ...DEFAULT_TRANSITION }
  for (const config of configs) {
    if (config) {
      if (config.stiffness !== undefined) result.stiffness = config.stiffness
      if (config.damping !== undefined) result.damping = config.damping
      if (config.mass !== undefined) result.mass = config.mass
      if (config.threshold !== undefined) result.threshold = config.threshold
    }
  }
  return result
}

/**
 * Calculate spring physics for a single value
 * Returns [newValue, newVelocity, isSettled]
 */
export function springStep(
  current: number,
  target: number,
  velocity: number,
  delta: number,
  config: Required<TransitionConfig>
): [number, number, boolean] {
  const { stiffness, damping, mass, threshold } = config
  
  const displacement = target - current
  const springForce = displacement * stiffness
  const dampingForce = velocity * damping
  
  // F = ma, so a = F/m
  const acceleration = (springForce - dampingForce) / mass
  const newVelocity = velocity + acceleration * delta
  const newValue = current + newVelocity * delta * 50 // 50 is a time scale factor

  // Check if settled
  const isSettled = Math.abs(displacement) < threshold && Math.abs(newVelocity) < threshold

  return isSettled ? [target, 0, true] : [newValue, newVelocity, false]
}

/**
 * Calculate spring physics for a 3D vector
 */
export function springStep3D(
  current: [number, number, number],
  target: [number, number, number],
  velocity: [number, number, number],
  delta: number,
  config: Required<TransitionConfig>
): [[number, number, number], [number, number, number], boolean] {
  let allSettled = true
  const newCurrent: [number, number, number] = [0, 0, 0]
  const newVelocity: [number, number, number] = [0, 0, 0]

  for (let i = 0; i < 3; i++) {
    const [value, vel, settled] = springStep(
      current[i],
      target[i],
      velocity[i],
      delta,
      config
    )
    newCurrent[i] = value
    newVelocity[i] = vel
    if (!settled) allSettled = false
  }

  return [newCurrent, newVelocity, allSettled]
}

/**
 * Initialize animation state with default values
 */
export function createInitialAnimationState(
  width: number,
  height: number,
  position: [number, number, number],
  rotation: [number, number, number],
  initial?: AnimationValues | false
): AnimationState {
  // If initial is false or undefined, start at final values
  const hasInitial = initial !== undefined && initial !== false

  const state: AnimationState = {
    // Start at initial or target values
    currentWidth: hasInitial && initial.width !== undefined ? initial.width : width,
    currentHeight: hasInitial && initial.height !== undefined ? initial.height : height,
    currentScaleZ: hasInitial && initial.scaleZ !== undefined ? initial.scaleZ : 1,
    currentPosition: hasInitial 
      ? [
          initial.x ?? position[0],
          initial.y ?? position[1],
          initial.z ?? position[2],
        ]
      : [...position],
    currentRotation: hasInitial
      ? [
          initial.rotateX ?? rotation[0],
          initial.rotateY ?? rotation[1],
          initial.rotateZ ?? rotation[2],
        ]
      : [...rotation],
    currentOpacity: hasInitial && initial.opacity !== undefined ? initial.opacity : 1,

    // Target values are the final props
    targetWidth: width,
    targetHeight: height,
    targetScaleZ: 1,
    targetPosition: [...position],
    targetRotation: [...rotation],
    targetOpacity: 1,

    // Velocities start at 0
    widthVelocity: 0,
    heightVelocity: 0,
    scaleZVelocity: 0,
    positionVelocity: [0, 0, 0],
    rotationVelocity: [0, 0, 0],
    opacityVelocity: 0,

    // Base values for animation calculations
    baseWidth: width,
    baseHeight: height,
    basePosition: [...position],
    baseRotation: [...rotation],

    // Animation tracking
    isAnimating: hasInitial ? true : false,
    hasInitialized: false,
  }

  // Handle scale in initial animation
  if (hasInitial) {
    if (initial.scale !== undefined) {
      state.currentWidth = width * initial.scale
      state.currentHeight = height * initial.scale
      state.currentScaleZ = initial.scale
    }
    if (initial.scaleX !== undefined) {
      state.currentWidth = width * initial.scaleX
    }
    if (initial.scaleY !== undefined) {
      state.currentHeight = height * initial.scaleY
    }
  }

  return state
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Linear interpolation
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}
