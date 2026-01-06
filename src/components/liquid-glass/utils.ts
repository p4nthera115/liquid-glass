import * as THREE from "three"
import type { AnimationValues, BorderRadius } from "./types"

/**
 * Normalize border radius to [topLeft, topRight, bottomRight, bottomLeft] format
 */
export function normalizeBorderRadius(
  radius: BorderRadius,
  maxRadius: number
): [number, number, number, number] {
  if (typeof radius === "number") {
    const r = Math.min(radius, maxRadius)
    return [r, r, r, r]
  }
  return [
    Math.min(radius[0], maxRadius),
    Math.min(radius[1], maxRadius),
    Math.min(radius[2], maxRadius),
    Math.min(radius[3], maxRadius),
  ]
}

/**
 * Create a rounded rectangle shape for extrusion
 * Supports individual corner radii: [topLeft, topRight, bottomRight, bottomLeft]
 */
export function createRoundedRectangleShape(
  width: number,
  height: number,
  radius: BorderRadius,
  smoothness: number
): THREE.Shape {
  // Clamp radius to prevent overlapping corners
  const maxRadius = Math.min(width / 2, height / 2)
  const [rTL, rTR, rBR, rBL] = normalizeBorderRadius(radius, maxRadius)

  const w2 = width / 2 // half width
  const h2 = height / 2 // half height

  const shape = new THREE.Shape()

  // Start from bottom-left corner (after the corner arc would end)
  shape.moveTo(-w2 + rBL, -h2)

  // Bottom edge (left to right)
  shape.lineTo(w2 - rBR, -h2)

  // Bottom-right corner arc
  if (rBR > 0) {
    createSmoothArc(
      shape,
      w2 - rBR, // centerX
      -h2 + rBR, // centerY
      rBR,
      -Math.PI / 2,
      0,
      smoothness
    )
  }

  // Right edge (bottom to top)
  shape.lineTo(w2, h2 - rTR)

  // Top-right corner arc
  if (rTR > 0) {
    createSmoothArc(
      shape,
      w2 - rTR, // centerX
      h2 - rTR, // centerY
      rTR,
      0,
      Math.PI / 2,
      smoothness
    )
  }

  // Top edge (right to left)
  shape.lineTo(-w2 + rTL, h2)

  // Top-left corner arc
  if (rTL > 0) {
    createSmoothArc(
      shape,
      -w2 + rTL, // centerX
      h2 - rTL, // centerY
      rTL,
      Math.PI / 2,
      Math.PI,
      smoothness
    )
  }

  // Left edge (top to bottom)
  shape.lineTo(-w2, -h2 + rBL)

  // Bottom-left corner arc
  if (rBL > 0) {
    createSmoothArc(
      shape,
      -w2 + rBL, // centerX
      -h2 + rBL, // centerY
      rBL,
      Math.PI,
      (3 * Math.PI) / 2,
      smoothness
    )
  }

  return shape
}

/**
 * Create a smooth arc by manually drawing line segments
 */
function createSmoothArc(
  shape: THREE.Shape,
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  segments: number
) {
  const angleStep = (endAngle - startAngle) / segments

  for (let i = 1; i <= segments; i++) {
    const angle = startAngle + angleStep * i
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    shape.lineTo(x, y)
  }
}

/**
 * Merge multiple animations with proper priority
 */
export function mergeAnimations(
  ...animations: (AnimationValues | undefined)[]
): AnimationValues {
  const merged: AnimationValues = {}
  animations.filter(Boolean).forEach((animation) => {
    Object.assign(merged, animation)
  })
  return merged
}

/**
 * Parse color input to THREE.Color
 */
export function parseColor(color: string | THREE.Color): THREE.Color {
  if (color instanceof THREE.Color) return color
  return new THREE.Color(color)
}

/**
 * Lerp (linear interpolate) between two border radius values
 * Handles both single number and array formats by normalizing to arrays
 * Returns the interpolated array format
 */
export function lerpBorderRadius(
  from: BorderRadius,
  to: BorderRadius,
  t: number
): [number, number, number, number] {
  // Normalize both to array format
  const fromArr =
    typeof from === "number" ? [from, from, from, from] : [...from]
  const toArr = typeof to === "number" ? [to, to, to, to] : [...to]

  return [
    fromArr[0] + (toArr[0] - fromArr[0]) * t,
    fromArr[1] + (toArr[1] - fromArr[1]) * t,
    fromArr[2] + (toArr[2] - fromArr[2]) * t,
    fromArr[3] + (toArr[3] - fromArr[3]) * t,
  ]
}

/**
 * Spring step for border radius - applies spring physics to each corner
 * Returns [newValues, newVelocities, isAnimating]
 */
export function springStepBorderRadius(
  current: [number, number, number, number],
  target: [number, number, number, number],
  velocity: [number, number, number, number],
  delta: number,
  strength: number,
  damping: number,
  threshold: number
): [
  [number, number, number, number],
  [number, number, number, number],
  boolean
] {
  let isAnimating = false
  const newValues: [number, number, number, number] = [0, 0, 0, 0]
  const newVelocities: [number, number, number, number] = [0, 0, 0, 0]

  for (let i = 0; i < 4; i++) {
    const displacement = target[i] - current[i]
    const springForce = displacement * strength
    const newVel = (velocity[i] + springForce * delta) * damping
    const newVal = current[i] + newVel * delta * 50

    const cornerAnimating =
      Math.abs(displacement) > threshold || Math.abs(newVel) > threshold

    if (cornerAnimating) {
      isAnimating = true
      newValues[i] = newVal
      newVelocities[i] = newVel
    } else {
      newValues[i] = target[i]
      newVelocities[i] = 0
    }
  }

  return [newValues, newVelocities, isAnimating]
}
