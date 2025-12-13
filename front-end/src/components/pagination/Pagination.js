"use client";
import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];

    if (totalPages <= 6) {
      // show all pages
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // large pagination
      pages.push(1);

      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center lg:justify-end mt-10 space-x-2">
      {/* Prev Button */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {/* Page Numbers */}
      {getPages().map((page, index) =>
        page === "..." ? (
          <span key={index} className="px-3 py-2 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded ${
              page === currentPage
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next Button */}
      <button
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
