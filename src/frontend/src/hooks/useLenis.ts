import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";

interface UseLenisOptions {
  duration?: number;
  easing?: (t: number) => number;
  orientation?: "vertical" | "horizontal";
  gestureOrientation?: "vertical" | "horizontal";
  smoothWheel?: boolean;
  wheelMultiplier?: number;
  smoothTouch?: boolean;
  touchMultiplier?: number;
  infinite?: boolean;
}

export const useLenis = (options: UseLenisOptions = {}) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
      ...options,
    });

    // Animation loop
    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, [options]);

  return lenisRef.current;
};

// Hook khusus untuk landing page dengan konfigurasi yang lebih smooth
export const useLandingLenis = () => {
  return useLenis({
    duration: 2.0,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -8 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.8,
    smoothTouch: true,
    touchMultiplier: 1.5,
  });
};

// Utility function untuk scroll ke element
export const scrollToElement = (elementId: string, lenis?: Lenis | null) => {
  const element = document.getElementById(elementId);
  if (element && lenis) {
    lenis.scrollTo(element, {
      offset: 0,
      duration: 2.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -8 * t)),
    });
  }
};

// Utility function untuk scroll ke section berikutnya
export const scrollToNextSection = (
  currentSectionId: string,
  lenis?: Lenis | null,
) => {
  const sections = document.querySelectorAll(".landing-section");
  const currentSection = document.getElementById(currentSectionId);

  if (currentSection && lenis) {
    const currentIndex = Array.from(sections).findIndex(
      (section) => section.id === currentSectionId,
    );
    const nextSection = sections[currentIndex + 1] as HTMLElement;

    if (nextSection) {
      lenis.scrollTo(nextSection, {
        offset: 0,
        duration: 1.0,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -8 * t)),
      });
    }
  }
};
