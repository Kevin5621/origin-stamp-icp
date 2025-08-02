import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { NotificationButton } from "./NotificationButton";
import { LanguageToggle } from "../ui/LanguageToggle";
import { ThemeToggle } from "../ui/ThemeToggle";
import { Login } from "../login/Login";
import { SignInButton } from "../login/SignInButton";

interface FloatingHeaderProps {
  className?: string;
  threshold?: number;
  showOnTop?: boolean;
}

export const FloatingHeader: React.FC<FloatingHeaderProps> = ({
  className = "",
  threshold = 100,
  showOnTop = true,
}) => {
  const { isAuthenticated } = useAuth();
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
      <div className="floating-header-content">
        {isAuthenticated ? (
          // Header untuk user yang sudah login
          <div className="floating-header__authenticated">
            <div className="floating-header__left">
              <NotificationButton />
            </div>
            <div className="floating-header__right">
              <LanguageToggle />
              <ThemeToggle />
              <Login />
            </div>
          </div>
        ) : (
          // Header untuk user yang belum login
          <div className="floating-header__unauthenticated">
            <div className="floating-header__left">
              {/* Logo atau brand bisa ditambahkan di sini */}
            </div>
            <div className="floating-header__right">
              <LanguageToggle />
              <ThemeToggle />
              <SignInButton variant="primary" size="medium" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default FloatingHeader;
