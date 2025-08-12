import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";

/**
 * Camera Animation Hook untuk Landing Page
 *
 * Optimasi: Mengurangi dari 10 posisi kamera menjadi 6 posisi untuk:
 * - Performa yang lebih baik (render lebih cepat)
 * - Transisi yang lebih halus dan fokus
 * - Storytelling yang lebih jelas dengan flow yang terstruktur
 * - Mengurangi kompleksitas animasi tanpa kehilangan efek dramatis
 *
 * Flow Storytelling 6 Posisi:
 * 1. Normal Start: Pengenalan tenang dan seimbang
 * 2. High Angle: Kesan monumental dan agung
 * 3. Side Close-up: Fokus detail wajah yang dramatis
 * 4. Dutch Angle: Dinamis dan ketegangan
 * 5. Low Angle: Monumental dari bawah
 * 6. Cinematic Wide: Penutup epik yang kembali ke awal
 */

interface CameraPosition {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  name: string;
}

export const CAMERA_POSITIONS: CameraPosition[] = [
  // 1. Normal shot - posisi awal yang seimbang dan normal
  // Memberikan pengenalan yang tenang dan seimbang pada patung
  { position: [0, 0, 6], target: [0, -0.5, 0], fov: 80, name: "normal-start" },

  // 2. High angle shot - looking down from above untuk memberikan kesan dominasi
  // Menunjukkan patung dari sudut tinggi, memberikan kesan monumental dan agung
  {
    position: [0, 4, 3],
    target: [0, -0.5, 0],
    fov: 45,
    name: "dramatic-high-angle",
  },

  // 3. Extreme close-up from side dengan sudut dramatis untuk detail wajah
  // Fokus pada detail wajah patung dengan sudut yang dramatis
  {
    position: [2.5, 1.2, 1.8],
    target: [0, 0.7, 0],
    fov: 25,
    name: "extreme-side-closeup",
  },

  // 4. Dutch angle shot - perspektif miring untuk kesan ketegangan
  // Memberikan kesan dinamis dan ketegangan dengan sudut miring
  {
    position: [-1.8, 0.5, 2.2],
    target: [0.5, 0.3, 0],
    fov: 35,
    name: "dutch-angle",
  },

  // 5. Moderate low angle - tidak terlalu ekstrem untuk kesan monumental
  // Menunjukkan patung dari bawah dengan sudut yang tidak terlalu ekstrem
  {
    position: [0, -1.5, 3.5],
    target: [0, 0.5, 0],
    fov: 60,
    name: "moderate-low-angle",
  },

  // 6. Cinematic wide shot dengan tinggi dramatis untuk penutup
  // Kembali ke posisi wide untuk memberikan kesan penutup yang epik
  {
    position: [0, 0, 6],
    target: [0, -0.5, 0],
    fov: 80,
    name: "cinematic-wide",
  },
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

  // Setup posisi awal kamera dari posisi pertama
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

  // Interpolasi antar 6 posisi kamera berdasarkan scroll progress
  // Dengan 6 posisi, transisi menjadi lebih halus dan fokus
  useEffect(() => {
    if (!enabled) return;
    const progress = scrollProgress * (CAMERA_POSITIONS.length - 1);
    const currentIndex = Math.floor(progress);
    const nextIndex = Math.min(currentIndex + 1, CAMERA_POSITIONS.length - 1);
    const lerpFactor = progress - currentIndex;
    const currentPos = CAMERA_POSITIONS[currentIndex];
    const nextPos = CAMERA_POSITIONS[nextIndex];

    // Interpolasi posisi kamera untuk transisi yang halus
    const interpolatedPosition = [
      currentPos.position[0] +
        (nextPos.position[0] - currentPos.position[0]) * lerpFactor,
      currentPos.position[1] +
        (nextPos.position[1] - currentPos.position[1]) * lerpFactor,
      currentPos.position[2] +
        (nextPos.position[2] - currentPos.position[2]) * lerpFactor,
    ] as [number, number, number];

    // Interpolasi target look-at
    const interpolatedTarget = [
      currentPos.target[0] +
        (nextPos.target[0] - currentPos.target[0]) * lerpFactor,
      currentPos.target[1] +
        (nextPos.target[1] - currentPos.target[1]) * lerpFactor,
      currentPos.target[2] +
        (nextPos.target[2] - currentPos.target[2]) * lerpFactor,
    ] as [number, number, number];

    // Interpolasi FOV untuk efek dolly zoom
    const interpolatedFOV =
      currentPos.fov + (nextPos.fov - currentPos.fov) * lerpFactor;

    targetPosition.current.set(...interpolatedPosition);
    targetLookAt.current.set(...interpolatedTarget);
    targetFOV.current = interpolatedFOV;
  }, [scrollProgress, enabled]);

  // Update frame-by-frame untuk animasi yang halus
  // Dengan 6 posisi, transisi menjadi lebih responsif
  useFrame((_, delta) => {
    if (!enabled) return;
    const lerpFactor = Math.min(delta * 1.5, 0.08); // Lebih halus untuk transisi dramatis

    // Smooth lerp untuk posisi kamera
    currentPosition.current.lerp(targetPosition.current, lerpFactor);
    camera.position.copy(currentPosition.current);

    // Smooth lerp untuk target look-at
    currentLookAt.current.lerp(targetLookAt.current, lerpFactor);
    camera.lookAt(currentLookAt.current);

    // Smooth lerp untuk FOV (dolly zoom effect)
    if ("fov" in camera) {
      currentFOV.current +=
        (targetFOV.current - currentFOV.current) * lerpFactor;
      camera.fov = currentFOV.current;
      camera.updateProjectionMatrix();
    }
  });

  return {
    currentCameraPosition: (() => {
      const progress = scrollProgress * (CAMERA_POSITIONS.length - 1);
      const currentIndex = Math.floor(progress);
      return CAMERA_POSITIONS[
        Math.min(currentIndex, CAMERA_POSITIONS.length - 1)
      ];
    })(),
    cameraPositions: CAMERA_POSITIONS,
    scrollSectionProgress: scrollProgress * (CAMERA_POSITIONS.length - 1),
  };
};
