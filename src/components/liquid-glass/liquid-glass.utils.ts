import * as THREE from "three"
import type {
  TransitionConfig,
  EasingFunction,
  AnimationValues,
} from "./liquid-glass.types"

// Enhanced easing functions with more options
export const easingFunctions: Record<EasingFunction, (t: number) => number> = {
  linear: (t: number) => t,
  ease: (t: number) => t * t * (3 - 2 * t),
  "ease-in": (t: number) => t * t,
  "ease-out": (t: number) => t * (2 - t),
  "ease-in-out": (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  spring: (t: number) => 1 - Math.cos(t * Math.PI * 0.5),
  bounce: (t: number) => {
    if (t < 1 / 2.75) return 7.5625 * t * t
    if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75
    if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375
    return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375
  },
}

// Color parsing with validation
export function parseColor(color: string | THREE.Color): THREE.Color {
  if (color instanceof THREE.Color) return color

  try {
    return new THREE.Color(color)
  } catch (error) {
    console.warn(`Invalid color value: ${color}. Falling back to white.`)
    return new THREE.Color(1, 1, 1)
  }
}

// Enhanced transition merging with validation
export function mergeTransitions(
  ...transitions: (TransitionConfig | undefined)[]
): TransitionConfig {
  const merged = transitions.reduce((acc, transition) => {
    if (!transition) return acc
    return { ...acc, ...transition }
  }, {} as TransitionConfig)

  // Validate and set defaults
  return {
    duration: Math.max(0, merged?.duration ?? 0.2),
    delay: Math.max(0, merged?.delay ?? 0),
    ease: merged?.ease ?? "ease-out",
    stiffness: Math.max(0, merged?.stiffness ?? 300),
    damping: Math.max(0, merged?.damping ?? 20),
    mass: Math.max(0.01, merged?.mass ?? 1),
    ...merged,
  }
}

// Create rounded rectangle shape with better corner handling
export function createRoundedRectShape(
  width: number,
  height: number,
  borderRadius: number,
  segments: number = 8
): THREE.Shape {
  const x = -width / 2
  const y = -height / 2
  const r = Math.min(
    (borderRadius * Math.min(width, height)) / 2,
    width / 2,
    height / 2
  )

  const shape = new THREE.Shape()

  if (r <= 0) {
    // No border radius - simple rectangle
    shape.moveTo(x, y)
    shape.lineTo(x + width, y)
    shape.lineTo(x + width, y + height)
    shape.lineTo(x, y + height)
    shape.lineTo(x, y)
  } else {
    // Rounded corners with proper arc segments
    shape.moveTo(x, y + r)
    shape.lineTo(x, y + height - r)
    shape.quadraticCurveTo(x, y + height, x + r, y + height)
    shape.lineTo(x + width - r, y + height)
    shape.quadraticCurveTo(x + width, y + height, x + width, y + height - r)
    shape.lineTo(x + width, y + r)
    shape.quadraticCurveTo(x + width, y, x + width - r, y)
    shape.lineTo(x + r, y)
    shape.quadraticCurveTo(x, y, x, y + r)
  }

  return shape
}

// Animation value interpolation
export function interpolateAnimationValues(
  from: AnimationValues,
  to: AnimationValues,
  progress: number
): AnimationValues {
  const result: AnimationValues = {}

  const keys = new Set([...Object.keys(from), ...Object.keys(to)])

  keys.forEach((key) => {
    if (key === "transition") return

    const fromVal = (from as any)[key] ?? 0
    const toVal = (to as any)[key] ?? 0

    ;(result as any)[key] = fromVal + (toVal - fromVal) * progress
  })

  return result
}

// Clamp utility
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

// Check if animation values are equal
export function areAnimationValuesEqual(
  a: AnimationValues,
  b: AnimationValues,
  threshold: number = 0.001
): boolean {
  const keysA = Object.keys(a).filter((k) => k !== "transition")
  const keysB = Object.keys(b).filter((k) => k !== "transition")

  if (keysA.length !== keysB.length) return false

  return keysA.every((key) => {
    const valA = (a as any)[key] ?? 0
    const valB = (b as any)[key] ?? 0
    return Math.abs(valA - valB) < threshold
  })
}

// Deep merge utility for complex objects
export function deepMerge<T extends Record<string, any>>(
  target: T,
  ...sources: Partial<T>[]
): T {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        deepMerge(
          target[key],
          source[key] as Partial<
            T[Extract<keyof T, string>] & Record<string, any>
          >
        )
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return deepMerge(target, ...sources)
}

function isObject(item: any): item is Record<string, any> {
  return item && typeof item === "object" && !Array.isArray(item)
}

// Performance helpers
export const memoizeGeometry = (() => {
  const cache = new Map<string, THREE.Shape>()

  return (width: number, height: number, borderRadius: number): THREE.Shape => {
    const key = `${width}-${height}-${borderRadius}`

    if (cache.has(key)) {
      return cache.get(key)!
    }

    const shape = createRoundedRectShape(width, height, borderRadius)
    cache.set(key, shape)

    // Limit cache size
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value
      if (firstKey) cache.delete(firstKey)
    }

    return shape
  }
})()

// Dispose of Three.js resources
// export function disposeObject3D(object: THREE.Mesh): void {
//   if (object.geometry) {
//     object.geometry.dispose()
//   }

//   if (object.material) {
//     if (Array.isArray(object.material)) {
//       object.material.forEach((material) => {
//         if (material.map) material.map.dispose()
//         if (material.normalMap) material.normalMap.dispose()
//         if (material.roughnessMap) material.roughnessMap.dispose()
//         material.dispose()
//       })
//     } else {
//       if (object.material.map) object.material.map.dispose()
//       if (object.material.normalMap) object.material.normalMap.dispose()
//       if (object.material.roughnessMap) object.material.roughnessMap.dispose()
//       object.material.dispose()
//     }
//   }
// }
