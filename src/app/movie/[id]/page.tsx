"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import MovieCard from "@/app/components/MovieCard";
import type { Movie } from "@/app/context/MovieContext";

export default function MovieDetail() {
  const params = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        if (params?.id) {
          const movieId = Array.isArray(params.id) ? params.id[0] : params.id;
          
          // Fetch movie from API
          const res = await fetch(`/api/movie/${movieId}`);
          if (res.ok) {
            const movieData = await res.json();
            
            // Normalize movie data
            const normalizedMovie: Movie = {
              id: movieData.id || movieData.ID,
              title: movieData.title || movieData.post_title || "Untitled Movie",
              poster_path: movieData.poster_path || movieData.guid || null,
              post_date: movieData.post_date,
              post_title: movieData.post_title || movieData.title,
              release_date: movieData.release_date || movieData.post_date || "",
              overview: movieData.overview,
              post_content: movieData.post_content || "",
            };
            
            setMovie(normalizedMovie);
            
            // Fetch related movies
            const relatedRes = await fetch(`/api/movies?limit=6`);
            if (relatedRes.ok) {
              const relatedData = await relatedRes.json();
              const moviesArray = relatedData.movies || [];
              
              const normalized: Movie[] = moviesArray
                .filter((m: Record<string, unknown>) => (m.id || m.ID) !== normalizedMovie.id)
                .slice(0, 6)
                .map((r: Record<string, unknown>) => ({
                  id: (r.id || r.ID) as number,
                  title: (r.title || r.post_title || "Untitled Movie") as string,
                  poster_path: (r.poster_path || r.guid || null) as string | null,
                  post_date: r.post_date as string,
                  post_title: (r.post_title || r.title) as string,
                  release_date: (r.release_date || r.post_date || "") as string,
                  overview: r.overview as string,
                  post_content: (r.post_content || "") as string,
                }));
              
              setRelatedMovies(normalized);
            }
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
        <title>{movie.title} - Download HD | VegaMovies</title>
        <meta name="description" content={`Download ${movie.title} in HD quality. Watch online or download for free on VegaMovies.`} />
        <meta property="og:title" content={`${movie.title} - VegaMovies`} />
        <meta property="og:description" content={`Download ${movie.title} in HD quality`} />
        {movie.poster_path ? <meta property="og:image" content={movie.poster_path} /> : null}
      </head>
      <div className="bg-[#272727] text-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Movie Card Display */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Movie Card */}
            <div className="lg:col-span-1">
              <MovieCard movie={movie} />
            </div>
            
            {/* Movie Details */}
            <article className="lg:col-span-2">
              <h1 className="text-2xl sm:text-3xl font-bold mb-4">{movie.title}</h1>
              
              {movie.post_date && (
                <p className="text-gray-400 text-sm mb-4">
                  Released: {new Date(movie.post_date).toLocaleDateString()}
                </p>
              )}
              
              {/* Render post_content as HTML */}
              <div
                className="text-gray-300 text-sm prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: movie.post_content }}
              />
            </article>
          </div>

          {/* Related Movies Section */}
          {relatedMovies.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl sm:text-2xl font-bold mb-6">Related Movies</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6">
                {relatedMovies.map((relatedMovie) => (
                  <MovieCard key={relatedMovie.id} movie={relatedMovie} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}