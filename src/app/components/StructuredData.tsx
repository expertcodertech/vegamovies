export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "VegaMovies",
    "description": "Download and watch HD movies for free. Latest Bollywood, Hollywood movies and web series.",
    "url": "https://vegamovies.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://vegamovies.com/search?query={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
