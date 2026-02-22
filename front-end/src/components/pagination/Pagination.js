"use client";
import React from "react";
import { FiArrowLeft, FiArrowRight, FiPlus } from "react-icons/fi";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getPages = () => {
    const pages = [];
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
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
    <nav aria-label="Pagination Navigation" className="w-full mt-20">
      {/* --- DESKTOP DESIGN (Hidden on Mobile) --- */}
      <div className="hidden lg:flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          {/* Navigation: Previous */}
          <button
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
          >
            <FiArrowLeft className={currentPage === 1 ? "" : "animate-pulse"} />
            PREVIOUS
          </button>

          {/* Page Number Capsule */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl shadow-sm">
            {getPages().map((page, index) =>
              page === "..." ? (
                <span key={index} className="w-10 text-center text-slate-300 dark:text-slate-600 font-medium">
                  •••
                </span>
              ) : (
                <button
                  key={index}
                  onClick={() => onPageChange(page)}
                  className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-500 ${
                    page === currentPage
                      ? "bg-slate-900 dark:bg-primary text-white shadow-lg shadow-slate-300 dark:shadow-none"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>

          {/* Navigation: Next */}
          <button
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
          >
            NEXT
            <FiArrowRight className={currentPage === totalPages ? "" : "animate-pulse"} />
          </button>
        </div>

        {/* Subtle Page Counter */}
        <p className="text-[10px] tracking-[0.3em] font-black text-slate-300 dark:text-slate-700 uppercase">
          Displaying {currentPage} <span className="mx-2 text-primary">/</span> {totalPages}
        </p>
      </div>

      {/* --- MOBILE DESIGN (Hidden on Desktop) --- */}
      <div className="lg:hidden flex flex-col items-center gap-6 px-4">
        {currentPage < totalPages ? (
          <div className="w-full max-w-xs space-y-6">
            {/* Progress Bar */}
            <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
               <div 
                  className="h-full bg-primary transition-all duration-700 ease-out" 
                  style={{ width: `${(currentPage / totalPages) * 100}%` }}
               />
            </div>

            <button
              onClick={handleLoadMore}
              className="w-full group flex items-center justify-between px-6 py-4 bg-slate-900 dark:bg-primary text-white rounded-2xl shadow-2xl shadow-slate-200 dark:shadow-primary/20 active:scale-[0.98] transition-all duration-300"
            >
              <span className="text-xs font-black uppercase tracking-[0.2em]">Explore More</span>
              <div className="flex items-center justify-center w-8 h-8 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
                 <FiPlus size={18} />
              </div>
            </button>
            
            <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               Viewing {currentPage} of {totalPages} Units
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 opacity-60">
            <div className="w-12 h-12 rounded-full border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center">
               <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full" />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
               End of Collection
            </p>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Pagination;