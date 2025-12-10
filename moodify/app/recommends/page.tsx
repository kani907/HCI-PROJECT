"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Recommends() {
  const [movies, setMovies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pageSize = 6;

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:8000/top_list", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setMovies(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(movies.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const pageMovies = movies.slice(startIndex, startIndex + pageSize);

  const next = () => page < totalPages && setPage(p => p + 1);
  const prev = () => page > 1 && setPage(p => p - 1);

  if (loading) {
    return (
      <div className="orange-frame">
        <div className="content-box">
          <h1 className="rec-title">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="orange-frame">
      <div className="content-box">

        <h1 className="rec-title">Moodify recommends...</h1>

        <div className="card-grid">
          {pageMovies.map(movie => (
            <div
              className="card"
              key={movie.id}
              onClick={() => router.push(`/movie/${movie.id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="card-img" />
              <div className="card-text">
                <h3>{movie.name}</h3>
                <p>Rating: {movie.rating}</p>
                <p>Year: {movie.release_date}</p>
                <p>Genres: {movie.tags?.genres?.join(", ")}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: "25px", gap: "15px" }}>
          <button
            className="btn-small-outline"
            onClick={prev}
            disabled={page === 1}
            style={{ opacity: page === 1 ? 0.5 : 1 }}
          >
            Previous
          </button>

          <span style={{ alignSelf: "center" }}>
            Page {page} / {totalPages}
          </span>

          <button
            className="btn-small-outline"
            onClick={next}
            disabled={page === totalPages}
            style={{ opacity: page === totalPages ? 0.5 : 1 }}
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}
