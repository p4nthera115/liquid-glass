import { useRef, useCallback, useEffect } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"

import type { 
  AnimationValues, 
  TransitionConfig, 
  AnimationState,
} from "./types"
import { DEFAULT_ANIMATIONS, DEFAULT_TRANSITION } from "./constants"
import { 
  mergeAnimations, 
  mergeTransition,
  springStep,
  springStep3D,
  createInitialAnimationState,
} from "./utils"

interface UseLiquidGlassAnimationProps {
  // Base dimensions
  width: number
  height: number
  position: [number, number, number]
  rotation: [number, number, number]
  
  // Animation states
  whileHover?: AnimationValues
  whileTap?: AnimationValues
  whileActive?: AnimationValues
  whileDisabled?: AnimationValues
  initial?: AnimationValues | false
  animate?: AnimationValues
  
  // State
  isHovered: boolean
  isPressed: boolean
  active: boolean
  disabled: boolean
  
  // Transition config
  transition?: TransitionConfig
  
  // Legacy props for backwards compatibility
  springStrength?: number
  damping?: number
  animationThreshold?: number
  
  // Callbacks
  onAnimationComplete?: () => void
}

interface AnimationResult {
  meshRef: React.RefObject<THREE.Mesh | null>
  getCurrentDimensions: () => { width: number; height: number }
  isAnimating: () => boolean
}

/**
 * Custom hook for managing LiquidGlass animations
 * Separates animation logic from the main component for better maintainability
 */
export function useLiquidGlassAnimation(props: UseLiquidGlassAnimationProps): AnimationResult {
  const {
    width,
    height,
    position,
    rotation,
    whileHover,
    whileTap,
    whileActive,
    whileDisabled,
    initial,
    animate,
    isHovered,
    isPressed,
    active,
    disabled,
    transition,
    springStrength,
    damping,
    animationThreshold,
    onAnimationComplete,
  } = props

  const meshRef = useRef<THREE.Mesh>(null)
  
  // Animation state stored in ref to avoid re-renders
  const animationState = useRef<AnimationState>(
    createInitialAnimationState(width, height, position, rotation, initial)
  )
  
  // Track if we've fired the completion callback
  const completionFired = useRef(false)
  
  // Build transition config from props
  const getTransitionConfig = useCallback((): Required<TransitionConfig> => {
    // Support legacy props
    const legacyConfig: TransitionConfig = {}
    if (springStrength !== undefined) legacyConfig.stiffness = springStrength
    if (damping !== undefined) legacyConfig.damping = damping
    if (animationThreshold !== undefined) legacyConfig.threshold = animationThreshold
    
    return mergeTransition(DEFAULT_TRANSITION, legacyConfig, transition)
  }, [springStrength, damping, animationThreshold, transition])

  // Get current animation based on component state
  const getCurrentAnimation = useCallback((): AnimationValues => {
    let baseAnimation: AnimationValues = {}

    // Apply animate prop as base
    if (animate) {
      baseAnimation = { ...animate }
    }

    // Layer active state
    if (active) {
      baseAnimation = mergeAnimations(
        baseAnimation,
        whileActive || DEFAULT_ANIMATIONS.whileActive
      )
    }

    // Disabled overrides everything
    if (disabled) {
      return mergeAnimations(
        baseAnimation,
        whileDisabled || DEFAULT_ANIMATIONS.whileDisabled
      )
    }

    // Tap state (highest priority after disabled)
    if (isPressed) {
      return mergeAnimations(
        baseAnimation,
        whileTap || DEFAULT_ANIMATIONS.whileTap
      )
    }

    // Hover state
    if (isHovered) {
      return mergeAnimations(
        baseAnimation,
        whileHover || DEFAULT_ANIMATIONS.whileHover
      )
    }

    return baseAnimation
  }, [
    animate,
    active,
    disabled,
    isPressed,
    isHovered,
    whileActive,
    whileDisabled,
    whileTap,
    whileHover,
  ])

  // Apply animation targets
  const applyAnimation = useCallback((animation: AnimationValues) => {
    const state = animationState.current

    // Calculate target dimensions
    let targetWidth = state.baseWidth
    let targetHeight = state.baseHeight
    let scaleZ = 1

    // Explicit dimensions
    if (animation.width !== undefined) {
      targetWidth = animation.width
    }
    if (animation.height !== undefined) {
      targetHeight = animation.height
    }

    // Scale modifiers (apply to base dimensions)
    if (animation.scale !== undefined) {
      targetWidth = state.baseWidth * animation.scale
      targetHeight = state.baseHeight * animation.scale
      scaleZ = animation.scale
    }
    if (animation.scaleX !== undefined) {
      targetWidth = state.baseWidth * animation.scaleX
    }
    if (animation.scaleY !== undefined) {
      targetHeight = state.baseHeight * animation.scaleY
    }
    if (animation.scaleZ !== undefined) {
      scaleZ = animation.scaleZ
    }

    state.targetWidth = targetWidth
    state.targetHeight = targetHeight
    state.targetScaleZ = scaleZ

    // Position (offset from base)
    state.targetPosition = [
      animation.x ?? state.basePosition[0],
      animation.y ?? state.basePosition[1],
      animation.z ?? state.basePosition[2],
    ]

    // Rotation (offset from base)
    state.targetRotation = [
      (animation.rotateX ?? 0) + state.baseRotation[0],
      (animation.rotateY ?? 0) + state.baseRotation[1],
      (animation.rotateZ ?? 0) + state.baseRotation[2],
    ]

    state.targetOpacity = animation.opacity ?? 1
    state.isAnimating = true
    completionFired.current = false
  }, [])

  // Update base values when props change
  useEffect(() => {
    const state = animationState.current
    state.basePosition = [...position]
    state.baseRotation = [...rotation]
    state.baseWidth = width
    state.baseHeight = height

    // Apply current animation with new base values
    const currentAnimation = getCurrentAnimation()
    applyAnimation(currentAnimation)
  }, [position, rotation, width, height, getCurrentAnimation, applyAnimation])

  // Update animation when state changes
  useEffect(() => {
    const currentAnimation = getCurrentAnimation()
    applyAnimation(currentAnimation)
  }, [getCurrentAnimation, applyAnimation])

  // Animation frame loop
  useFrame((_, delta) => {
    if (!meshRef.current) return

    const state = animationState.current
    const config = getTransitionConfig()
    
    // Get animation-specific transition if provided
    const currentAnimation = getCurrentAnimation()
    const animConfig = currentAnimation.transition 
      ? mergeTransition(config, currentAnimation.transition)
      : config

    let allSettled = true
    let geometryNeedsUpdate = false

    // Spring physics for width
    const [newWidth, newWidthVel, widthSettled] = springStep(
      state.currentWidth,
      state.targetWidth,
      state.widthVelocity,
      delta,
      animConfig
    )
    state.currentWidth = newWidth
    state.widthVelocity = newWidthVel
    if (!widthSettled) {
      allSettled = false
      geometryNeedsUpdate = true
    }

    // Spring physics for height
    const [newHeight, newHeightVel, heightSettled] = springStep(
      state.currentHeight,
      state.targetHeight,
      state.heightVelocity,
      delta,
      animConfig
    )
    state.currentHeight = newHeight
    state.heightVelocity = newHeightVel
    if (!heightSettled) {
      allSettled = false
      geometryNeedsUpdate = true
    }

    // Spring physics for Z scale
    const [newScaleZ, newScaleZVel, scaleZSettled] = springStep(
      state.currentScaleZ,
      state.targetScaleZ,
      state.scaleZVelocity,
      delta,
      animConfig
    )
    state.currentScaleZ = newScaleZ
    state.scaleZVelocity = newScaleZVel
    if (!scaleZSettled) allSettled = false

    // Spring physics for position (3D)
    const [newPos, newPosVel, posSettled] = springStep3D(
      state.currentPosition,
      state.targetPosition,
      state.positionVelocity,
      delta,
      animConfig
    )
    state.currentPosition = newPos
    state.positionVelocity = newPosVel
    if (!posSettled) allSettled = false

    // Spring physics for rotation (3D)
    const [newRot, newRotVel, rotSettled] = springStep3D(
      state.currentRotation,
      state.targetRotation,
      state.rotationVelocity,
      delta,
      animConfig
    )
    state.currentRotation = newRot
    state.rotationVelocity = newRotVel
    if (!rotSettled) allSettled = false

    // Spring physics for opacity
    const [newOpacity, newOpacityVel, opacitySettled] = springStep(
      state.currentOpacity,
      state.targetOpacity,
      state.opacityVelocity,
      delta,
      animConfig
    )
    state.currentOpacity = newOpacity
    state.opacityVelocity = newOpacityVel
    if (!opacitySettled) allSettled = false

    // Apply transformations to mesh
    meshRef.current.scale.set(1, 1, state.currentScaleZ)
    meshRef.current.position.set(...state.currentPosition)
    meshRef.current.rotation.set(...state.currentRotation)

    // Update material opacity
    if (meshRef.current.material && "opacity" in meshRef.current.material) {
      const material = meshRef.current.material as THREE.Material
      material.opacity = state.currentOpacity
      material.transparent = state.currentOpacity < 1
    }

    // Update animation state
    const wasAnimating = state.isAnimating
    state.isAnimating = !allSettled

    // Fire completion callback
    if (wasAnimating && allSettled && !completionFired.current) {
      completionFired.current = true
      state.hasInitialized = true
      onAnimationComplete?.()
    }

    // Return geometry update flag for the component to handle
    if (geometryNeedsUpdate && meshRef.current.userData) {
      meshRef.current.userData.needsGeometryUpdate = true
    }
  })

  // Public API
  const getCurrentDimensions = useCallback(() => ({
    width: animationState.current.currentWidth,
    height: animationState.current.currentHeight,
  }), [])

  const isAnimating = useCallback(() => animationState.current.isAnimating, [])

  return {
    meshRef,
    getCurrentDimensions,
    isAnimating,
  }
}

export default useLiquidGlassAnimation

