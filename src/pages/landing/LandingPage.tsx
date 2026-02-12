import { Suspense } from "react"
import { Canvas, extend } from "@react-three/fiber"
import { PerspectiveCamera, OrbitControls } from "@react-three/drei"
import { Perf } from "r3f-perf"
import HeroSection from "./sections/HeroSection"
import "./landing.css"
import { geometry } from "maath"

extend({ RoundedPlaneGeometry: geometry.RoundedPlaneGeometry })

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* 3D Canvas */}
      <div className="landing-canvas">
        <Canvas gl={{ antialias: true, alpha: true }}>
          <color attach="background" args={["fff"]} />

          <PerspectiveCamera makeDefault position={[0, 0, 2.7]} fov={50} />
          <Perf position="bottom-left" />

          <Suspense fallback={null}>
            <OrbitControls
              enableRotate={false}
              enableZoom={false}
              enablePan={false}
              minDistance={2}
              maxDistance={10}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.5}
            />
          </Suspense>
          <HeroSection />
        </Canvas>
      </div>

      {/* Interaction hints */}
      <div className="absolute bottom-6 gap-4 left-1/2 -translate-x-1/2 text-black z-10 justify-center items-center flex flex-col">
        <pre className="text-center">npm install @liquid-glass/react</pre>
        <div className="flex gap-2 font-semibold text-xs text-black/35 text-center justify-center items-center">
          <span>Scroll</span>
          <span>Click centre panel</span>
        </div>
      </div>
    </div>
  )
}
