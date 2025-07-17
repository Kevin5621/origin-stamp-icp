import { ReactNode } from "react";

interface AppContainerProps {
  readonly children: ReactNode;
}

/**
 * Layout wrapper for the entire app, applies global container styles
 */
export function AppContainer({ children }: Readonly<AppContainerProps>) {
  return <div className="app-container">{children}</div>;
}
