import React, { useState, useEffect, useCallback } from "react";

interface FloatingHeaderProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  showOnTop?: boolean;
}

export const FloatingHeader: React.FC<FloatingHeaderProps> = ({
  children,
  className = "",
  threshold = 100,
  showOnTop = true,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    // Jika scroll ke atas atau di posisi atas, tampilkan header
    if (currentScrollY <= 0 || currentScrollY < lastScrollY) {
      setIsVisible(true);
    }
    // Jika scroll ke bawah lebih dari threshold, sembunyikan header
    else if (currentScrollY > lastScrollY && currentScrollY > threshold) {
      setIsVisible(false);
    }

    setLastScrollY(currentScrollY);
  }, [lastScrollY, threshold]);

  useEffect(() => {
    let ticking = false;

    const updateHeader = () => {
      handleScroll();
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [handleScroll]);

  return (
    <header
      className={`floating-header ${isVisible ? "floating-header--visible" : "floating-header--hidden"} ${className}`}
      style={{
        top: showOnTop ? "0" : "auto",
        bottom: showOnTop ? "auto" : "0",
      }}
    >
      <div className="floating-header-content">{children}</div>
    </header>
  );
};

export default FloatingHeader;
