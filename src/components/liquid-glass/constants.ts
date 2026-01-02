import * as THREE from "three"
import type { TransitionConfig, ExtrudeSettings, MaterialPreset } from "./types"

/**
 * Default transition configuration
 */
export const DEFAULT_TRANSITION: Required<TransitionConfig> = {
  stiffness: 15,
  damping: 0.8,
  mass: 1,
  threshold: 0.001,
}

/**
 * Default extrude settings for the glass geometry
 */
export const DEFAULT_EXTRUDE_SETTINGS: Required<ExtrudeSettings> = {
  depth: 0,
  bevelEnabled: true,
  bevelThickness: 0.02,
  bevelSize: 0.03,
  bevelSegments: 50,
}

/**
 * Default props for LiquidGlass component
 */
export const DEFAULT_PROPS = {
  width: 1,
  height: 1,
  borderRadius: 0.2,
  borderSmoothness: 30,
  position: [0, 0, 0] as [number, number, number],
  rotation: [0, 0, 0] as [number, number, number],
  transmission: 1,
  roughness: 0,
  ior: 2.5,
  chromaticAberration: 0,
  anisotropicBlur: 0,
  blur: 1000,
  color: new THREE.Color(1, 1, 1),
  thickness: 0.35,
  wireframe: false,
  // Legacy props - maps to transition config
  springStrength: DEFAULT_TRANSITION.stiffness,
  damping: DEFAULT_TRANSITION.damping,
  animationThreshold: DEFAULT_TRANSITION.threshold,
  extrudeSettings: DEFAULT_EXTRUDE_SETTINGS,
}

/**
 * Default animation states
 */
export const DEFAULT_ANIMATIONS = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95, scaleZ: 0.9 },
  whileActive: { scale: 1.08 },
  whileDisabled: { scale: 0.95, opacity: 0.5 },
}

/**
 * Material presets for common glass effects
 * Each preset provides optimized settings for a specific look
 */
export const MATERIAL_PRESETS: Record<MaterialPreset, {
  transmission: number
  roughness: number
  ior: number
  chromaticAberration: number
  thickness: number
  color: THREE.Color
}> = {
  /** Clear glass - high transmission, minimal distortion */
  glass: {
    transmission: 1,
    roughness: 0,
    ior: 1.5,
    chromaticAberration: 0,
    thickness: 0.3,
    color: new THREE.Color(1, 1, 1),
  },
  /** Frosted glass - diffuse, soft blur */
  frosted: {
    transmission: 0.95,
    roughness: 0.4,
    ior: 1.5,
    chromaticAberration: 0,
    thickness: 0.5,
    color: new THREE.Color(0.98, 0.98, 1),
  },
  /** Crystal - high refraction, rainbow effects */
  crystal: {
    transmission: 1,
    roughness: 0,
    ior: 2.4,
    chromaticAberration: 0.15,
    thickness: 0.4,
    color: new THREE.Color(1, 1, 1.05),
  },
  /** Water - subtle blue tint, medium refraction */
  water: {
    transmission: 1,
    roughness: 0.1,
    ior: 1.33,
    chromaticAberration: 0.02,
    thickness: 0.6,
    color: new THREE.Color(0.9, 0.95, 1),
  },
  /** Diamond - very high refraction, strong dispersion */
  diamond: {
    transmission: 1,
    roughness: 0,
    ior: 2.42,
    chromaticAberration: 0.25,
    thickness: 0.3,
    color: new THREE.Color(1, 1, 1),
  },
  /** Plastic - semi-transparent, soft appearance */
  plastic: {
    transmission: 0.8,
    roughness: 0.3,
    ior: 1.46,
    chromaticAberration: 0,
    thickness: 0.4,
    color: new THREE.Color(1, 1, 1),
  },
  /** Ice - cold blue tint, crystalline */
  ice: {
    transmission: 0.98,
    roughness: 0.15,
    ior: 1.31,
    chromaticAberration: 0.03,
    thickness: 0.5,
    color: new THREE.Color(0.92, 0.97, 1),
  },
}

/**
 * Quick transition presets for different animation feels
 */
export const TRANSITION_PRESETS = {
  /** Snappy, responsive feel */
  snappy: {
    stiffness: 25,
    damping: 0.85,
    mass: 0.8,
    threshold: 0.001,
  } satisfies TransitionConfig,
  /** Smooth, elegant motion */
  smooth: {
    stiffness: 10,
    damping: 0.75,
    mass: 1.2,
    threshold: 0.001,
  } satisfies TransitionConfig,
  /** Bouncy, playful feel */
  bouncy: {
    stiffness: 20,
    damping: 0.6,
    mass: 1,
    threshold: 0.001,
  } satisfies TransitionConfig,
  /** Slow, dramatic motion */
  slow: {
    stiffness: 6,
    damping: 0.85,
    mass: 1.5,
    threshold: 0.001,
  } satisfies TransitionConfig,
  /** Instant, no animation */
  instant: {
    stiffness: 100,
    damping: 1,
    mass: 0.1,
    threshold: 0.1,
  } satisfies TransitionConfig,
}
