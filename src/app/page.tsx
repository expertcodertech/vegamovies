"use client";

import MovieCard from "./components/MovieCard";
import Pagination from "./components/Pagination";
import { useState, useEffect } from "react";
import type { Movie } from "./context/MovieContext";

const primaryFilters = [
  { id: "desi-junction", label: "Desi Junction +", color: "bg-red-600" },
  { id: "new-bollywood", label: "Bollywood New", color: "bg-teal-500" },
];

const secondaryFilters = [
  { id: "18-adult", label: "18+ Adult" },
  { id: "anime", label: "Anime" },
  { id: "bollywood", label: "Bollywood" },
  { id: "dual-audio", label: "Dual Audio" },
  { id: "hollywood", label: "Hollywood" },
  { id: "korean", label: "Korean" },
  { id: "multi-audio", label: "Multi Audio" },
  { id: "netflix", label: "Netflix" },
  { id: "prime-video", label: "Prime Video" },
  { id: "south-hindi", label: "South Hindi" },
  { id: "web-series", label: "Web Series" },
];

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const moviesPerPage = 24;

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/movies?page=${currentPage}&limit=${moviesPerPage}`);
        
        if (!res.ok) {
          throw new Error("Failed to fetch movies");
        }

        const data = await res.json();
        const moviesArray = data.movies || [];
        
        const normalized: Movie[] = moviesArray.map((r: Record<string, unknown>) => {
          const posterPath = (r.poster_path || r.guid || r.poster || null) as string | null;
          return {
            id: (r.id || r.ID) as number,
            title: (r.title || r.post_title || "Untitled Movie") as string,
            poster_path: posterPath,
            post_date: r.post_date as string,
            post_title: (r.post_title || r.title) as string,
            release_date: (r.release_date || r.post_date || "") as string,
            overview: r.overview as string,
            post_content: (r.post_content || "") as string,
          };
        });

        setMovies(normalized);
        setTotalPages(data.pagination?.totalPages || 1);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error fetching movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [currentPage, moviesPerPage]);

  const toggleFilter = (filterId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((f) => f !== filterId)
        : [...prev, filterId]
    );
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <p className="text-lg text-white">Loading movies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white bg-[#272727]">
        {/* Filter Section */}
        <section className="bg-[#272727] py-2 sm:py-3" aria-label="Movie filters">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           {/* Primary Filters */}
           <div className="flex flex-wrap gap-2 sm:gap-4 justify-center mb-2">
             {primaryFilters.map((filter) => (
               <button
                 key={filter.id}
                 onClick={() => toggleFilter(filter.id)}
                 className={`${
                   filter.color
                 } text-white font-bold px-3 sm:px-6 py-1 sm:py-2 rounded text-xs sm:text-base transition-transform hover:scale-105 ${
                   selectedFilters.includes(filter.id) ? "ring-2 ring-white" : ""
                 }`}
               >
                 {filter.label}
               </button>
             ))}
           </div>

           {/* Secondary Filters - Box Style */}
           <div className="flex flex-wrap gap-2 sm:gap-3 justify-center p-2 sm:p-4">
             {secondaryFilters.map((filter) => (
               <button
                 key={filter.id}
                 onClick={() => toggleFilter(filter.id)}
                 className={`border text-white px-2 sm:px-4 py-1 sm:py-2 rounded text-xs sm:text-sm transition-colors ${
                   selectedFilters.includes(filter.id)
                     ? "bg-gray-600 border-white"
                     : "border-gray-600 hover:border-gray-400"
                 }`}
               >
                 {filter.label}
               </button>
             ))}
           </div>
         </div>
        </section>

        {/* Info Section */}
        <section className="bg-[#333333] py-2" aria-label="About VegaMovies">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center rounded p-2 bg-transparent">
           <h2 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2">
             Vegamovies | Download Free Movies & Series
           </h2>
           <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
             Vegamovies lets you watch and download HD movies for free. Find the
             latest releases, trending films, and popular movies all in one fast
             and safe platform. Enjoy your favorite movies anytime, anywhere
             without any hassle.
           </p>
         </div>
        </section>

        {/* Trending Section Title */}
        <section className="bg-[#272727] py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-base sm:text-lg font-bold text-white">
            Trending on Vegamovies
          </h3>
        </div>
        </section>

        {/* Movies Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6" aria-label="Movie collection">
        {movies.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No movies found</p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6 mb-6 sm:mb-8">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Pagination */}
             {totalPages > 1 && (
               <Pagination
                 currentPage={currentPage}
                 totalPages={totalPages}
                 onPageChange={setCurrentPage}
               />
             )}
          </>
        )}
        </section>
    </div>
  );
}
