import * as THREE from "three"
import type { AnimationValues } from "./types"

/**
 * Parse color input to THREE.Color
 */
export function parseColor(color: string | THREE.Color): THREE.Color {
  if (color instanceof THREE.Color) return color
  return new THREE.Color(color)
}

/**
 * Create a rounded rectangle shape for extrusion
 * Uses mathematical approach for precise corner arcs
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

  // Helper constants (adapted from the BufferGeometry approach)
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
    // Arc from bottom to right (270° to 360°/0°)
    shape.absarc(centerX, centerY, r, -Math.PI / 2, 0, false)
  }

  // Right edge
  shape.lineTo(w2, hi)

  // Top-right corner arc
  if (r > 0) {
    const centerX = wi
    const centerY = hi
    // Arc from right to top (0° to 90°)
    shape.absarc(centerX, centerY, r, 0, Math.PI / 2, false)
  }

  // Top edge
  shape.lineTo(-wi, h2)

  // Top-left corner arc
  if (r > 0) {
    const centerX = -wi
    const centerY = hi
    // Arc from top to left (90° to 180°)
    shape.absarc(centerX, centerY, r, Math.PI / 2, Math.PI, false)
  }

  // Left edge
  shape.lineTo(-w2, -hi)

  // Bottom-left corner arc
  if (r > 0) {
    const centerX = -wi
    const centerY = -hi
    // Arc from left to bottom (180° to 270°)
    shape.absarc(centerX, centerY, r, Math.PI, (3 * Math.PI) / 2, false)
  }

  return shape
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
