"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const EMOTIONS = [
  "happy", "sad", "angry", "relaxed", "excited",
  "anxious", "bored", "nostalgic", "confident", "romantic"
];

export default function ForYou() {
  const [selected, setSelected] = useState<string[]>([]);
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  const toggleEmotion = (emotion: string) => {
    if (selected.includes(emotion)) {
      setSelected(selected.filter(e => e !== emotion));
      return;
    }
    if (selected.length < 3) {
      setSelected([...selected, emotion]);
    }
  };

  const getMovies = async () => {
    if (selected.length !== 3) return;

    setLoading(true);

    const token = localStorage.getItem("token");
    const emotionsParam = selected.join(",");

    try {
      const res = await fetch(
        `http://localhost:8000/for_you?emotions=${emotionsParam}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await res.json();
      setMovies(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="orange-frame">
      <div className="content-box">
        <h1 className="rec-title">Pick 3 emotions</h1>

        <div className="emotion-grid">
          {EMOTIONS.map(e => (
            <button
              key={e}
              className={`emotion-btn ${selected.includes(e) ? "selected" : ""}`}
              onClick={() => toggleEmotion(e)}
            >
              {e}
            </button>
          ))}
        </div>

        <button
          className="btn"
          style={{ marginTop: "20px", opacity: selected.length === 3 ? 1 : 0.5 }}
          disabled={selected.length !== 3}
          onClick={getMovies}
        >
          Get recommendations
        </button>

        {loading && <p style={{ marginTop: 20 }}>Loading...</p>}

        {movies.length > 0 && (
          <>
            <h2 className="rec-title" style={{ marginTop: 40 }}>
              Moodify recommends...
            </h2>

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
          </>
        )}
      </div>

      <style jsx>{`
        .emotion-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
          margin-top: 20px;
        }

        .emotion-btn {
          padding: 10px;
          border-radius: 6px;
          border: 1px solid #222;
          background: #fff;
          cursor: pointer;
          transition: 0.2s;
        }

        .emotion-btn.selected {
          background: #ff7b00;
          color: white;
          border-color: #ff7b00;
        }

        .emotion-btn:hover {
          background: #ffe2c6;
        }
      `}</style>
    </div>
  );
}
