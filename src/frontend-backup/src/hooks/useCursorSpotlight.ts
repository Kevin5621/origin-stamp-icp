import { useEffect, useCallback } from "react";

export const useCursorSpotlight = () => {
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const cards = document.querySelectorAll(
      ".landing-step, .landing-feature, .how-it-works-phase-card, .how-it-works-result-card, .how-it-works-cta-content, .how-it-works-hero-content",
    );

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Check if mouse is within card bounds
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        // Convert to percentage
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;

        // Apply CSS custom properties
        (card as HTMLElement).style.setProperty("--mouse-x", `${xPercent}%`);
        (card as HTMLElement).style.setProperty("--mouse-y", `${yPercent}%`);
      }
    });
  }, []);

  useEffect(() => {
    // Add mouse move listener with throttling
    let ticking = false;

    const throttledMouseMove = (event: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleMouseMove(event);
          ticking = false;
        });
        ticking = true;
      }
    };

    document.addEventListener("mousemove", throttledMouseMove, {
      passive: true,
    });

    // Cleanup
    return () => {
      document.removeEventListener("mousemove", throttledMouseMove);
    };
  }, [handleMouseMove]);

  return null;
};
