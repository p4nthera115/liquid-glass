import { useState, useCallback } from "react"
import type {
  UseGlassInteractionsReturn,
  LiquidGlassEventHandlers,
} from "../liquid-glass/liquid-glass.types"

export function useGlassInteractions(
  disabled: boolean,
  active: boolean,
  eventHandlers: LiquidGlassEventHandlers
): UseGlassInteractionsReturn {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const { onClick, onToggle, onHoverStart, onHoverEnd, onTapStart, onTapEnd } =
    eventHandlers

  const handlePointerEnter = useCallback(
    (event?: any) => {
      if (disabled) return
      setIsHovered(true)
      onHoverStart?.(event)
    },
    [disabled, onHoverStart]
  )

  const handlePointerLeave = useCallback(
    (event?: any) => {
      setIsHovered(false)
      setIsPressed(false) // Reset pressed state when leaving
      onHoverEnd?.(event)
    },
    [onHoverEnd]
  )

  const handlePointerDown = useCallback(
    (event?: any) => {
      if (disabled) return
      setIsPressed(true)
      onTapStart?.(event)
    },
    [disabled, onTapStart]
  )

  const handlePointerUp = useCallback(
    (event?: any) => {
      if (disabled) return

      const wasPressed = isPressed
      setIsPressed(false)
      onTapEnd?.(event)

      // Only trigger click if the pointer was actually pressed on this element
      if (wasPressed) {
        onClick?.(event)
        onToggle?.(!active)
      }
    },
    [disabled, isPressed, onTapEnd, onClick, onToggle, active]
  )

  // Handle global pointer up (for cases where pointer leaves element while pressed)
  // const handleGlobalPointerUp = useCallback(() => {
  //   if (isPressed) {
  //     setIsPressed(false)
  //   }
  // }, [isPressed])

  return {
    isHovered,
    isPressed,
    handlers: {
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave,
      onPointerDown: handlePointerDown,
      onPointerUp: handlePointerUp,
    },
  }
}
