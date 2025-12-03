export default function Loading() {
  return (
    <div className="min-h-screen bg-[#272727] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        <p className="mt-4 text-white text-lg">Loading movies...</p>
      </div>
    </div>
  );
}
