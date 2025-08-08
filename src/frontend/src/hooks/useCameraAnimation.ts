import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";

interface CameraPosition {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  name: string;
}

export const CAMERA_POSITIONS: CameraPosition[] = [
  // Normal shot - posisi awal yang seimbang dan normal
  { position: [0, 0, 6], target: [0, -0.5, 0], fov: 80, name: "normal-start" },
  
  // High angle shot - looking down from above untuk memberikan kesan dominasi
  { position: [0, 4, 3], target: [0, -0.5, 0], fov: 45, name: "dramatic-high-angle" },
  
  // Extreme close-up from side dengan sudut dramatis untuk detail wajah
  { position: [2.5, 1.2, 1.8], target: [0, 0.7, 0], fov: 25, name: "extreme-side-closeup" },
  
  // Dutch angle shot - perspektif miring untuk kesan ketegangan
  { position: [-1.8, 0.5, 2.2], target: [0.5, 0.3, 0], fov: 35, name: "dutch-angle" },
  
  // Moderate low angle - tidak terlalu ekstrem untuk kesan monumental
  { position: [0, -1.5, 3.5], target: [0, 0.5, 0], fov: 60, name: "moderate-low-angle" },
  
  // Bird's eye view dengan tilt dramatis untuk overview
  { position: [0, 5, 1.5], target: [0, -0.5, 0], fov: 40, name: "birds-eye-dramatic" },
  
  // Moderate upward angle - tidak terlalu ekstrem
  { position: [0, -2, 2.5], target: [0, 1, 0], fov: 55, name: "moderate-upward-angle" },
  
  // Dramatic diagonal angle untuk kesan dinamis
  { position: [3, 2, 2.5], target: [0, 0, 0], fov: 30, name: "dramatic-diagonal" },
  
  // Moderate close-up from below - tidak terlalu ekstrem
  { position: [0, -1, 2], target: [0, 0.7, 0], fov: 35, name: "moderate-below-closeup" },
  
  // Cinematic wide shot dengan tinggi dramatis untuk penutup
  { position: [0, 0, 6], target: [0, -0.5, 0], fov: 80, name: "cinematic-wide" },
];

interface UseCameraAnimationProps {
  scrollProgress: number;
  enabled?: boolean;
}

export const useCameraAnimation = ({
  scrollProgress,
  enabled = true,
}: UseCameraAnimationProps) => {
  const { camera } = useThree();
  const targetPosition = useRef(new Vector3());
  const targetLookAt = useRef(new Vector3());
  const targetFOV = useRef(75);
  const currentPosition = useRef(new Vector3());
  const currentLookAt = useRef(new Vector3());
  const currentFOV = useRef(75);

  useEffect(() => {
    if (!enabled) return;
    const initialPos = CAMERA_POSITIONS[0];
    camera.position.set(...initialPos.position);
    camera.lookAt(...initialPos.target);
    if ("fov" in camera) {
      camera.fov = initialPos.fov;
      camera.updateProjectionMatrix();
    }
    currentPosition.current.copy(camera.position);
    currentLookAt.current.set(...initialPos.target);
    currentFOV.current = initialPos.fov;
  }, [camera, enabled]);

  useEffect(() => {
    if (!enabled) return;
    const progress = scrollProgress * (CAMERA_POSITIONS.length - 1);
    const currentIndex = Math.floor(progress);
    const nextIndex = Math.min(currentIndex + 1, CAMERA_POSITIONS.length - 1);
    const lerpFactor = progress - currentIndex;
    const currentPos = CAMERA_POSITIONS[currentIndex];
    const nextPos = CAMERA_POSITIONS[nextIndex];
    const interpolatedPosition = [
      currentPos.position[0] + (nextPos.position[0] - currentPos.position[0]) * lerpFactor,
      currentPos.position[1] + (nextPos.position[1] - currentPos.position[1]) * lerpFactor,
      currentPos.position[2] + (nextPos.position[2] - currentPos.position[2]) * lerpFactor,
    ] as [number, number, number];
    const interpolatedTarget = [
      currentPos.target[0] + (nextPos.target[0] - currentPos.target[0]) * lerpFactor,
      currentPos.target[1] + (nextPos.target[1] - currentPos.target[1]) * lerpFactor,
      currentPos.target[2] + (nextPos.target[2] - currentPos.target[2]) * lerpFactor,
    ] as [number, number, number];
    const interpolatedFOV = currentPos.fov + (nextPos.fov - currentPos.fov) * lerpFactor;
    targetPosition.current.set(...interpolatedPosition);
    targetLookAt.current.set(...interpolatedTarget);
    targetFOV.current = interpolatedFOV;
  }, [scrollProgress, enabled]);

  useFrame((_, delta) => {
    if (!enabled) return;
    const lerpFactor = Math.min(delta * 1.5, 0.08); // Lebih halus untuk transisi dramatis
    currentPosition.current.lerp(targetPosition.current, lerpFactor);
    camera.position.copy(currentPosition.current);
    currentLookAt.current.lerp(targetLookAt.current, lerpFactor);
    camera.lookAt(currentLookAt.current);
    if ("fov" in camera) {
      currentFOV.current += (targetFOV.current - currentFOV.current) * lerpFactor;
      camera.fov = currentFOV.current;
      camera.updateProjectionMatrix();
    }
  });

  return {
    currentCameraPosition: (() => {
      const progress = scrollProgress * (CAMERA_POSITIONS.length - 1);
      const currentIndex = Math.floor(progress);
      return CAMERA_POSITIONS[Math.min(currentIndex, CAMERA_POSITIONS.length - 1)];
    })(),
    cameraPositions: CAMERA_POSITIONS,
    scrollSectionProgress: scrollProgress * (CAMERA_POSITIONS.length - 1),
  };
};