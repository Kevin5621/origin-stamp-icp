interface AppHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly children?: React.ReactNode;
}

/**
 * Header component for the app, displays title and subtitle
 */
export function AppHeader({
  title,
  subtitle,
  children,
}: Readonly<AppHeaderProps>) {
  return (
    <header className="app-header">
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
