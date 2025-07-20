import React, { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface DollyZoomContainerProps {
  leftSection: ReactNode;
  rightSection: ReactNode;
  theme?: "light" | "dark";
  onAnimationComplete?: () => void;
}

const DollyZoomContainer: React.FC<DollyZoomContainerProps> = ({
  leftSection,
  rightSection,
  theme = "light",
  onAnimationComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftSectionRef = useRef<HTMLDivElement>(null);
  const rightSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Cleanup previous ScrollTrigger instances
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    // Setup Dolly Zoom animation with much slower, more natural progression
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=500vh",
        scrub: 2.5,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Call animation complete when scroll reaches end
          if (self.progress >= 0.95 && onAnimationComplete) {
            onAnimationComplete();
          }
        },
      },
    });

    // Phase 1: Initial state - both sections visible
    // Left section starts to move and fade very gradually
    tl.to(
      leftSectionRef.current,
      {
        x: "-25%",
        opacity: 0.8,
        duration: 0.4,
        ease: "power1.out",
      },
      0,
    );

    // Phase 2: Left section continues moving and fading out slowly
    tl.to(
      leftSectionRef.current,
      {
        x: "-60%",
        opacity: 0.4,
        duration: 0.3,
        ease: "power1.out",
      },
      0.4,
    );

    // Phase 3: Left section completely disappears gradually
    tl.to(
      leftSectionRef.current,
      {
        x: "-100%",
        opacity: 0,
        duration: 0.2,
        ease: "power1.out",
      },
      0.7,
    );

    // Phase 4: 3D Object starts moving and scaling very gradually
    tl.to(rightSectionRef.current, {
      x: "-50%",
      y: "-40%",
      scale: 2.5,
      duration: 0.6,
      ease: "power1.inOut",
      transformOrigin: "center 25%",
    });

    // Cleanup function
    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [onAnimationComplete]);

  return (
    <div
      ref={containerRef}
      className="dolly-zoom-container"
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        overflow: "visible",
        background: "var(--color-surface)",
      }}
    >
      {/* Left Section */}
      <div
        ref={leftSectionRef}
        className="dolly-zoom-left-section"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "50%",
          height: "100%",
          zIndex: 15,
          transformOrigin: "center center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          willChange: "transform, opacity",
          overflow: "visible",
        }}
      >
        {leftSection}
      </div>

      {/* Right Section - 3D Object Container */}
      <div
        ref={rightSectionRef}
        className="dolly-zoom-right-section landing-right"
        style={{
          position: "absolute",
          top: "50%",
          right: 0,
          width: "50%",
          height: "100%",
          zIndex: 10,
          transform: "translateY(-50%)",
          transformOrigin: "center 25%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          willChange: "transform",
          overflow: "visible",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            aspectRatio: "1/1",
            maxWidth: "800px",
            maxHeight: "800px",
            overflow: "visible",
            position: "relative",
          }}
        >
          {rightSection}
        </div>
      </div>

      {/* Enhanced Scroll indicator with progress */}
      <div
        className="scroll-indicator"
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 30,
          color: "var(--color-text-primary)",
          fontSize: "14px",
          opacity: 0.7,
          pointerEvents: "none",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "12px", marginTop: "4px" }}>Scroll</div>
      </div>
    </div>
  );
};

export default DollyZoomContainer;
