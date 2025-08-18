import React from "react";

interface AppHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly children?: React.ReactNode;
  readonly variant?:
    | "default"
    | "centered"
    | "left-aligned"
    | "with-background"
    | "with-border";
  readonly size?: "small" | "default" | "large";
}

export function AppHeader({
  title,
  subtitle,
  children,
  variant = "default",
  size = "default",
}: Readonly<AppHeaderProps>) {
  const headerClasses = [
    "app-header",
    variant !== "default" && `header--${variant}`,
    size !== "default" && `header--${size}`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClasses}>
      <div className="header-content">
        <div className="header-left">
          <h1 className="brand-title">{title}</h1>
          {subtitle && <p className="brand-subtitle">{subtitle}</p>}
        </div>
        {children && <div className="header-right">{children}</div>}
      </div>
    </header>
  );
}
