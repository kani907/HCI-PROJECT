"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Movie {
  id: string;
  name: string;
  rating: number;
  release_date: number;
  tags?: { genres: string[] };
}

export default function ProfilePage() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<Movie[][]>([]);
  const [page, setPage] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.sub;

      fetch(`http://localhost:8000/users/find/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => {
          if (!res.ok) throw new Error("Unauthorized");
          return res.json();
        })
        .then(async (data) => {
          setUser(data);

          const historyIds: string[] = data.history || [];
          const chunks: Movie[][] = [];

          for (let i = 0; i < historyIds.length; i += 3) {
            const batchIds = historyIds.slice(i, i + 3);
            const moviesBatch: Movie[] = [];

            for (const id of batchIds) {
              try {
                const res = await fetch(`http://localhost:8000/movie/find_id/${id}`);
                if (!res.ok) continue;
                const movie = await res.json();
                moviesBatch.push(movie);
              } catch {}
            }

            if (moviesBatch.length) chunks.push(moviesBatch);
          }

          setHistory(chunks);
          setLoading(false);
        })
        .catch(() => setLoading(false));

    } catch {
      setLoading(false);
    }
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

  if (!user) {
    return (
      <div className="orange-frame">
        <div className="content-box">
          <h1 className="rec-title">Not logged in</h1>
          <p>You must sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  const nextPage = () => setPage((p) => Math.min(p + 1, history.length - 1));
  const prevPage = () => setPage((p) => Math.max(p - 1, 0));

  return (
    <div className="orange-frame">
      <div className="content-box">
        <h1 className="rec-title">Your Profile</h1>
        <div className="profile-box">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>

        <h2 className="rec-title" style={{ marginTop: 30 }}>History</h2>
        {history.length > 0 ? (
          <>
            <div className="card-grid">
              {history[page].map((movie) => (
                <div
                  key={movie.id}
                  className="card"
                  style={{ cursor: "pointer" }}
                  onClick={() => router.push(`/movie/${movie.id}`)}
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

            <div style={{ marginTop: 20 }}>
              <button
                onClick={prevPage}
                disabled={page === 0}
                style={{ marginRight: 10 }}
              >
                Previous
              </button>
              <button
                onClick={nextPage}
                disabled={page === history.length - 1}
              >
                Next
              </button>
            </div>
            <p style={{ marginTop: 10 }}>Page {page + 1} of {history.length}</p>
          </>
        ) : (
          <p>No history yet.</p>
        )}
      </div>
    </div>
  );
}
