import * as THREE from "three"
import {
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react"
import { MeshTransmissionMaterial } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"

import type { LiquidGlassProps, AnimationValues, AnimationState } from "./types"
import { DEFAULT_PROPS, DEFAULT_ANIMATIONS } from "./constants"
import {
  parseColor,
  createRoundedRectangleShape,
  mergeAnimations,
} from "./utils"

/**
 * LiquidGlass - A performant, animated glass-effect 3D component
 *
 * Performance optimizations:
 * - Geometry is created once and cached (only recreated when base dimensions change)
 * - Animations use GPU-accelerated scale/position/rotation transforms
 * - Spring physics run on the render loop without triggering React re-renders
 *
 * @example
 * ```tsx
 * <LiquidGlass
 *   width={2}
 *   height={1}
 *   borderRadius={0.3}
 *   position={[0, 0, 0]}
 *   rotation={[0, Math.PI / 4, 0]}
 *   whileHover={{ scale: 1.1 }}
 *   whileTap={{ scale: 0.95 }}
 * />
 * ```
 */
const LiquidGlass = forwardRef<THREE.Mesh, LiquidGlassProps>((props, ref) => {
  const {
    // Geometry
    width = DEFAULT_PROPS.width,
    height = DEFAULT_PROPS.height,
    borderRadius = DEFAULT_PROPS.borderRadius,
    borderSmoothness = DEFAULT_PROPS.borderSmoothness,

    // Transform
    position = DEFAULT_PROPS.position,
    rotation = DEFAULT_PROPS.rotation,
    scale: scaleProp = DEFAULT_PROPS.scale,

    // Material
    transmission = DEFAULT_PROPS.transmission,
    roughness = DEFAULT_PROPS.roughness,
    ior = DEFAULT_PROPS.ior,
    chromaticAberration = DEFAULT_PROPS.chromaticAberration,
    anisotropicBlur = DEFAULT_PROPS.anisotropicBlur,
    blur = DEFAULT_PROPS.blur,
    color = DEFAULT_PROPS.color,
    thickness = DEFAULT_PROPS.thickness,
    wireframe = DEFAULT_PROPS.wireframe,

    // Animation states
    whileHover,
    whileTap,
    whileActive,
    whileDisabled,

    // State
    active = false,
    disabled = false,
    visible = DEFAULT_PROPS.visible,

    // Callbacks
    onClick,
    onToggle,
    onHoverStart,
    onHoverEnd,
    onTapStart,
    onTapEnd,

    // Animation settings
    springStrength = DEFAULT_PROPS.springStrength,
    damping = DEFAULT_PROPS.damping,
    animationThreshold = DEFAULT_PROPS.animationThreshold,

    // Geometry settings
    extrudeSettings = DEFAULT_PROPS.extrudeSettings,

    // Accessibility
    "aria-label": ariaLabel,

    // Children
    children,
  } = props

  // Parse initial scale prop
  const baseScale = useMemo((): [number, number, number] => {
    if (typeof scaleProp === "number") {
      return [scaleProp, scaleProp, scaleProp]
    }
    return scaleProp
  }, [scaleProp])

  const meshRef = useRef<THREE.Mesh>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  // Expose mesh ref to parent via forwardRef
  useImperativeHandle(ref, () => meshRef.current!, [])

  // Animation state - kept in ref to avoid re-renders during animation
  const animationState = useRef<AnimationState>({
    // Current values (start at base)
    currentScaleX: baseScale[0],
    currentScaleY: baseScale[1],
    currentScaleZ: baseScale[2],
    currentPosition: [...position],
    currentRotation: [...rotation],
    currentOpacity: 1,

    // Target values
    targetScaleX: baseScale[0],
    targetScaleY: baseScale[1],
    targetScaleZ: baseScale[2],
    targetPosition: [...position],
    targetRotation: [...rotation],
    targetOpacity: 1,

    // Velocities for spring physics
    scaleXVelocity: 0,
    scaleYVelocity: 0,
    scaleZVelocity: 0,
    positionVelocity: [0, 0, 0],
    rotationVelocity: [0, 0, 0],
    opacityVelocity: 0,

    // Base values for calculations
    basePosition: [...position],
    baseRotation: [...rotation],
  })

  // Get current animation based on state with proper layering
  const getCurrentAnimation = useCallback((): AnimationValues => {
    let baseAnimation: AnimationValues = {}

    if (active) {
      baseAnimation = whileActive || DEFAULT_ANIMATIONS.whileActive
    }

    if (disabled) {
      return mergeAnimations(
        baseAnimation,
        whileDisabled || DEFAULT_ANIMATIONS.whileDisabled
      )
    }

    if (isPressed) {
      return mergeAnimations(
        baseAnimation,
        whileTap || DEFAULT_ANIMATIONS.whileTap
      )
    }

    if (isHovered) {
      return mergeAnimations(
        baseAnimation,
        whileHover || DEFAULT_ANIMATIONS.whileHover
      )
    }

    return baseAnimation
  }, [
    disabled,
    isPressed,
    isHovered,
    active,
    whileDisabled,
    whileTap,
    whileHover,
    whileActive,
  ])

  // Apply animation targets - now uses scale transforms instead of geometry recreation
  const applyAnimation = useCallback(
    (animation: AnimationValues) => {
      const state = animationState.current

      // Calculate target scales
      let targetScaleX = baseScale[0]
      let targetScaleY = baseScale[1]
      let targetScaleZ = baseScale[2]

      // Handle uniform scale
      if (animation.scale !== undefined) {
        targetScaleX = baseScale[0] * animation.scale
        targetScaleY = baseScale[1] * animation.scale
        targetScaleZ = baseScale[2] * animation.scale
      }

      // Handle per-axis scale (overrides uniform if set)
      if (animation.scaleX !== undefined) {
        targetScaleX = baseScale[0] * animation.scaleX
      }
      if (animation.scaleY !== undefined) {
        targetScaleY = baseScale[1] * animation.scaleY
      }
      if (animation.scaleZ !== undefined) {
        targetScaleZ = baseScale[2] * animation.scaleZ
      }

      // Handle explicit width/height as scale factors relative to base
      if (animation.width !== undefined) {
        targetScaleX = (animation.width / width) * baseScale[0]
      }
      if (animation.height !== undefined) {
        targetScaleY = (animation.height / height) * baseScale[1]
      }

      state.targetScaleX = targetScaleX
      state.targetScaleY = targetScaleY
      state.targetScaleZ = targetScaleZ

      // Position targets
      state.targetPosition = [
        animation.x ?? state.basePosition[0],
        animation.y ?? state.basePosition[1],
        animation.z ?? state.basePosition[2],
      ]

      // Rotation targets (add to base rotation)
      state.targetRotation = [
        state.baseRotation[0] + (animation.rotateX ?? 0),
        state.baseRotation[1] + (animation.rotateY ?? 0),
        state.baseRotation[2] + (animation.rotateZ ?? 0),
      ]

      state.targetOpacity = animation.opacity ?? 1
    },
    [baseScale, width, height]
  )

  // Update base values and animation when props change
  useEffect(() => {
    const state = animationState.current
    state.basePosition = [...position]
    state.baseRotation = [...rotation]

    const currentAnimation = getCurrentAnimation()
    applyAnimation(currentAnimation)
  }, [getCurrentAnimation, applyAnimation, position, rotation])

  // Spring physics helper
  const springStep = (
    current: number,
    target: number,
    velocity: number,
    delta: number
  ): [number, number] => {
    const displacement = target - current
    const springForce = displacement * springStrength
    const newVelocity = (velocity + springForce * delta) * damping
    const newValue = current + newVelocity * delta * 50

    // Stop small movements
    if (
      Math.abs(displacement) < animationThreshold &&
      Math.abs(newVelocity) < animationThreshold
    ) {
      return [target, 0]
    }

    return [newValue, newVelocity]
  }

  // Animation frame loop - runs every frame, updates mesh transforms directly
  useFrame((_, delta) => {
    if (!meshRef.current) return

    const state = animationState.current

    // Spring physics for scale
    ;[state.currentScaleX, state.scaleXVelocity] = springStep(
      state.currentScaleX,
      state.targetScaleX,
      state.scaleXVelocity,
      delta
    )
    ;[state.currentScaleY, state.scaleYVelocity] = springStep(
      state.currentScaleY,
      state.targetScaleY,
      state.scaleYVelocity,
      delta
    )
    ;[state.currentScaleZ, state.scaleZVelocity] = springStep(
      state.currentScaleZ,
      state.targetScaleZ,
      state.scaleZVelocity,
      delta
    )

    // Spring physics for position
    for (let i = 0; i < 3; i++) {
      ;[state.currentPosition[i], state.positionVelocity[i]] = springStep(
        state.currentPosition[i],
        state.targetPosition[i],
        state.positionVelocity[i],
        delta
      )
    }

    // Spring physics for rotation
    for (let i = 0; i < 3; i++) {
      ;[state.currentRotation[i], state.rotationVelocity[i]] = springStep(
        state.currentRotation[i],
        state.targetRotation[i],
        state.rotationVelocity[i],
        delta
      )
    }

    // Spring physics for opacity
    ;[state.currentOpacity, state.opacityVelocity] = springStep(
      state.currentOpacity,
      state.targetOpacity,
      state.opacityVelocity,
      delta
    )

    // Apply transforms directly to mesh (no React re-render needed)
    meshRef.current.scale.set(
      state.currentScaleX,
      state.currentScaleY,
      state.currentScaleZ
    )
    meshRef.current.position.set(...state.currentPosition)
    meshRef.current.rotation.set(...state.currentRotation)

    // Update material opacity if needed
    if (meshRef.current.material && "opacity" in meshRef.current.material) {
      ;(meshRef.current.material as THREE.Material).opacity =
        state.currentOpacity
      ;(meshRef.current.material as THREE.Material).transparent =
        state.currentOpacity < 1
    }
  })

  // Create geometry - only when base dimensions change (not during animation)
  const shape = useMemo(() => {
    return createRoundedRectangleShape(
      width,
      height,
      borderRadius,
      borderSmoothness
    )
  }, [width, height, borderRadius, borderSmoothness])

  // Merged extrude settings
  const mergedExtrudeSettings = useMemo(() => {
    return { ...DEFAULT_PROPS.extrudeSettings, ...extrudeSettings }
  }, [extrudeSettings])

  // Parsed color
  const parsedColor = useMemo(() => parseColor(color), [color])

  // Event handlers
  const handlePointerEnter = useCallback(() => {
    if (disabled) return
    setIsHovered(true)
    onHoverStart?.()
  }, [disabled, onHoverStart])

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false)
    onHoverEnd?.()
  }, [onHoverEnd])

  const handlePointerDown = useCallback(() => {
    if (disabled) return
    setIsPressed(true)
    onTapStart?.()
  }, [disabled, onTapStart])

  const handlePointerUp = useCallback(() => {
    if (disabled) return
    setIsPressed(false)
    onTapEnd?.()

    if (onClick) {
      onClick()
    }

    if (onToggle) {
      onToggle(!active)
    }
  }, [disabled, onTapEnd, onClick, onToggle, active])

  if (!visible) return null

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      aria-label={ariaLabel}
      receiveShadow
      castShadow
    >
      <extrudeGeometry args={[shape, mergedExtrudeSettings]} />
      {children || (
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
      )}
    </mesh>
  )
})

LiquidGlass.displayName = "LiquidGlass"

export default LiquidGlass
