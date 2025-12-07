"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { movies } from "../data/movies";

export default function SearchPage() {
  const params = useSearchParams();
  const query = params.get("q") || "";

  const [results, setResults] = useState([]);

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
        {results.map((movie) => (
          <li
            key={movie.id}
            style={{
              background: "#222",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "0.2s"
            }}
          >
            <Link
              href={`/movie/${movie.id}`}
              style={{ textDecoration: "none", color: "white" }}
            >
              {movie.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
