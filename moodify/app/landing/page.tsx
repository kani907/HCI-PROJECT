"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Landing() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    if (e.key === "Enter" && query.trim() !== "") {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
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

      <input
        style={{
          padding: "14px 18px",
          width: "320px",
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
        onKeyDown={handleSearch}
      />

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
