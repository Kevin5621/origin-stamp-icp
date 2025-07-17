import { ReactNode } from "react";

interface PageContainerProps {
  readonly children: ReactNode;
}

/**
 * Layout wrapper for page content
 */
export function PageContainer({ children }: Readonly<PageContainerProps>) {
  return <div className="page-container">{children}</div>;
}
