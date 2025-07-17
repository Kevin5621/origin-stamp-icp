import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Gltf } from "@react-three/drei";
import { Suspense } from "react";

interface ThreeModelViewerProps {
  src: string;
}

const ThreeModelViewer: React.FC<Readonly<ThreeModelViewerProps>> = ({
  src,
}) => (
  <Canvas
    style={{ width: "100%", height: "100%" }}
    shadows
    camera={{ position: [0, 1, 3], fov: 50 }}
  >
    <Suspense fallback={null}>
      <Gltf src={src} />
      <Environment preset="sunset" background={false} />
      <OrbitControls enablePan enableZoom enableRotate />
    </Suspense>
  </Canvas>
);

export default ThreeModelViewer;
