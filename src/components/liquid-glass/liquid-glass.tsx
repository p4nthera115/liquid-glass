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

import type { LiquidGlassProps, AnimationValues, SpringConfig } from "./types"
import { DEFAULT_PROPS, DEFAULT_ANIMATIONS } from "./constants"
import {
  parseColor,
  createRoundedRectangleShape,
  mergeAnimations,
  normalizeBorderRadius,
  springStepBorderRadius,
} from "./utils"

/**
 * LiquidGlass - An animated glass-effect 3D component
 *
 * Key behavior:
 * - Width/height animations regenerate geometry to preserve border radius
 * - Scale animations use GPU transforms (will scale border radius too)
 * - Position/rotation use GPU transforms for performance
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
 *   whileTap={{ width: 2.5 }}
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

    // Animation toggles
    animateOnTap = true,
    animateOnHover = true,

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
    positionSpring,
    rotationSpring,

    // Geometry settings
    extrudeSettings = DEFAULT_PROPS.extrudeSettings,

    // Accessibility
    "aria-label": ariaLabel,

    // Children
    children,
  } = props

  // Parse initial scale prop
  const baseScale = useMemo((): number => {
    if (typeof scaleProp === "number") {
      return scaleProp
    }
    // If array provided, use uniform (first value) for simplicity
    return scaleProp[0]
  }, [scaleProp])

  const meshRef = useRef<THREE.Mesh>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  // Expose mesh ref to parent via forwardRef
  useImperativeHandle(ref, () => meshRef.current!, [])

  // Normalize base border radius to array format for animation
  const baseBorderRadiusArr = useMemo((): [number, number, number, number] => {
    const maxRadius = Math.min(width / 2, height / 2)
    return normalizeBorderRadius(borderRadius, maxRadius)
  }, [borderRadius, width, height])

  // Animation state - uses width/height for geometry, scale for uniform scaling
  const animationState = useRef({
    // Current values
    currentWidth: width,
    currentHeight: height,
    currentScale: baseScale, // Uniform scale (affects border radius)
    currentPosition: [...position] as [number, number, number],
    currentRotation: [...rotation] as [number, number, number],
    currentOpacity: 1,
    currentBorderRadius: [...baseBorderRadiusArr] as [
      number,
      number,
      number,
      number
    ],

    // Target values
    targetWidth: width,
    targetHeight: height,
    targetScale: baseScale,
    targetPosition: [...position] as [number, number, number],
    targetRotation: [...rotation] as [number, number, number],
    targetOpacity: 1,
    targetBorderRadius: [...baseBorderRadiusArr] as [
      number,
      number,
      number,
      number
    ],

    // Velocities for spring physics
    widthVelocity: 0,
    heightVelocity: 0,
    scaleVelocity: 0,
    positionVelocity: [0, 0, 0] as [number, number, number],
    rotationVelocity: [0, 0, 0] as [number, number, number],
    opacityVelocity: 0,
    borderRadiusVelocity: [0, 0, 0, 0] as [number, number, number, number],

    // Base values for calculations
    baseWidth: width,
    baseHeight: height,
    baseScale: baseScale,
    basePosition: [...position] as [number, number, number],
    baseRotation: [...rotation] as [number, number, number],
    baseBorderRadius: [...baseBorderRadiusArr] as [
      number,
      number,
      number,
      number
    ],
  })

  // Resolve spring configs - merge user overrides with defaults
  const resolvedPositionSpring = useMemo(
    (): Required<SpringConfig> => ({
      strength: positionSpring?.strength ?? springStrength,
      damping: positionSpring?.damping ?? damping,
    }),
    [positionSpring, springStrength, damping]
  )

  const resolvedRotationSpring = useMemo(
    (): Required<SpringConfig> => ({
      strength: rotationSpring?.strength ?? springStrength,
      damping: rotationSpring?.damping ?? damping,
    }),
    [rotationSpring, springStrength, damping]
  )

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
      // Only apply tap animation if animateOnTap is true or whileTap is explicitly provided
      if (animateOnTap || whileTap) {
        return mergeAnimations(
          baseAnimation,
          whileTap || (animateOnTap ? DEFAULT_ANIMATIONS.whileTap : {})
        )
      }
    }

    if (isHovered) {
      // Only apply hover animation if animateOnHover is true or whileHover is explicitly provided
      if (animateOnHover || whileHover) {
        return mergeAnimations(
          baseAnimation,
          whileHover || (animateOnHover ? DEFAULT_ANIMATIONS.whileHover : {})
        )
      }
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
    animateOnTap,
    animateOnHover,
  ])

  // Apply animation targets
  const applyAnimation = useCallback((animation: AnimationValues) => {
    const state = animationState.current

    // Start with base values
    let targetWidth = state.baseWidth
    let targetHeight = state.baseHeight
    let targetScale = state.baseScale

    // Handle explicit width/height - these preserve border radius
    if (animation.width !== undefined) {
      targetWidth = animation.width
    }
    if (animation.height !== undefined) {
      targetHeight = animation.height
    }

    // Handle uniform scale - this scales everything including border radius
    if (animation.scale !== undefined) {
      targetScale = state.baseScale * animation.scale
    }

    // Handle scaleX/scaleY as width/height multipliers (preserves border radius)
    if (animation.scaleX !== undefined) {
      targetWidth = state.baseWidth * animation.scaleX
    }
    if (animation.scaleY !== undefined) {
      targetHeight = state.baseHeight * animation.scaleY
    }

    // scaleZ affects the uniform scale
    if (animation.scaleZ !== undefined) {
      targetScale = state.baseScale * animation.scaleZ
    }

    state.targetWidth = targetWidth
    state.targetHeight = targetHeight
    state.targetScale = targetScale

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

    // Border radius targets - normalize to array format
    if (animation.borderRadius !== undefined) {
      const maxRadius = Math.min(targetWidth / 2, targetHeight / 2)
      state.targetBorderRadius = normalizeBorderRadius(
        animation.borderRadius,
        maxRadius
      )
    } else {
      // Reset to base border radius
      state.targetBorderRadius = [...state.baseBorderRadius]
    }
  }, [])

  // Update base values when props change
  useEffect(() => {
    const state = animationState.current
    state.basePosition = [...position]
    state.baseRotation = [...rotation]
    state.baseWidth = width
    state.baseHeight = height
    state.baseScale = baseScale
    state.baseBorderRadius = [...baseBorderRadiusArr]

    const currentAnimation = getCurrentAnimation()
    applyAnimation(currentAnimation)
  }, [
    getCurrentAnimation,
    applyAnimation,
    position,
    rotation,
    width,
    height,
    baseScale,
    baseBorderRadiusArr,
  ])

  // Track if geometry needs to be updated
  const [geometryUpdateFlag, setGeometryUpdateFlag] = useState(0)

  // Spring physics helper - accepts optional spring config override
  const springStep = (
    current: number,
    target: number,
    velocity: number,
    delta: number,
    strength: number = springStrength,
    damp: number = damping
  ): [number, number, boolean] => {
    const displacement = target - current
    const springForce = displacement * strength
    const newVelocity = (velocity + springForce * delta) * damp
    const newValue = current + newVelocity * delta * 50

    // Check if still animating
    const isAnimating =
      Math.abs(displacement) > animationThreshold ||
      Math.abs(newVelocity) > animationThreshold

    if (!isAnimating) {
      return [target, 0, false]
    }

    return [newValue, newVelocity, true]
  }

  // Animation frame loop
  useFrame((_, delta) => {
    if (!meshRef.current) return

    const state = animationState.current
    let geometryNeedsUpdate = false

    // Spring physics for width (triggers geometry update)
    let widthAnimating: boolean
    ;[state.currentWidth, state.widthVelocity, widthAnimating] = springStep(
      state.currentWidth,
      state.targetWidth,
      state.widthVelocity,
      delta
    )
    if (widthAnimating) geometryNeedsUpdate = true

    // Spring physics for height (triggers geometry update)
    let heightAnimating: boolean
    ;[state.currentHeight, state.heightVelocity, heightAnimating] = springStep(
      state.currentHeight,
      state.targetHeight,
      state.heightVelocity,
      delta
    )
    if (heightAnimating) geometryNeedsUpdate = true

    // Spring physics for border radius (triggers geometry update)
    let borderRadiusAnimating: boolean
    ;[
      state.currentBorderRadius,
      state.borderRadiusVelocity,
      borderRadiusAnimating,
    ] = springStepBorderRadius(
      state.currentBorderRadius,
      state.targetBorderRadius,
      state.borderRadiusVelocity,
      delta,
      springStrength,
      damping,
      animationThreshold
    )
    if (borderRadiusAnimating)
      geometryNeedsUpdate = true

      // Spring physics for uniform scale (GPU transform)
    ;[state.currentScale, state.scaleVelocity] = springStep(
      state.currentScale,
      state.targetScale,
      state.scaleVelocity,
      delta
    )

    // Spring physics for position (uses positionSpring config)
    for (let i = 0; i < 3; i++) {
      ;[state.currentPosition[i], state.positionVelocity[i]] = springStep(
        state.currentPosition[i],
        state.targetPosition[i],
        state.positionVelocity[i],
        delta,
        resolvedPositionSpring.strength,
        resolvedPositionSpring.damping
      )
    }

    // Spring physics for rotation (uses rotationSpring config)
    for (let i = 0; i < 3; i++) {
      ;[state.currentRotation[i], state.rotationVelocity[i]] = springStep(
        state.currentRotation[i],
        state.targetRotation[i],
        state.rotationVelocity[i],
        delta,
        resolvedRotationSpring.strength,
        resolvedRotationSpring.damping
      )
    }

    // Spring physics for opacity
    ;[state.currentOpacity, state.opacityVelocity] = springStep(
      state.currentOpacity,
      state.targetOpacity,
      state.opacityVelocity,
      delta
    )

    // Apply GPU transforms (scale is uniform, preserves aspect)
    meshRef.current.scale.setScalar(state.currentScale)
    meshRef.current.position.set(...state.currentPosition)
    meshRef.current.rotation.set(...state.currentRotation)

    // Update material opacity if needed
    if (meshRef.current.material && "opacity" in meshRef.current.material) {
      ;(meshRef.current.material as THREE.Material).opacity =
        state.currentOpacity
      ;(meshRef.current.material as THREE.Material).transparent =
        state.currentOpacity < 1
    }

    // Trigger geometry update if width/height changed
    if (geometryNeedsUpdate) {
      setGeometryUpdateFlag((prev) => prev + 1)
    }
  })

  // Create geometry - recreated when width/height/borderRadius animate
  const shape = useMemo(() => {
    const currentWidth = animationState.current?.currentWidth || width
    const currentHeight = animationState.current?.currentHeight || height
    const currentBorderRadius =
      animationState.current?.currentBorderRadius || baseBorderRadiusArr

    return createRoundedRectangleShape(
      currentWidth,
      currentHeight,
      currentBorderRadius,
      borderSmoothness
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    width,
    height,
    borderRadius,
    borderSmoothness,
    geometryUpdateFlag,
    baseBorderRadiusArr,
  ])

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
