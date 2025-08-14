import { LiquidGlass } from "../liquid-glass"
import { VideoTexture, Html } from "@react-three/drei"
import { extend } from "@react-three/fiber"
import { geometry } from "maath"
import { Color } from "three"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6"

extend({ RoundedPlaneGeometry: geometry.RoundedPlaneGeometry })

export default function Arrows() {
  return (
    <>
      {/* Video */}
      <mesh position={[0, 0, -0.4]}>
        <roundedPlaneGeometry args={[1, 1, 0.2]} />
        <VideoTexture src="/wave.mp4">
          {(texture) => <meshBasicMaterial map={texture} />}
        </VideoTexture>
      </mesh>

      <LiquidGlass
        position={[0, 0, 0.2]}
        width={0.8}
        height={0.8}
        borderRadius={0.1}
        color={new Color(1.5, 1.5, 1.5)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ z: 0.15 }}
        ior={3}
        thickness={1}
        borderSmoothness={30}
        // wireframe
        extrudeSettings={{
          depth: 0,
          bevelEnabled: true,
          bevelThickness: 0.02,
          bevelSize: 0.05,
          bevelSegments: 30,
        }}
      />

      <Html>
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            fontSize: "2rem",
            transform: "translateX(-50%) translateY(-45%)",
            borderRadius: "3rem",
            padding: "1rem 0",
            // gap: "4rem",
            border: "1px solid #eee",
            boxShadow: "0 10px 1rem 0 rgba(0, 0, 0, 0.3)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20rem",
              height: "10rem",
              padding: "4rem 3rem 2rem 3rem",
              // margin: "0 0 1rem 0",
              transform: "translateY(-10px)",
            }}
          >
            <FaChevronLeft className="arrows" />
            <FaChevronRight className="arrows" />
          </div>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              justifyContent: "center",
              alignItems: "center",
              height: "2rem",
            }}
          >
            <div
              style={{
                height: "0.5rem",
                width: "0.5rem",
                borderRadius: "100%",
                backgroundColor: "#aaa",
              }}
            ></div>
            <div
              style={{
                height: "0.5rem",
                width: "0.5rem",
                borderRadius: "100%",
                backgroundColor: "#aaa",
              }}
            ></div>
            <div
              style={{
                height: "0.5rem",
                width: "0.5rem",
                borderRadius: "100%",
                backgroundColor: "#aaa",
              }}
            ></div>
          </div>
        </div>
      </Html>
    </>
  )
}
