import { Canvas } from "@react-three/fiber"
import { LiquidGlass } from "./components/liquid-glass"
import { VideoTexture, OrbitControls } from "@react-three/drei"
import { Perf } from "r3f-perf"

export default function App() {
  return (
    <div className="canvas bg-white">
      <Canvas camera={{ position: [0, 0, 2] }}>
        <Perf position="top-left" />
        <OrbitControls
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={2.7}
          minAzimuthAngle={0}
          maxAzimuthAngle={0}
        />
        {/* Video */}
        <mesh position={[0, 0, -0.4]}>
          <circleGeometry args={[0.55, 100]} />
          <VideoTexture src="/wave.mp4">
            {(texture) => <meshBasicMaterial map={texture} />}
          </VideoTexture>
        </mesh>
        <LiquidGlass
          position={[0, 0, 0.2]}
          width={0.8}
          height={0.8}
          borderRadius={0.5}
          onClick={() => console.log("Clicked!")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ z: 0.15 }}
          ior={3}
          thickness={1}
          borderSmoothness={60}
          // wireframe
          extrudeSettings={{
            depth: 0,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.05,
            bevelSegments: 20,
          }}
        />
      </Canvas>
    </div>
  )
}
