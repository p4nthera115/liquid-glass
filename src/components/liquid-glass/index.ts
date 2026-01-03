// Main component
export { default as LiquidGlass } from "./liquid-glass"

// Hook for custom implementations
export { useLiquidGlassAnimation } from "./use-liquid-glass-animation"

// Types
export type {
  LiquidGlassProps,
  AnimationValues,
  TransitionConfig,
  ExtrudeSettings,
  MaterialPreset,
  AnimationState,
} from "./types"

// Constants
export {
  DEFAULT_PROPS,
  DEFAULT_ANIMATIONS,
  MATERIAL_PRESETS,
  TRANSITION_PRESETS,
  DEFAULT_TRANSITION,
  DEFAULT_EXTRUDE_SETTINGS,
} from "./constants"

// Utilities
export {
  parseColor,
  createRoundedRectangleShape,
  mergeAnimations,
  mergeTransition,
  springStep,
  springStep3D,
  createInitialAnimationState,
  clamp,
  lerp,
} from "./utils"
