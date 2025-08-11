import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Preload } from "@react-three/drei";
import { Suspense, useEffect, useState, memo } from "react";
import { useCameraAnimation } from "../hooks/useCameraAnimation";
import { Box3, Vector3 } from "three";

interface ThreeModelViewerProps {
  src: string;
  enableInteraction?: boolean;
  enableRotation?: boolean;
  theme?: "light" | "dark";
  scrollProgress?: number;
  enableCameraAnimation?: boolean;
  onLoad?: () => void; // Callback ketika model selesai loading
}

const CameraController: React.FC<{
  scrollProgress: number;
  enabled: boolean;
}> = ({ scrollProgress, enabled }) => {
  useCameraAnimation({ scrollProgress, enabled });
  return null;
};

const Model: React.FC<{ src: string; onLoad?: () => void }> = memo(
  ({ src, onLoad }) => {
    const { scene } = useGLTF(src);

    useEffect(() => {
      // Optimasi scene untuk performance
      scene.traverse((child) => {
        if ("isMesh" in child && child.isMesh) {
          const mesh = child as any;
          mesh.castShadow = false; // Nonaktifkan shadow untuk performance
          mesh.receiveShadow = false;

          // Optimasi material
          if (mesh.material) {
            mesh.material.needsUpdate = true;
            // Kurangi kompleksitas material
            if (mesh.material.map) {
              mesh.material.map.generateMipmaps = false;
            }
          }

          // Optimasi geometry
          if (mesh.geometry) {
            mesh.geometry.computeBoundingBox();
            mesh.geometry.computeBoundingSphere();
          }
        }
      });

      // Posisi model
      const box = new Box3().setFromObject(scene);
      const center = box.getCenter(new Vector3());
      scene.position.sub(center);
      scene.position.y += (box.max.y - box.min.y) / 5;

      if (onLoad) onLoad();
    }, [scene, onLoad]);

    return (
      <primitive
        object={scene}
        rotation={[0, -Math.PI / 2, 0]}
        scale={[2, 2, 2]}
      />
    );
  },
);

Model.displayName = "Model";

// Preload model dengan prioritas tinggi
useGLTF.preload("/woman-statue.glb");

const ThreeModelViewer: React.FC<Readonly<ThreeModelViewerProps>> = memo(
  ({
    src,
    enableInteraction = true,
    enableRotation = false,
    theme = "light",
    scrollProgress = 0,
    enableCameraAnimation = false,
    onLoad,
  }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    const getLightIntensity = () => {
      switch (theme) {
        case "light":
          return { ambient: 1.5, directional: 0.8 }; // Kurangi lighting untuk performance
        case "dark":
          return { ambient: 0.4, directional: 0.6 };
        default:
          return { ambient: 0.8, directional: 0.7 };
      }
    };

    const lightIntensity = getLightIntensity();

    const handleModelLoad = () => {
      setIsLoaded(true);
      if (onLoad) {
        onLoad();
      }
    };

    return (
      <Canvas
        style={{
          width: "100%",
          height: "100%",
          opacity: isLoaded ? 1 : 0.3, // Mulai dengan opacity rendah
          transition: "opacity 0.3s ease-in-out", // Transisi lebih cepat
          background: "transparent",
          position: "relative",
          overflow: "hidden",
        }}
        shadows={false} // Nonaktifkan shadow untuk performance
        camera={{
          position: [0, 0, 4],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: false, // Nonaktifkan antialiasing untuk performance
          alpha: true,
          powerPreference: "high-performance",
          stencil: false, // Nonaktifkan stencil buffer
          depth: true,
        }}
        dpr={[1, 1.5]} // Kurangi device pixel ratio untuk performance
        performance={{ min: 0.5 }} // Set minimum performance
      >
        {/* Lighting yang disederhanakan untuk performance */}
        <ambientLight intensity={lightIntensity.ambient} />
        <directionalLight
          position={[3, 4, 3]}
          intensity={lightIntensity.directional}
          castShadow={false}
        />

        <Suspense fallback={null}>
          <Model src={src} onLoad={handleModelLoad} />
          {enableCameraAnimation && (
            <CameraController
              scrollProgress={scrollProgress}
              enabled={
                enableCameraAnimation && !enableInteraction && !enableRotation
              }
            />
          )}
          {(enableInteraction || enableRotation) && !enableCameraAnimation && (
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              enableRotate={enableRotation}
              minDistance={3}
              maxDistance={8}
              autoRotate={enableRotation}
              autoRotateSpeed={0.8}
              maxPolarAngle={Math.PI * 0.65}
              minPolarAngle={Math.PI * 0.2}
              target={[0, 0, 0]}
            />
          )}
          <Preload all />
        </Suspense>
      </Canvas>
    );
  },
);

ThreeModelViewer.displayName = "ThreeModelViewer";

export default ThreeModelViewer;
