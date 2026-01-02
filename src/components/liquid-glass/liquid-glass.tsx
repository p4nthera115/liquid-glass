import { useMemo, useState, useCallback, useRef } from "react"
import { MeshTransmissionMaterial } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"

import type { LiquidGlassProps } from "./types"
import { DEFAULT_PROPS, MATERIAL_PRESETS } from "./constants"
import { parseColor, createRoundedRectangleShape } from "./utils"
import { useLiquidGlassAnimation } from "./use-liquid-glass-animation"

/**
 * LiquidGlass - A beautiful, interactive glass-effect component for React Three Fiber
 * 
 * Features:
 * - Realistic glass material with transmission, refraction, and chromatic aberration
 * - Spring-based animations with customizable physics
 * - Interactive states: hover, tap, active, disabled
 * - Material presets for common glass effects
 * - Keyboard accessible
 * 
 * @example
 * ```tsx
 * <LiquidGlass
 *   width={2}
 *   height={1}
 *   borderRadius={0.3}
 *   preset="crystal"
 *   whileHover={{ scale: 1.05 }}
 *   whileTap={{ scale: 0.95 }}
 * />
 * ```
 */
export default function LiquidGlass(props: LiquidGlassProps) {
  const {
    // Dimensions
    width = DEFAULT_PROPS.width,
    height = DEFAULT_PROPS.height,
    borderRadius = DEFAULT_PROPS.borderRadius,
    borderSmoothness = DEFAULT_PROPS.borderSmoothness,
    
    // Position & Transform
    position = DEFAULT_PROPS.position,
    rotation = DEFAULT_PROPS.rotation,

    // Material - get from preset or props
    preset,
    transmission = preset ? MATERIAL_PRESETS[preset].transmission : DEFAULT_PROPS.transmission,
    roughness = preset ? MATERIAL_PRESETS[preset].roughness : DEFAULT_PROPS.roughness,
    ior = preset ? MATERIAL_PRESETS[preset].ior : DEFAULT_PROPS.ior,
    chromaticAberration = preset ? MATERIAL_PRESETS[preset].chromaticAberration : DEFAULT_PROPS.chromaticAberration,
    anisotropicBlur = DEFAULT_PROPS.anisotropicBlur,
    blur = DEFAULT_PROPS.blur,
    color = preset ? MATERIAL_PRESETS[preset].color : DEFAULT_PROPS.color,
    thickness = preset ? MATERIAL_PRESETS[preset].thickness : DEFAULT_PROPS.thickness,
    wireframe = DEFAULT_PROPS.wireframe,

    // Animation states
    whileHover,
    whileTap,
    whileActive,
    whileDisabled,
    initial,
    animate,

    // State
    active = false,
    disabled = false,

    // Event handlers
    onClick,
    onToggle,
    onHoverStart,
    onHoverEnd,
    onTapStart,
    onTapEnd,
    onAnimationComplete,

    // Animation config
    transition,
    springStrength,
    damping,
    animationThreshold,

    // Geometry
    extrudeSettings = DEFAULT_PROPS.extrudeSettings,

    // Accessibility
    "aria-label": ariaLabel,
    tabIndex = 0,
    role = "button",
  } = props

  // Interaction state
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  // Use the animation hook
  const { meshRef, getCurrentDimensions } = useLiquidGlassAnimation({
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
    isHovered: isHovered || isFocused, // Treat focus like hover for animations
    isPressed,
    active,
    disabled,
    transition,
    springStrength,
    damping,
    animationThreshold,
    onAnimationComplete,
  })

  // Track dimensions for geometry updates
  const lastDimensionsRef = useRef({ width, height })
  const [geometryKey, setGeometryKey] = useState(0)

  // Check for geometry updates in animation frame
  useFrame(() => {
    if (!meshRef.current) return
    
    const dims = getCurrentDimensions()
    const threshold = animationThreshold ?? 0.001
    
    // Only update geometry if dimensions changed significantly
    if (
      Math.abs(dims.width - lastDimensionsRef.current.width) > threshold ||
      Math.abs(dims.height - lastDimensionsRef.current.height) > threshold
    ) {
      lastDimensionsRef.current = { ...dims }
      // Trigger geometry update by incrementing key
      setGeometryKey(k => k + 1)
    }
  })

  // Create geometry shape
  const shape = useMemo(() => {
    const dims = getCurrentDimensions()
    return createRoundedRectangleShape(
      dims.width,
      dims.height,
      borderRadius,
      borderSmoothness
    )
  }, [borderRadius, borderSmoothness, geometryKey, getCurrentDimensions])

  // Merged extrude settings with defaults
  const mergedExtrudeSettings = useMemo(() => ({
    ...DEFAULT_PROPS.extrudeSettings,
    ...extrudeSettings,
  }), [extrudeSettings])

  // Parsed color
  const parsedColor = useMemo(() => parseColor(color), [color])

  // === Event Handlers ===
  
  const handlePointerEnter = useCallback(() => {
    if (disabled) return
    setIsHovered(true)
    onHoverStart?.()
  }, [disabled, onHoverStart])

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false)
    setIsPressed(false) // Reset pressed state on leave
    onHoverEnd?.()
  }, [onHoverEnd])

  const handlePointerDown = useCallback(() => {
    if (disabled) return
    setIsPressed(true)
    onTapStart?.()
  }, [disabled, onTapStart])

  const handlePointerUp = useCallback(() => {
    if (disabled || !isPressed) return
    setIsPressed(false)
    onTapEnd?.()

    // Fire click/toggle handlers
    onClick?.()
    onToggle?.(!active)
  }, [disabled, isPressed, onTapEnd, onClick, onToggle, active])

  // Handle pointer cancel (e.g., touch interrupted)
  const handlePointerCancel = useCallback(() => {
    setIsPressed(false)
  }, [])

  // Keyboard accessibility
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (disabled) return
    
    const key = event.key
    if (key === "Enter" || key === " ") {
      event.stopPropagation()
      setIsPressed(true)
      onTapStart?.()
    }
  }, [disabled, onTapStart])

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (disabled) return
    
    const key = event.key
    if (key === "Enter" || key === " ") {
      event.stopPropagation()
      setIsPressed(false)
      onTapEnd?.()
      onClick?.()
      onToggle?.(!active)
    }
  }, [disabled, onTapEnd, onClick, onToggle, active])

  // Focus handlers for keyboard navigation
  const handleFocus = useCallback(() => {
    if (disabled) return
    setIsFocused(true)
  }, [disabled])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
    setIsPressed(false)
  }, [])

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      aria-label={ariaLabel}
      receiveShadow
      castShadow
      userData={{
        tabIndex,
        role,
        disabled,
        // Store handlers for potential DOM bridge
        onKeyDown: handleKeyDown,
        onKeyUp: handleKeyUp,
        onFocus: handleFocus,
        onBlur: handleBlur,
      }}
    >
      <extrudeGeometry args={[shape, mergedExtrudeSettings]} />
      <MeshTransmissionMaterial
        transmission={transmission}
        roughness={roughness}
        ior={ior}
        chromaticAberration={chromaticAberration}
        thickness={thickness}
        wireframe={wireframe}
        color={parsedColor}
        anisotropicBlur={anisotropicBlur}
        resolution={blur}
      />
    </mesh>
  )
}
