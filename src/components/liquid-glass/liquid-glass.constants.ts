import * as THREE from "three"

import type {
  LiquidGlassProps,
  AnimationValues,
  TransitionConfig,
  ExtrudeSettings,
  GlassMaterialProps,
} from "./liquid-glass.types"

// Default component props
export const DEFAULT_PROPS: Required<
  Pick<
    LiquidGlassProps,
    | "width"
    | "height"
    | "borderRadius"
    | "position"
    | "transmission"
    | "roughness"
    | "ior"
    | "chromaticAberration"
    | "color"
    | "thickness"
    | "active"
    | "disabled"
    | "tabIndex"
  >
> = {
  width: 1,
  height: 1,
  borderRadius: 0.1,
  position: [0, 0, 0],
  transmission: 1,
  roughness: 0,
  ior: 1.3,
  chromaticAberration: 0,
  color: new THREE.Color(1, 1, 1),
  thickness: 0.35,
  active: false,
  disabled: false,
  tabIndex: 0,
}

// Default transition configuration
export const DEFAULT_TRANSITION: TransitionConfig = {
  duration: 0.2,
  ease: "ease-out",
  stiffness: 300,
  damping: 20,
  mass: 1,
}

// Default extrude settings
export const DEFAULT_EXTRUDE_SETTINGS: ExtrudeSettings = {
  depth: 0.02,
  bevelEnabled: true,
  bevelThickness: 0.01,
  bevelSize: 0.02,
  bevelSegments: 8,
  curveSegments: 12,
}

// Default animation states
export const DEFAULT_ANIMATIONS: Record<string, AnimationValues> = {
  whileHover: {
    scale: 1.05,
    transition: { duration: 0.15, ease: "ease-out" },
  },
  whileTap: {
    scale: 0.95,
    transition: { duration: 0.1, ease: "ease-in" },
  },
  whileFocus: {
    scale: 1.02,
    transition: { duration: 0.2, ease: "ease-out" },
  },
  whileActive: {
    scale: 1.1,
    transition: { duration: 0.3, ease: "spring", stiffness: 200 },
  },
  whileDisabled: {
    scale: 0.9,
    opacity: 0.5,
    transition: { duration: 0.3, ease: "ease-out" },
  },
  whileInView: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "ease-out", delay: 0.1 },
  },
}

// Preset material configurations
export const GLASS_PRESETS: Record<string, GlassMaterialProps> = {
  // Ultra clear glass - minimal distortion
  crystal: {
    transmission: 1,
    roughness: 0,
    ior: 1.1,
    chromaticAberration: 0,
    thickness: 0.2,
    clearcoat: 1,
    clearcoatRoughness: 0,
  },

  // Standard window glass
  window: {
    transmission: 0.95,
    roughness: 0.05,
    ior: 1.52,
    chromaticAberration: 0.02,
    thickness: 0.3,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
  },

  // Frosted glass effect
  frosted: {
    transmission: 0.8,
    roughness: 0.3,
    ior: 1.4,
    chromaticAberration: 0.01,
    thickness: 0.4,
    clearcoat: 0.5,
    clearcoatRoughness: 0.4,
  },

  // Liquid mercury effect
  mercury: {
    transmission: 0.7,
    roughness: 0.1,
    ior: 1.8,
    chromaticAberration: 0.1,
    thickness: 0.6,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    color: new THREE.Color(0.9, 0.95, 1),
  },

  // Tinted glass
  tinted: {
    transmission: 0.85,
    roughness: 0.02,
    ior: 1.45,
    chromaticAberration: 0.03,
    thickness: 0.35,
    clearcoat: 0.9,
    clearcoatRoughness: 0.02,
    color: new THREE.Color(0.9, 0.9, 1),
  },

  // Soap bubble effect
  bubble: {
    transmission: 0.9,
    roughness: 0,
    ior: 1.2,
    chromaticAberration: 0.15,
    thickness: 0.1,
    clearcoat: 1,
    clearcoatRoughness: 0,
    color: new THREE.Color(1, 1, 1),
  },

  // Thick acrylic
  acrylic: {
    transmission: 0.95,
    roughness: 0.1,
    ior: 1.49,
    chromaticAberration: 0.05,
    thickness: 0.5,
    clearcoat: 0.7,
    clearcoatRoughness: 0.2,
  },
}

// Animation presets for common UI patterns
export const ANIMATION_PRESETS: Record<string, Partial<LiquidGlassProps>> = {
  // Subtle hover effect
  subtle: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.15, ease: "ease-out" },
  },

  // Bouncy interaction
  bouncy: {
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.9 },
    transition: { ease: "spring", stiffness: 400, damping: 15 },
  },

  // Smooth and elegant
  elegant: {
    whileHover: { scale: 1.03, rotationY: 0.05 },
    whileTap: { scale: 0.97 },
    transition: { duration: 0.3, ease: "ease-in-out" },
  },

  // Glitch effect
  glitch: {
    whileHover: {
      scale: 1.05,
      // chromaticAberration: 0.2,
      rotationZ: 0.01,
    },
    whileTap: { scale: 0.95 },
    transition: { duration: 0.1, ease: "ease-in" },
  },

  // Liquid ripple
  ripple: {
    whileHover: {
      scale: 1.08,
      // thickness: 0.5,
      // transmission: 0.9,
    },
    whileTap: { scale: 0.92 },
    transition: { ease: "spring", stiffness: 200, damping: 10 },
  },

  // Morphing shape
  // morph: {
  //   whileHover: {
  //     scaleX: 1.1,
  //     scaleY: 0.95,
  //     rotationZ: 0.02,
  //   },
  //   whileTap: { scale: 0.95 },
  //   transition: { duration: 0.4, ease: "back" },
  // },
}

// Size presets
export const SIZE_PRESETS = {
  xs: { width: 0.5, height: 0.5 },
  sm: { width: 0.75, height: 0.75 },
  md: { width: 1, height: 1 },
  lg: { width: 1.5, height: 1.5 },
  xl: { width: 2, height: 2 },

  // Common UI element sizes
  button: { width: 2, height: 0.6 },
  card: { width: 3, height: 2 },
  panel: { width: 4, height: 3 },
  modal: { width: 6, height: 4 },
} as const

// Border radius presets
export const BORDER_RADIUS_PRESETS = {
  none: 0,
  sm: 0.02,
  md: 0.05,
  lg: 0.1,
  xl: 0.2,
  full: 0.5,
} as const

// Common color palettes for glass
export const GLASS_COLORS = {
  // Neutral tones
  clear: new THREE.Color(1, 1, 1),
  smoke: new THREE.Color(0.9, 0.9, 0.9),
  charcoal: new THREE.Color(0.2, 0.2, 0.2),

  // Cool tones
  ice: new THREE.Color(0.9, 0.95, 1),
  ocean: new THREE.Color(0.8, 0.9, 1),
  mint: new THREE.Color(0.8, 1, 0.9),

  // Warm tones
  amber: new THREE.Color(1, 0.9, 0.7),
  rose: new THREE.Color(1, 0.9, 0.9),
  sunset: new THREE.Color(1, 0.8, 0.6),

  // Vibrant
  electric: new THREE.Color(0.7, 0.9, 1),
  neon: new THREE.Color(0.8, 1, 0.8),
  plasma: new THREE.Color(1, 0.7, 1),
} as const

// Performance optimization constants
export const PERFORMANCE = {
  // Geometry caching limits
  MAC_GEOMETRY_CACHE_SIZE: 100,

  // Animation thresholds
  MIN_ANIMATION_DELTA: 0.001,
  MAX_FPS: 120,

  // LOD settings
  HIGH_QUALITY_DISTANCE: 5,
  MEDIUM_QUALITY_DISTANCE: 15,
  LOW_QUALITY_DISTANCE: 30,
} as const
