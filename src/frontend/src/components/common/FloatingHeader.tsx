import React, { useState, useEffect, useCallback } from "react";

/**
 * FloatingHeader - Komponen header floating yang dapat disembunyikan/muncul berdasarkan scroll
 * 
 * Fitur:
 * - Auto-hide saat scroll ke bawah
 * - Auto-show saat scroll ke atas atau di posisi atas
 * - Transparan background dengan blur effect
 * - Responsive design
 * - Reusable dan customizable
 * - Tidak menutupi main-content
 * - Profile dropdown tidak mempengaruhi button lain
 * 
 * Props:
 * @param children - Konten yang akan ditampilkan dalam header
 * @param className - Class tambahan untuk styling
 * @param threshold - Jarak scroll minimum sebelum header disembunyikan (default: 100px)
 * @param showOnTop - Posisi header di atas atau bawah (default: true = atas)
 * 
 * Contoh penggunaan:
 * ```tsx
 * // Basic usage
 * <FloatingHeader>
 *   <Login />
 *   <ThemeToggle />
 *   <LanguageToggle />
 * </FloatingHeader>
 * 
 * // Custom threshold dan styling
 * <FloatingHeader 
 *   threshold={150} 
 *   className="custom-header"
 *   showOnTop={false}
 * >
 *   <Button>Action 1</Button>
 *   <Button>Action 2</Button>
 * </FloatingHeader>
 * ```
 * 
 * CSS Classes yang tersedia:
 * - .floating-header - Container utama
 * - .floating-header--visible - State saat header terlihat
 * - .floating-header--hidden - State saat header tersembunyi
 * - .floating-header-content - Container untuk konten
 * - .app-floating-header - Styling khusus untuk app header
 */
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

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [handleScroll]);

  return (
    <header 
      className={`floating-header ${isVisible ? 'floating-header--visible' : 'floating-header--hidden'} ${className}`}
      style={{ 
        top: showOnTop ? '0' : 'auto',
        bottom: showOnTop ? 'auto' : '0'
      }}
    >
      <div className="floating-header-content">
        {children}
      </div>
    </header>
  );
};

export default FloatingHeader;
