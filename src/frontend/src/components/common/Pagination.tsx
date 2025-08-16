import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "../../css/components/common/Pagination.module.scss";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Generate an array of page numbers to show
  const getPageNumbers = () => {
    const pageNumbers = [];

    // Always show first page
    pageNumbers.push(1);

    // Calculate range around current page
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pageNumbers.push("ellipsis1");
    }

    // Add pages in range
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pageNumbers.push("ellipsis2");
    }

    // Always show last page if more than 1 page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className={styles.pagination}>
      <ul className={styles.paginationList}>
        {/* Previous button */}
        <li className={styles.paginationItem}>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`${styles.paginationButton} ${styles.paginationArrow}`}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
        </li>

        {/* Page numbers */}
        {pageNumbers.map((pageNumber, index) => (
          <li key={`${pageNumber}-${index}`} className={styles.paginationItem}>
            {pageNumber === "ellipsis1" || pageNumber === "ellipsis2" ? (
              <span className={styles.paginationEllipsis}>…</span>
            ) : (
              <button
                onClick={() => onPageChange(Number(pageNumber))}
                className={`${styles.paginationButton} ${
                  currentPage === pageNumber
                    ? styles.paginationButtonActive
                    : ""
                }`}
              >
                {pageNumber}
              </button>
            )}
          </li>
        ))}

        {/* Next button */}
        <li className={styles.paginationItem}>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`${styles.paginationButton} ${styles.paginationArrow}`}
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </li>
      </ul>
    </nav>
  );
};
