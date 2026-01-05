import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Perf } from "r3f-perf"
import Arrows from "./components/experiments/arrows"
import HeroSection from "./components/HeroSection"

export default function App() {
  return (
    <div className="canvas bg-white">
      <Canvas camera={{ position: [0, 0, 2] }}>
        <color attach="background" args={["ddd"]} />
        <Perf position="top-left" />
        <OrbitControls
        // * CAMERA RESTRICTIONS
        // minPolarAngle={Math.PI / 2}
        // maxPolarAngle={2.7}
        // minAzimuthAngle={0}
        // maxAzimuthAngle={0}
        />
        {/* <Arrows /> */}
        <HeroSection />
      </Canvas>
    </div>
  )
}
