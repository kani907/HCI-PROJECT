"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function SearchPage() {
  const params = useSearchParams();
  const query = params.get("q") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");

    fetch(`http://localhost:8000/movie/find_names/${query}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : ""
      }
    })
      .then(res => res.json())
      .then(data => {
        setResults(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

  }, [query]);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Search results for: "{query}"</h1>

      {loading && <p style={{ marginTop: "20px" }}>Loading...</p>}

      {!loading && results.length === 0 && (
        <p style={{ marginTop: "20px" }}>No movies found.</p>
      )}

      <ul style={{ marginTop: "20px", listStyle: "none", padding: 0 }}>
        {results.map((movie: any) => (
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
              {movie.name} ({movie.release_date})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
