import { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

/**
 * Reusable card component that serves as a container
 */
export function Card({ title, children, className = "" }: CardProps) {
  return (
    <div className={`card ${className}`}>
      <h3>{title}</h3>
      {children}
    </div>
  );
}
