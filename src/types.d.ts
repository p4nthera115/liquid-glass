import { ThreeElements } from "@react-three/fiber"
import { RoundedPlaneGeometry } from "maath"

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements extends ThreeElements {
        roundedPlaneGeometry: typeof RoundedPlaneGeometry
      }
    }
  }
}
