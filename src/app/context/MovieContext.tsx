"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

export type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  post_date?: string;
  post_title?: string;
  release_date?: string;
  overview?: string;
  post_content: string;
};

type MovieContextType = {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  genres: any[];
};

const MovieContext = createContext<MovieContextType>({
  movies: [],
  loading: false,
  error: null,
  genres: [],
});

export const MovieProvider = ({ children }: { children: React.ReactNode }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [genres, setGenres] = useState<any[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/movies?limit=500");

        if (!res.ok) {
          throw new Error("Failed to fetch movies");
        }

        const data = await res.json();
        const moviesArray = data.movies || data || [];

        const normalized: Movie[] = moviesArray.map((r: any) => {
          const posterPath = r.poster_path || r.guid || r.poster || null; // guid from WP, poster or tmdb path
          const movie: Movie = {
            id: r.id || r.ID,
            title: r.title || r.post_title || "Untitled Movie",
            poster_path: posterPath,
            post_date: r.post_date,
            post_title: r.post_title || r.title || r.post_title,
            release_date: r.release_date || r.post_date || "",
            overview: r.overview,
            post_content: r.post_content || "",
          };
          return movie;
        });

        setMovies(normalized);
      } catch (err: any) {
        setError(err.message || "Error fetching movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <MovieContext.Provider value={{ movies, loading, error, genres }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error("useMovies must be used within a MovieProvider");
  }
  return context;
};