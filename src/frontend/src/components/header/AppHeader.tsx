interface AppHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
}

/**
 * Header component for the app, displays title and subtitle
 */
export function AppHeader({ title, subtitle }: Readonly<AppHeaderProps>) {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="brand-title">{title}</h1>
        {subtitle && <p className="brand-subtitle">{subtitle}</p>}
      </div>
    </header>
  );
}
