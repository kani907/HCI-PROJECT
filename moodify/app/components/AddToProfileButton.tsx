"use client";

import { useEffect, useState } from "react";

function decodeJWT(token: string) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export default function AddToProfileButton({ movieId }: { movieId: string }) {
  const [isInHistory, setIsInHistory] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const decoded = decodeJWT(token);
      if (!decoded?.sub) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:8000/users/find/${decoded.sub}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          setLoading(false);
          return;
        }

        const user = await res.json();

        if (Array.isArray(user.history)) {
          setIsInHistory(user.history.includes(movieId));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkHistory();
  }, [movieId]);

  const handleClick = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You are not logged in");
        return;
      }

      const res = await fetch(
        `http://localhost:8000/users/add_movie/${movieId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert("Error: " + (err.detail || "cannot add movie"));
        return;
      }

      setIsInHistory(true); // 🔥 od razu dezaktywujemy
      alert("Movie added!");
    } catch (err) {
      console.error(err);
      alert("Request failed");
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading || isInHistory}
      style={{
        marginTop: "20px",
        padding: "12px 22px",
        fontSize: "16px",
        backgroundColor: isInHistory ? "#555" : "#ff6600",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: isInHistory ? "not-allowed" : "pointer",
        opacity: loading ? 0.6 : 1,
      }}
    >
      {isInHistory ? "Already in My Movies" : "Add to My Movies"}
    </button>
  );
}
