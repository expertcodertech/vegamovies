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
    <div className="bg-[#363434] text-white min-h-screen">
      {/* Main Movie Section */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">{String(movie.title)}</h1>
        
        {/* Movie Poster */}
        <div className="mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={String(movie.poster_path || "/placeholder.png")} 
            alt={String(movie.title)}
            className="w-full max-w-md mx-auto rounded-lg"
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.src = "/placeholder.png";
            }}
          />
        </div>
        
        {/* Render post_content as HTML */}
        <div
          className="mt-6 text-gray-300 text-sm"
          dangerouslySetInnerHTML={{ __html: String(movie.post_content || "") }}
        />
      </section>
    </div>
  );
}