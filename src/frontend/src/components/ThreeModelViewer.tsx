import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Preload } from "@react-three/drei";
import { Suspense, useEffect, useState, memo } from "react";

interface ThreeModelViewerProps {
  src: string;
  enableInteraction?: boolean;
  theme?: "light" | "dark";
}

// Komponen terpisah untuk model dengan preloading
const Model: React.FC<{ src: string; onLoad?: () => void }> = memo(
  ({ src, onLoad }) => {
    const { scene } = useGLTF(src);

    useEffect(() => {
      // Optimasi scene
      scene.traverse((child) => {
        if ("isMesh" in child && child.isMesh) {
          (child as any).castShadow = true;
          (child as any).receiveShadow = true;
          // Optimasi material
          if ((child as any).material) {
            (child as any).material.needsUpdate = true;
          }
        }
      });

      // Notify parent component that model is loaded
      if (onLoad) {
        onLoad();
      }
    }, [scene, onLoad]);

    return (
      <primitive
        object={scene}
        position={[0, 0, 0]} // Posisi tengah container
        rotation={[0, -Math.PI / 2, 0]} // Rotasi -90 derajat untuk menghadap ke depan
        scale={[2, 2, 2]}
      />
    );
  },
);

Model.displayName = "Model";

// Preload model untuk loading cepat
useGLTF.preload("/woman-statue.glb");

const ThreeModelViewer: React.FC<Readonly<ThreeModelViewerProps>> = memo(
  ({
    src,
    enableInteraction = true,
    theme = "light", // Default light theme
  }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    // Menghitung intensitas lighting berdasarkan tema
    const getLightIntensity = () => {
      switch (theme) {
        case "light":
          return {
            ambient: 2,
            directional: 1.0,
            point: 0.6,
            spot: 0.4,
          };
        case "dark":
          return {
            ambient: 0.4,
            directional: 0.6,
            point: 0.3,
            spot: 0.2,
          };
        default:
          return {
            ambient: 0.6,
            directional: 0.8,
            point: 0.4,
            spot: 0.3,
          };
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
        }}
        shadows
        camera={{
          position: [0, 0, 4], // Posisi kamera
          fov: 40,
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
        {/* Lighting yang optimal berdasarkan tema */}
        <ambientLight intensity={lightIntensity.ambient} />
        <directionalLight
          position={[3, 3, 3]}
          intensity={lightIntensity.directional}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-3, 3, -3]} intensity={lightIntensity.point} />

        {/* Tambahan lighting untuk efek glow */}
        <spotLight
          position={[0, 5, 0]}
          intensity={lightIntensity.spot}
          angle={0.3}
          penumbra={0.5}
          color="#ffffff"
        />

        <Suspense fallback={null}>
          <Model src={src} onLoad={() => setIsLoaded(true)} />
          {/* OrbitControls hanya aktif jika enableInteraction = true */}
          {enableInteraction && (
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={3}
              maxDistance={8}
              autoRotate={true}
              autoRotateSpeed={1}
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
