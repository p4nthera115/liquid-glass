import { useCallback } from "react"

interface useHandlersProps {
  active?: boolean
  disabled?: boolean
  onHoverStart?: () => void
  onHoverEnd?: () => void
  onTapStart?: () => void
  onTapEnd?: () => void
  onClick?: () => void
  onToggle?: (active: boolean) => void
  setIsHovered: (isHovered: boolean) => void
  setIsPressed: (isPressed: boolean) => void
}

export default function useHandlers(props: useHandlersProps) {
  const {
    active,
    disabled,
    onHoverStart,
    onHoverEnd,
    onTapStart,
    onTapEnd,
    setIsHovered,
    setIsPressed,
    onClick,
    onToggle,
  } = props

  const handlePointerEnter = useCallback(() => {
    if (disabled) return
    setIsHovered(true)
    onHoverStart?.()
  }, [disabled, onHoverStart])

  const handlePointerLeave = useCallback(() => {
    if (disabled) return
    setIsHovered(false)
    onHoverEnd?.()
  }, [disabled, onHoverEnd])

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

  return {
    handlePointerEnter,
    handlePointerLeave,
    handlePointerDown,
    handlePointerUp,
  }
}
