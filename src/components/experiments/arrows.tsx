import { LiquidGlass } from "../liquid-glass"
import { VideoTexture } from "@react-three/drei"
import { extend } from "@react-three/fiber"
import { geometry } from "maath"
import { Color } from "three"

extend({ RoundedPlaneGeometry: geometry.RoundedPlaneGeometry })

export default function Arrows() {
  return (
    <>
      {/* Video */}
      <mesh position={[0, 0, -0.4]}>
        <roundedPlaneGeometry args={[1, 1, 0.5]} />
        <VideoTexture src="/wave.mp4">
          {(texture) => <meshBasicMaterial map={texture} />}
        </VideoTexture>
      </mesh>

      <directionalLight
        color={0xffffff}
        intensity={3}
        position={[0.2, 0.2, 0.8]}
      />

      <LiquidGlass
        position={[0, 0, 0.2]}
        width={0.8}
        height={0.8}
        borderRadius={0.5}
        color={new Color(1.5, 1.5, 1.5)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ z: 0.15 }}
        ior={3}
        thickness={1}
        roughness={0}
        borderSmoothness={150}
        extrudeSettings={{
          depth: 0,
          bevelEnabled: true,
          bevelThickness: 0.02,
          bevelSize: 0.05,
          bevelSegments: 30,
        }}
      />
    </>
  )
}
