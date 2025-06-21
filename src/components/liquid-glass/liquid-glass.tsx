import React, {
  useMemo,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
} from "react"
import { MeshTransmissionMaterial } from "@react-three/drei"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"

import type {
  LiquidGlassProps,
  AnimationValues,
  InteractionState,
} from "./liquid-glass.types"
import { useAnimation } from "../hooks/useAnimation"
import { useGlassInteractions } from "../hooks/useGlassInteractions"
import {
  createRoundedRectShape,
  parseColor,
  mergeTransitions,
} from "./liquid-glass.utils"
import {
  DEFAULT_PROPS,
  DEFAULT_ANIMATIONS,
  DEFAULT_EXTRUDE_SETTINGS,
  GLASS_PRESETS,
} from "./liquid-glass.constants"

export interface LiquidGlassRef {
  mesh: THREE.Mesh | null
  animate: (animation: AnimationValues) => void
  getAnimationState: () => AnimationValues
  reset: () => void
}

const LiquidGlass = forwardRef<LiquidGlassRef, LiquidGlassProps>(
  (
    {
      // Geometry props
      width = DEFAULT_PROPS.width,
      height = DEFAULT_PROPS.height,
      borderRadius = DEFAULT_PROPS.borderRadius,
      position = DEFAULT_PROPS.position,
      rotation,
      scale,
      extrudeSettings = DEFAULT_EXTRUDE_SETTINGS,
      segments = 8,

      // Material props - allow preset override
      // preset,
      transmission = DEFAULT_PROPS.transmission,
      roughness = DEFAULT_PROPS.roughness,
      ior = DEFAULT_PROPS.ior,
      chromaticAberration = DEFAULT_PROPS.chromaticAberration,
      color = DEFAULT_PROPS.color,
      thickness = DEFAULT_PROPS.thickness,
      clearcoat,
      clearcoatRoughness,
      envMapIntensity,

      // Animation state props
      whileHover,
      whileTap,
      whileActive,
      whileDisabled,
      whileInView,

      // State
      active = DEFAULT_PROPS.active,
      disabled = DEFAULT_PROPS.disabled,
      loading = false,

      // Animation control
      variants,
      initial = "idle",
      animate,
      exit,
      transition,
      layoutId,

      // Event handlers
      onClick,
      onToggle,
      onHoverStart,
      onHoverEnd,
      onTapStart,
      onTapEnd,
      onAnimationStart,
      onAnimationComplete,
      onAnimationUpdate,

      // Accessibility
      "aria-label": ariaLabel,
      "aria-pressed": ariaPressed,
      "aria-disabled": ariaDisabled,
      "aria-describedby": ariaDescribedBy,
      role = "button",
      tabIndex = DEFAULT_PROPS.tabIndex,

      // Performance
      frustumCulled = true,
      renderOrder = 0,

      // Content
      children,
    },
    ref
  ) => {
    const meshRef = useRef<THREE.Mesh>(null)

    // Get material properties (with preset support)
    const materialProps = useMemo(() => {
      const baseProps = {
        transmission,
        roughness,
        ior,
        chromaticAberration,
        color: parseColor(color),
        thickness,
        clearcoat,
        clearcoatRoughness,
        envMapIntensity,
      }

      // if (preset && GLASS_PRESETS[preset]) {
      //   return { ...GLASS_PRESETS[preset], ...baseProps }
      // }

      return baseProps
    }, [
      // preset,
      transmission,
      roughness,
      ior,
      chromaticAberration,
      color,
      thickness,
      clearcoat,
      clearcoatRoughness,
      envMapIntensity,
    ])

    // Animation system
    const { animationState, applyAnimation, getCurrentAnimation, isAnimating } =
      useAnimation(
        position,
        transition,
        onAnimationStart,
        onAnimationComplete,
        onAnimationUpdate
      )

    // Interaction handling
    const { isHovered, isPressed, handlers } = useGlassInteractions(
      disabled,
      active,
      {
        onClick,
        onToggle,
        onHoverStart,
        onHoverEnd,
        onTapStart,
        onTapEnd,
      }
    )

    // Geometry creation with memoization
    const shape = useMemo(() => {
      return createRoundedRectShape(width, height, borderRadius, segments)
    }, [width, height, borderRadius, segments])

    // Get current animation based on state
    const getCurrentAnimationState = useCallback((): AnimationValues => {
      // Priority order: disabled > pressed > focused > hovered > active > variants
      if (disabled && (whileDisabled || variants?.disabled)) {
        return (
          whileDisabled ||
          variants?.disabled ||
          DEFAULT_ANIMATIONS.whileDisabled
        )
      }

      if (isPressed && (whileTap || variants?.tap)) {
        return whileTap || variants?.tap || DEFAULT_ANIMATIONS.whileTap
      }

      if (isHovered && (whileHover || variants?.hovered)) {
        return whileHover || variants?.hovered || DEFAULT_ANIMATIONS.whileHover
      }

      if (active && (whileActive || variants?.active)) {
        return whileActive || variants?.active || DEFAULT_ANIMATIONS.whileActive
      }

      // Handle explicit animate prop
      if (animate) {
        if (typeof animate === "string" && variants?.[animate]) {
          return variants[animate]
        }
        if (typeof animate === "object") {
          return animate
        }
      }

      // Handle initial state
      if (typeof initial === "string" && variants?.[initial]) {
        return variants[initial]
      }
      if (typeof initial === "object") {
        return initial
      }

      return {}
    }, [
      disabled,
      isPressed,
      isHovered,
      active,
      animate,
      initial,
      variants,
      whileDisabled,
      whileTap,
      whileHover,
      whileActive,
    ])

    // Apply animation when state changes
    useEffect(() => {
      const currentAnimation = getCurrentAnimationState()
      applyAnimation(currentAnimation)
    }, [getCurrentAnimationState, applyAnimation])

    // Apply mesh transforms each frame
    useFrame(() => {
      if (!meshRef.current) return

      const state = animationState.current.current

      meshRef.current.position.set(state.x, state.y, state.z)
      meshRef.current.scale.set(state.scaleX, state.scaleY, state.scaleZ)
      meshRef.current.rotation.set(
        state.rotationX,
        state.rotationY,
        state.rotationZ
      )

      // Handle material opacity
      if (meshRef.current.material && "opacity" in meshRef.current.material) {
        const material = meshRef.current.material as THREE.Material & {
          opacity: number
        }
        material.opacity = state.opacity
        material.transparent = state.opacity < 1
      }
    })

    // Imperative API via ref
    React.useImperativeHandle(ref, () => ({
      mesh: meshRef.current,
      animate: applyAnimation,
      getAnimationState: getCurrentAnimation,
      reset: () => {
        applyAnimation({})
      },
    }))

    // Cleanup
    // useEffect(() => {
    //   return () => {
    //     if (meshRef.current) {
    //       disposeObject3D(meshRef.current)
    //     }
    //   }
    // }, [])

    // Apply scale prop if provided
    const finalScale = useMemo(() => {
      if (typeof scale === "number") {
        return [scale, scale, scale] as [number, number, number]
      }
      if (Array.isArray(scale)) {
        return scale
      }
      return [1, 1, 1] as [number, number, number]
    }, [scale])

    return (
      <group scale={finalScale} rotation={rotation}>
        <mesh
          ref={meshRef}
          position={position}
          frustumCulled={frustumCulled}
          renderOrder={renderOrder}
          receiveShadow
          castShadow
          {...handlers}
          // Accessibility attributes
          userData={{
            "aria-label": ariaLabel,
            "aria-pressed":
              ariaPressed ?? (role === "button" ? active : undefined),
            "aria-disabled": ariaDisabled ?? disabled,
            "aria-describedby": ariaDescribedBy,
            role,
            tabIndex: disabled ? -1 : tabIndex,
          }}
        >
          <extrudeGeometry args={[shape, extrudeSettings]} />
          <MeshTransmissionMaterial
            {...materialProps}
            background={materialProps.color}
          />
          {children}
        </mesh>
      </group>
    )
  }
)

LiquidGlass.displayName = "LiquidGlass"

export default LiquidGlass
