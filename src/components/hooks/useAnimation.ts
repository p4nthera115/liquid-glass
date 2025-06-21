import { useRef, useCallback, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import type {
  AnimationValues,
  TransitionConfig,
  AnimationState,
  UseAnimationReturn,
} from "../liquid-glass/liquid-glass.types"
import {
  easingFunctions,
  mergeTransitions,
  areAnimationValuesEqual,
  clamp,
} from "../liquid-glass/liquid-glass.utils"
import { DEFAULT_TRANSITION } from "../liquid-glass/liquid-glass.constants"

export function useAnimation(
  position: [number, number, number],
  globalTransition?: TransitionConfig,
  onAnimationStart?: (variant: string) => void,
  onAnimationComplete?: (variant: string) => void,
  onAnimationUpdate?: (progress: number) => void
): UseAnimationReturn {
  const animationState = useRef<AnimationState>({
    current: {
      x: position[0],
      y: position[1],
      z: position[2],
      scale: 1,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      opacity: 1,
    },
    target: {
      x: position[0],
      y: position[1],
      z: position[2],
      scale: 1,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      opacity: 1,
    },
    velocity: {
      x: 0,
      y: 0,
      z: 0,
      scale: 0,
      scaleX: 0,
      scaleY: 0,
      scaleZ: 0,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      opacity: 0,
    },
    activeTransition: mergeTransitions(DEFAULT_TRANSITION, globalTransition),
    animationProgress: 1,
    animatingTo: "idle",
    previousState: "idle",
    currentState: "idle",
  })

  const animationStartedRef = useRef(false)

  const applyAnimation = useCallback(
    (animation: AnimationValues, transition?: TransitionConfig) => {
      const state = animationState.current
      const basePos = position

      // Set target values with fallbacks
      state.target.x = animation.x !== undefined ? animation.x : basePos[0]
      state.target.y = animation.y !== undefined ? animation.y : basePos[1]
      state.target.z = animation.z !== undefined ? animation.z : basePos[2]
      state.target.scale = animation.scale !== undefined ? animation.scale : 1
      state.target.scaleX =
        animation.scaleX !== undefined ? animation.scaleX : animation.scale || 1
      state.target.scaleY =
        animation.scaleY !== undefined ? animation.scaleY : animation.scale || 1
      state.target.scaleZ =
        animation.scaleZ !== undefined ? animation.scaleZ : animation.scale || 1
      state.target.rotationX = animation.rotationX || 0
      state.target.rotationY = animation.rotationY || 0
      state.target.rotationZ = animation.rotationZ || 0
      state.target.opacity =
        animation.opacity !== undefined ? animation.opacity : 1

      // Update transition configuration
      state.activeTransition = mergeTransitions(
        globalTransition,
        animation.transition,
        transition
      )

      // Reset animation progress only if target has changed significantly
      const targetChanged = !areAnimationValuesEqual(
        state.target,
        { ...state.current },
        0.001
      )

      if (targetChanged) {
        state.animationProgress = 0
        animationStartedRef.current = true
        onAnimationStart?.(state.animatingTo)
      }
    },
    [position, globalTransition, onAnimationStart]
  )

  // Animation frame loop
  useFrame((_, delta) => {
    const state = animationState.current
    const transition = state.activeTransition

    // Skip if animation is complete
    if (state.animationProgress >= 1) {
      if (animationStartedRef.current) {
        animationStartedRef.current = false
        onAnimationComplete?.(state.animatingTo)
      }
      return
    }

    // Calculate progress delta with frame rate limiting
    const progressDelta = Math.min(
      delta / Math.max(transition.duration || 0.2, 0.016),
      0.1
    )
    state.animationProgress = Math.min(
      state.animationProgress + progressDelta,
      1
    )

    // Apply easing
    let easedProgress: number
    if (transition.ease === "spring") {
      // Spring physics animation
      const stiffness = transition.stiffness || 300
      const damping = clamp(transition.damping || 20, 0, 100)
      const mass = Math.max(transition.mass || 1, 0.01)

      Object.keys(state.current).forEach((key) => {
        const typedKey = key as keyof typeof state.current
        const currentVal = state.current[typedKey]
        const targetVal = state.target[typedKey]
        const velocityKey = typedKey as keyof typeof state.velocity

        const force = (targetVal - currentVal) * stiffness
        state.velocity[velocityKey] =
          state.velocity[velocityKey] +
          (force / mass) * delta * (1 - damping * delta * 0.01)

        state.current[typedKey] += state.velocity[velocityKey] * delta
      })
    } else {
      // Standard easing functions
      const easingFn =
        transition.customEasing ||
        easingFunctions[transition.ease || "ease-out"] ||
        easingFunctions["ease-out"]

      easedProgress = easingFn(state.animationProgress)

      Object.keys(state.current).forEach((key) => {
        const typedKey = key as keyof typeof state.current
        const currentVal = state.current[typedKey]
        const targetVal = state.target[typedKey]

        state.current[typedKey] =
          currentVal + (targetVal - currentVal) * easedProgress
      })
    }

    // Callback for animation updates
    onAnimationUpdate?.(state.animationProgress)
  })

  const getCurrentAnimation = useCallback((): AnimationValues => {
    return {
      x: animationState.current.current.x,
      y: animationState.current.current.y,
      z: animationState.current.current.z,
      scale: animationState.current.current.scale,
      scaleX: animationState.current.current.scaleX,
      scaleY: animationState.current.current.scaleY,
      scaleZ: animationState.current.current.scaleZ,
      rotationX: animationState.current.current.rotationX,
      rotationY: animationState.current.current.rotationY,
      rotationZ: animationState.current.current.rotationZ,
      opacity: animationState.current.current.opacity,
    }
  }, [])

  const isAnimating = useMemo(() => {
    return animationState.current.animationProgress < 1
  }, [animationState.current.animationProgress])

  return {
    animationState,
    applyAnimation,
    getCurrentAnimation,
    isAnimating,
  }
}
