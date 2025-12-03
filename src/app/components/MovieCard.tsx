'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { Movie } from '@/app/context/MovieContext';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    console.log('MovieCard mounted:', {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      has_poster: !!movie.poster_path,
    });
  }, [movie.id, movie.poster_path, movie.title]);

  return (
    <Link href={`/movie/${movie.id}`}>
      <div className="group cursor-pointer">
        {/* Image Container */}
         <div className="relative w-full overflow-hidden rounded-t-lg bg-gray-900 aspect-[2/3]">
           {movie.poster_path && !imageError ? (
             <>
               <Image
                 src={movie.poster_path}
                 alt={movie.title}
                 fill
                 sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                 className="object-cover group-hover:scale-110 transition-transform duration-300"
                 onLoadingComplete={() => {
                   console.log("Image loaded:", movie.poster_path);
                   setImageLoaded(true);
                 }}
                 onError={() => {
                   console.error("Image failed to load:", movie.poster_path);
                   setImageError(true);
                 }}
                 unoptimized
               />
               {!imageLoaded && (
                 <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                   <span className="text-gray-500 text-sm">Loading...</span>
                 </div>
               )}
             </>
           ) : (
             <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
               <span className="text-gray-500 text-center px-4">
                 {imageError ? "Image not available" : "No Image"}
               </span>
             </div>
           )}
         </div>

        {/* Info */}
        <div className="bg-[#333333] p-4 rounded-b-lg">
          {/* Title */}
          <h3 className="text-white font-bold line-clamp-3 text-sm text-center">
            {movie.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
