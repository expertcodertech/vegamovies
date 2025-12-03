import Header from "@/app/components/Header";
import MovieCard from "@/app/components/MovieCard";
import Footer from "@/app/components/Footer";
import Pagination from "@/app/components/Pagination";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ query?: string; page?: string }> }) {
  const params = await searchParams;
  const q = params?.query || "";
  const page = params?.page ? Number(params.page) : 1;

  const data = await fetch(`http://localhost:3000/api/search?query=${q}&page=${page}`).then(res => res.json());

  return (
    <>
      <head>
        <title>Search Results for &quot;{q}&quot; - VegaMovies</title>
        <meta name="description" content={`Search results for ${q} on VegaMovies. Find and download movies in HD quality.`} />
      </head>
      <main className="bg-[#363434] text-white min-h-screen">
        <Header />
        <section className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-xl mb-4">Search Results for &ldquo;{q}&rdquo;</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {data?.results?.map((m: Record<string, unknown>) => <MovieCard key={m.id as number} movie={m as never} />)}
          </div>
          {data?.total_pages > 1 && (
            <div className="mt-8">
              <Pagination currentPage={page} totalPages={data.total_pages as number} basePath={`/search?query=${q}`} />
            </div>
          )}
        </section>
        <Footer />
      </main>
    </>
  );
}