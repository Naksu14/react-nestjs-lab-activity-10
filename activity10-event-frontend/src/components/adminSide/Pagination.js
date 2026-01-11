import React from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({ currentPage = 1, totalPages = 1, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border transition-all disabled:opacity-30 hover:bg-[var(--bg-secondary)]"
        style={{
          borderColor: "var(--border-color)",
          color: "var(--text-muted)",
        }}
      >
        <ChevronLeft size={16} />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all flex items-center justify-center`}
            style={{
              backgroundColor:
                currentPage === page ? "var(--accent-color)" : "transparent",
              color: currentPage === page ? "#fff" : "var(--text-muted)",
              border:
                currentPage === page ? "none" : "1px solid var(--border-color)",
            }}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border transition-all disabled:opacity-30 hover:bg-[var(--bg-secondary)]"
        style={{
          borderColor: "var(--border-color)",
          color: "var(--text-muted)",
        }}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export default Pagination;
