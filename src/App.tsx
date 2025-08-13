import { Canvas } from "@react-three/fiber"
import LiquidGlass from "./components/liquid-glass"
import { VideoTexture, OrbitControls } from "@react-three/drei"

export default function App() {
  return (
    <div className="canvas">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <OrbitControls />
        {/* Video */}
        <mesh position={[0, 0, -0.4]}>
          <planeGeometry args={[1, 1, 1, 1]} />
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
          whileTap={{ scale: 0.95 }}
          ior={3}
        />
      </Canvas>
    </div>
  )
}
