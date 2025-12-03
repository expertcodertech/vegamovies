"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
  onPageChange?: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, basePath = "/", onPageChange }: PaginationProps) {
  const [maxButtons, setMaxButtons] = useState(10);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 400) setMaxButtons(3);
      else if (window.innerWidth < 640) setMaxButtons(5);
      else if (window.innerWidth < 1024) setMaxButtons(7);
      else setMaxButtons(10);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  const end = Math.min(totalPages, start + maxButtons - 1);
  if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1);

  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  const handlePageClick = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  return (
    <div className="bg-[#333333] py-6 px-4">
      <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 max-w-7xl mx-auto">
        {currentPage > 1 && (onPageChange ? (
          <button onClick={() => handlePageClick(currentPage - 1)} className="p-2 text-gray-400 hover:text-white transition-colors" aria-label="Previous page">
            <ChevronLeft size={24} />
          </button>
        ) : (
          <Link href={`${basePath}?page=${currentPage - 1}`} className="p-2 text-gray-400 hover:text-white transition-colors" aria-label="Previous page">
            <ChevronLeft size={24} />
          </Link>
        ))}

      {pages.map((p) => onPageChange ? (
         <button
           key={p}
           onClick={() => handlePageClick(p)}
           className={`px-3 sm:px-4 py-2 border rounded text-sm sm:text-base font-semibold transition ${p === currentPage ? "bg-white border-white text-black" : "bg-[#333333] border-gray-600 text-gray-400 hover:text-white"}`}
           aria-current={p === currentPage ? "page" : undefined}
         >
           {p}
         </button>
       ) : (
         <Link
           key={p}
           href={`${basePath}?page=${p}`}
           className={`px-3 sm:px-4 py-2 border rounded text-sm sm:text-base font-semibold transition ${p === currentPage ? "bg-white border-white text-black" : "bg-[#333333] border-gray-600 text-gray-400 hover:text-white"}`}
           aria-current={p === currentPage ? "page" : undefined}
         >
           {p}
         </Link>
       ))}

      {end < totalPages && (
        <>
          <span className="px-2 sm:px-3 py-2 text-yellow-400 text-sm sm:text-base select-none font-bold">...</span>
          {onPageChange ? (
            <button
              onClick={() => handlePageClick(totalPages)}
              className="px-3 sm:px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white hover:bg-gray-600 transition text-sm sm:text-base font-semibold"
            >
              {totalPages}
            </button>
          ) : (
            <Link
              href={`${basePath}?page=${totalPages}`}
              className="px-3 sm:px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white hover:bg-gray-600 transition text-sm sm:text-base font-semibold"
            >
              {totalPages}
            </Link>
          )}
        </>
      )}

        {currentPage < totalPages && (onPageChange ? (
          <button onClick={() => handlePageClick(currentPage + 1)} className="p-2 text-gray-400 hover:text-white transition-colors" aria-label="Next page">
            <ChevronRight size={24} />
          </button>
        ) : (
          <Link href={`${basePath}?page=${currentPage + 1}`} className="p-2 text-gray-400 hover:text-white transition-colors" aria-label="Next page">
            <ChevronRight size={24} />
          </Link>
        ))}
      </div>
    </div>
  );
}