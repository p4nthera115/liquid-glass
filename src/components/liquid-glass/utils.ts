import * as THREE from "three"
import type { AnimationValues } from "./types"

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

  // Helper constants
  const wi = width / 2 - r // inner width
  const hi = height / 2 - r // inner height
  const w2 = width / 2 // half width
  const h2 = height / 2 // half height

  const shape = new THREE.Shape()

  // Start from bottom-left corner of the inner rectangle
  shape.moveTo(-wi, -h2)

  // Bottom edge
  shape.lineTo(wi, -h2)

  // Bottom-right corner arc
  if (r > 0) {
    const centerX = wi
    const centerY = -hi
    // Create smooth arc manually using the smoothness parameter
    createSmoothArc(shape, centerX, centerY, r, -Math.PI / 2, 0, smoothness)
  }

  // Right edge
  shape.lineTo(w2, hi)

  // Top-right corner arc
  if (r > 0) {
    const centerX = wi
    const centerY = hi
    createSmoothArc(shape, centerX, centerY, r, 0, Math.PI / 2, smoothness)
  }

  // Top edge
  shape.lineTo(-wi, h2)

  // Top-left corner arc
  if (r > 0) {
    const centerX = -wi
    const centerY = hi
    createSmoothArc(
      shape,
      centerX,
      centerY,
      r,
      Math.PI / 2,
      Math.PI,
      smoothness
    )
  }

  // Left edge
  shape.lineTo(-w2, -hi)

  // Bottom-left corner arc
  if (r > 0) {
    const centerX = -wi
    const centerY = -hi
    createSmoothArc(
      shape,
      centerX,
      centerY,
      r,
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
