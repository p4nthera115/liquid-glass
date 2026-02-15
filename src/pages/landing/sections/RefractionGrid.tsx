import { useRef, useMemo, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import type { ScrollState } from "../LandingPage"

const COLS = 20
const ROWS = 24
const SPACING = 0.14
const DOT_RADIUS = 0.02
const DOT_SEGMENTS = 8
const COUNT = COLS * ROWS

// Soft pastels that pop through glass refraction
const PALETTE = [
  new THREE.Color("#a78bfa"), // violet
  new THREE.Color("#818cf8"), // indigo
  new THREE.Color("#6ee7b7"), // emerald
  new THREE.Color("#f9a8d4"), // pink
  new THREE.Color("#93c5fd"), // blue
  new THREE.Color("#fca5a5"), // red
  new THREE.Color("#fcd34d"), // amber
]

interface RefractionGridProps {
  scrollState: ScrollState
}

export default function RefractionGrid({ scrollState }: RefractionGridProps) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Apply per-instance colors once after mount
  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    const color = new THREE.Color()
    for (let i = 0; i < COUNT; i++) {
      const c = PALETTE[((i % COLS) + Math.floor(i / COLS)) % PALETTE.length]
      color.copy(c)
      mesh.setColorAt(i, color)
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [])

  useFrame(() => {
    const mesh = meshRef.current
    const group = groupRef.current
    if (!mesh || !group) return

    const progress = scrollState.progress
    // Animate in from scroll 0.5→1.0, capped at 1/3 for the radial falloff look
    const t = Math.min(1 / 3, Math.max(0, (progress - 0.5) / 1.5))

    // Staggered scale-in from center outward
    const halfX = ((COLS - 1) * SPACING) / 2
    const halfY = ((ROWS - 1) * SPACING) / 2
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const i = row * COLS + col
        const dx = (col - (COLS - 1) / 2) / ((COLS - 1) / 2)
        const dy = (row - (ROWS - 1) / 2) / ((ROWS - 1) / 2)
        const dist = Math.sqrt(dx * dx + dy * dy) / Math.SQRT2
        // Radial size falloff: center=1, edges shrink down
        const maxScale = Math.max(0.15, 1 - dist * 0.85)
        const dotT = Math.min(1, Math.max(0, (t - dist * 0.4) / 0.6))
        const eased = 1 - Math.pow(1 - dotT, 3)

        dummy.position.set(col * SPACING - halfX, row * SPACING - halfY, 0)
        dummy.scale.setScalar(eased * maxScale)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
      }
    }
    mesh.instanceMatrix.needsUpdate = true

    // Slide group in
    // const slideT = Math.min(1, Math.max(0, (progress - 0.35) / 0.35))
    // group.position.x = THREE.MathUtils.lerp(-1.7, -1.4, slideT)
  })

  return (
    <group ref={groupRef} position={[-1.35, 0, -0.5]}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
        <circleGeometry args={[DOT_RADIUS, DOT_SEGMENTS]} />
        <meshStandardMaterial vertexColors toneMapped={false} />
      </instancedMesh>
    </group>
  )
}
