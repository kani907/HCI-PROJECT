"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Recommends() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("No token, user not logged in");
      setLoading(false);
      return;
    }

    fetch("http://localhost:8000/top_list", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(res => res.json())
      .then(data => {
        setMovies(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

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
          {movies.map(movie => (
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

      </div>
    </div>
  );
}
