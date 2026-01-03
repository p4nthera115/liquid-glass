import * as THREE from "three"
import type { ExtrudeSettings } from "./types"

export const DEFAULT_POSITION: [number, number, number] = [0, 0, 0]
export const DEFAULT_ROTATION: [number, number, number] = [0, 0, 0]

export const DEFAULT_PROPS = {
  // Geometry
  width: 1,
  height: 1,
  borderRadius: 0.2,
  borderSmoothness: 12, // Low value for performance - increase for larger panels

  // Transform
  position: DEFAULT_POSITION,
  rotation: DEFAULT_ROTATION,
  scale: 1,

  // Material
  transmission: 1,
  roughness: 0,
  ior: 2.5,
  chromaticAberration: 0,
  anisotropicBlur: 0,
  blur: 1000,
  color: new THREE.Color(1, 1, 1),
  thickness: 0.35,
  wireframe: false,

  // State
  visible: true,

  // Animation
  springStrength: 15,
  damping: 0.8,
  animationThreshold: 0.001,

  // Extrude settings - optimized for performance (<150k triangles)
  extrudeSettings: {
    depth: 0,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.03,
    bevelSegments: 8, // Low value for performance - increase for larger panels
  } as ExtrudeSettings,
}

export const DEFAULT_ANIMATIONS = {
  whileHover: { scale: 1.1 },
  whileTap: { scale: 0.95 },
  whileActive: { scale: 1.1 },
  whileDisabled: { scale: 0.9, opacity: 0.5 },
}

// Material presets for common use cases
export const MATERIAL_PRESETS = {
  // Classic Apple-style frosted glass
  frosted: {
    transmission: 0.95,
    roughness: 0.15,
    ior: 1.5,
    chromaticAberration: 0.02,
    thickness: 0.5,
  },
  // Crystal clear glass
  crystal: {
    transmission: 1,
    roughness: 0,
    ior: 2.5,
    chromaticAberration: 0.05,
    thickness: 0.3,
  },
  // Water droplet effect
  water: {
    transmission: 1,
    roughness: 0,
    ior: 1.33,
    chromaticAberration: 0.1,
    thickness: 0.8,
  },
  // Soft blur effect
  blur: {
    transmission: 0.9,
    roughness: 0.3,
    ior: 1.4,
    chromaticAberration: 0,
    thickness: 0.2,
    anisotropicBlur: 0.5,
  },
} as const

export type MaterialPreset = keyof typeof MATERIAL_PRESETS
