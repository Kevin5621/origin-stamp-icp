import React from "react";
import { Link } from "react-router-dom";
import styles from "../../css/components/common/Breadcrumb.module.scss";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <ol className={styles.breadcrumbList}>
        {items.map((item, index) => (
          <li key={item.href} className={styles.breadcrumbItem}>
            {index < items.length - 1 ? (
              <>
                <Link to={item.href} className={styles.breadcrumbLink}>
                  {item.label}
                </Link>
                <span className={styles.breadcrumbSeparator}>/</span>
              </>
            ) : (
              <span className={styles.breadcrumbCurrent}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
