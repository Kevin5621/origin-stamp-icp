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
      scene.traverse((child) => {
        if ("isMesh" in child && child.isMesh) {
          (child as any).castShadow = true;
          (child as any).receiveShadow = true;
          if ((child as any).material) {
            (child as any).material.needsUpdate = true;
          }
        }
      });

      const box = new Box3().setFromObject(scene);
      const center = box.getCenter(new Vector3());
      scene.position.sub(center);
      // Posisi yang lebih turun untuk halaman How It Works
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

useGLTF.preload("/woman-statue.glb");

const ThreeModelViewer: React.FC<Readonly<ThreeModelViewerProps>> = memo(
  ({
    src,
    enableInteraction = true,
    enableRotation = false,
    theme = "light",
    scrollProgress = 0,
    enableCameraAnimation = false,
  }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const getLightIntensity = () => {
      switch (theme) {
        case "light":
          return { ambient: 2, directional: 1.0, point: 0.6, spot: 0.4 };
        case "dark":
          return { ambient: 0.4, directional: 0.6, point: 0.3, spot: 0.2 };
        default:
          return { ambient: 0.6, directional: 0.8, point: 0.4, spot: 0.3 };
      }
    };
    const lightIntensity = getLightIntensity();

    return (
      <Canvas
        style={{
          width: "100%",
          height: "100%",
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
          background: "transparent",
          position: "relative",
          overflow: "hidden",
        }}
        shadows
        camera={{
          position: [0, 0, 4],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={lightIntensity.ambient} />
        <directionalLight
          position={[3, 4, 3]}
          intensity={lightIntensity.directional}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-3, 3, -3]} intensity={lightIntensity.point} />
        <spotLight
          position={[0, 6, 2]}
          intensity={lightIntensity.spot * 1.2}
          angle={0.4}
          penumbra={0.3}
          color="#ffffff"
          target-position={[0, 1, 0]}
        />
        <directionalLight
          position={[-2, 2, -2]}
          intensity={lightIntensity.directional * 0.3}
          color="#e0e7ff"
        />
        <Suspense fallback={null}>
          <Model src={src} onLoad={() => setIsLoaded(true)} />
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
