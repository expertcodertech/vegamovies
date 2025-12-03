"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MovieDetail() {
  const params = useParams();
  const [movie, setMovie] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        if (params?.id) {
          const urlSlug = Array.isArray(params.id) ? params.id[0] : params.id;
          
          // Extract ID from slug (format: title-id)
          const extractIdFromSlug = (slug: string) => {
            const parts = slug.split('-');
            return parts[parts.length - 1]; // Get the last part which should be the ID
          };
          
          const movieId = extractIdFromSlug(urlSlug);
          
          // Fetch movie from API
          const res = await fetch(`/api/movie/${movieId}`);
          if (res.ok) {
            const movieData = await res.json();
            setMovie(movieData);
          } else {
            console.error("Failed to fetch movie");
          }
        }
      } catch (error) {
        console.error("Error fetching movie:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [params]);

  if (loading) {
    return (
      <div className="bg-[#363434] text-white min-h-screen">
        <div className="text-center py-10">Loading movie...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="bg-[#363434] text-white min-h-screen">
        <div className="text-center py-10">Movie not found</div>
      </div>
    );
  }

  return (
    <>
      <head>
        <title>{String(movie.title)} - Download HD | VegaMovies</title>
        <meta name="description" content={`Download ${String(movie.title)} in HD quality. Watch online or download for free on VegaMovies.`} />
        <meta property="og:title" content={`${String(movie.title)} - VegaMovies`} />
        <meta property="og:description" content={`Download ${String(movie.title)} in HD quality`} />
        {movie.poster_path ? <meta property="og:image" content={String(movie.poster_path)} /> : null}
      </head>
      <div className="bg-[#363434] text-white min-h-screen">
        {/* Main Movie Section */}
        <article className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">{String(movie.title)}</h1>
        
          {/* Movie Poster */}
          <div className="mb-6">
            {movie.poster_path ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={String(movie.poster_path)} 
                alt={String(movie.title)}
                className="w-full max-w-md mx-auto rounded-lg"
                onError={(e) => {
                  // Hide image on error to prevent infinite loop
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full max-w-md mx-auto rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 aspect-[2/3] flex items-center justify-center">
                <span className="text-gray-500 text-center px-4">No Image Available</span>
              </div>
            )}
          </div>
        
          {/* Render post_content as HTML */}
          <div
            className="mt-6 text-gray-300 text-sm prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: String(movie.post_content || "") }}
          />
        </article>
      </div>
    </>
  );
}