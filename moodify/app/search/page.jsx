"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchPage() {
  const params = useSearchParams();
  const query = params.get("q") || "";

  const [results, setResults] = useState([]);

  // mockowane dane
  const movies = [
    { title: "Inception" },
    { title: "Interstellar" },
    { title: "Inside Out" },
    { title: "Iron Man" },
    { title: "I Am Legend" },
    { title: "The Dark Knight" }
  ];

  useEffect(() => {
    const filtered = movies.filter((m) =>
      m.title.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query]);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Search results for: "{query}"</h1>

      {results.length === 0 && (
        <p style={{ marginTop: "20px" }}>No movies found.</p>
      )}

      <ul style={{ marginTop: "20px", listStyle: "none", padding: 0 }}>
        {results.map((movie, i) => (
          <li
            key={i}
            style={{
              background: "#222",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "6px",
            }}
          >
            {movie.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
