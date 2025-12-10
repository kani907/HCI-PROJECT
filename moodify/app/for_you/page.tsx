"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const EMOTIONS = [
  "happy", "sad", "angry", "relaxed", "excited",
  "anxious", "bored", "nostalgic", "confident", "romantic"
];

const LOADING_MESSAGES = [
  "Matching your emotions with movies...",
  "Searching for the perfect vibe...",
  "Analyzing mood patterns...",
  "Scanning movie universe...",
  "Finding films that feel right...",
  "Mood-syncing in progress...",
  "Preparing personalized picks..."
];

export default function ForYou() {
  const [selected, setSelected] = useState<string[]>([]);
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");

    const fromMoviePage = sessionStorage.getItem("fromMoviePage");

    if (fromMoviePage === "true") {
      const savedSelected = sessionStorage.getItem("selectedEmotions");
      const savedMovies = sessionStorage.getItem("forYouMovies");
      if (savedSelected) setSelected(JSON.parse(savedSelected));
      if (savedMovies) setMovies(JSON.parse(savedMovies));
      sessionStorage.removeItem("fromMoviePage");
    } else {
      setSelected([]);
      setMovies([]);
      sessionStorage.removeItem("selectedEmotions");
      sessionStorage.removeItem("forYouMovies");
    }
  }, [router]);

  const toggleEmotion = (emotion: string) => {
    let newSelected: string[];

    if (selected.includes(emotion)) {
      newSelected = selected.filter(e => e !== emotion);
    } else if (selected.length < 3) {
      newSelected = [...selected, emotion];
    } else {
      return;
    }

    setSelected(newSelected);
    sessionStorage.setItem("selectedEmotions", JSON.stringify(newSelected));
  };

  const getMovies = async () => {
    if (selected.length === 0) return;

    setLoading(true);

    const random = Math.floor(Math.random() * LOADING_MESSAGES.length);
    setLoadingMsg(LOADING_MESSAGES[random]);

    const interval = setInterval(() => {
      const random = Math.floor(Math.random() * LOADING_MESSAGES.length);
      setLoadingMsg(LOADING_MESSAGES[random]);
    }, 1500);

    try {
      const token = localStorage.getItem("token");
      const emotionsParam = selected.join(",");

      const res = await fetch(
        `http://localhost:8000/for_you?emotions=${emotionsParam}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      setMovies(data);
      sessionStorage.setItem("forYouMovies", JSON.stringify(data));
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const goToMovie = (id: string) => {
    sessionStorage.setItem("fromMoviePage", "true");
    router.push(`/movie/${id}`);
  };

  return (
    <div className={`orange-frame ${movies.length > 0 ? "expanded" : ""}`}>
      <div className="content-box">
        <h1 className="rec-title">Pick up to 3 emotions</h1>

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
          style={{
            marginTop: "20px",
            opacity: selected.length > 0 ? 1 : 0.5
          }}
          disabled={selected.length === 0}
          onClick={getMovies}
        >
          Get recommendations
        </button>

        {loading && (
          <p style={{ marginTop: 20, fontSize: 18, opacity: 0.8 }}>
            {loadingMsg}
          </p>
        )}

        {!loading && movies.length > 0 && (
          <>
            <h2 className="rec-title" style={{ marginTop: 40 }}>
              Moodify recommends...
            </h2>

            <div className="card-grid">
              {movies.map(movie => (
                <div
                  className="card"
                  key={movie.id}
                  onClick={() => goToMovie(movie.id)}
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
        .orange-frame {
          width: 100%;
          min-height: 69vh;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          background: #d87800;
          padding: 40px 0;
        }

        .orange-frame.expanded {
          min-height: auto;
        }

        .content-box {
          background: #222;
          width: 80%;
          padding: 40px;
          border-radius: 4px;
        }

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

        .card-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          margin-top: 20px;
        }

        .card {
          background: white;
          color: black;
          padding: 20px;
          display: flex;
          gap: 15px;
          border-radius: 6px;
        }

        .card-img {
          width: 60px;
          height: 60px;
          background: #ddd;
          border-radius: 4px;
        }

        .card-text h3 {
          margin: 0 0 5px;
        }
      `}</style>
    </div>
  );
}
