export { default as LiquidGlass } from "./liquid-glass"
export type {
  LiquidGlassProps,
  AnimationValues,
  ExtrudeSettings,
} from "./types"

export {
  DEFAULT_PROPS,
  DEFAULT_ANIMATIONS,
  DEFAULT_POSITION,
  DEFAULT_ROTATION,
  MATERIAL_PRESETS,
  type MaterialPreset,
} from "./constants"

export {
  parseColor,
  createRoundedRectangleShape,
  mergeAnimations,
} from "./utils"
