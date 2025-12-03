'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#272727] flex items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Something went wrong!</h2>
        <p className="text-gray-400 mb-6">We encountered an error while loading this page.</p>
        <button
          onClick={reset}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
