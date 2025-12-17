"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Landing() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (query.trim() !== "") {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleRecommendations = () => {
    const token = localStorage.getItem("token");
    router.push(token ? "/recommends" : "/login");
  };

  return (
    <div
      className="hero"
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        gap: "20px",
      }}
    >
      <h1 style={{ fontSize: "64px", marginBottom: "10px" }}>Moodify</h1>

      <p style={{ fontSize: "20px", opacity: 0.8 }}>
        Cinema that feels you.
      </p>

      {/* SEARCH BAR + BUTTON */}
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          style={{
            padding: "14px 18px",
            width: "260px",
            borderRadius: "8px",
            border: "1px solid #555",
            backgroundColor: "#222",
            color: "white",
            fontSize: "16px",
            outline: "none",
          }}
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          onClick={handleSearch}
          style={{
            padding: "14px 20px",
            fontSize: "16px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      <button
        className="btn"
        onClick={handleRecommendations}
        style={{ marginTop: "10px", padding: "12px 26px", fontSize: "18px" }}
      >
        Recommendations
      </button>
    </div>
  );
}
