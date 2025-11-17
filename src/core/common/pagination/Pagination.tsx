import React from "react";
import { Link } from "react-router-dom";

interface PaginationProps {
  page: number; // página atual (zero-based)
  totalPages: number; // total de páginas
  onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  const pageNumbers = [];

  const maxPagesToShow = 5;
  const startPage = Math.max(
    0,
    Math.min(page - 2, totalPages - maxPagesToShow)
  );
  const endPage = Math.min(totalPages, startPage + maxPagesToShow);

  for (let i = startPage; i < endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="row align-items-center">
      <div className="col-md-2">
        <p className="pagination-text">
          Page {page + 1} of {totalPages}
        </p>
      </div>
      <div className="col-md-10">
        <ul className="pagination lms-page justify-content-center justify-content-md-end mt-2 mt-md-0">
          <li className={`page-item prev ${page === 0 ? "disabled" : ""}`}>
            <Link
              className="page-link"
              to="#"
              tabIndex={-1}
              onClick={(e) => {
                e.preventDefault();
                if (page > 0) onPageChange(page - 1);
              }}
            >
              <i className="fas fa-angle-left" />
            </Link>
          </li>

          {pageNumbers.map((pageNumber) => (
            <li
              key={pageNumber}
              className={`page-item ${pageNumber === page ? "active" : ""}`}
            >
              <Link
                className="page-link"
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(pageNumber);
                }}
              >
                {pageNumber + 1}
              </Link>
            </li>
          ))}

          <li
            className={`page-item next ${
              page === totalPages - 1 ? "disabled" : ""
            }`}
          >
            <Link
              className="page-link"
              to="#"
              onClick={(e) => {
                e.preventDefault();
                if (page < totalPages - 1) onPageChange(page + 1);
              }}
            >
              <i className="fas fa-angle-right" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Pagination;
