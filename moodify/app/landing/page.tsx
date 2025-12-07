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

  return (
    <>
      <div className="hero">
        <h1>Moodify</h1>
        <p>Cinema that feels you.</p>

        <input
          style={{
            padding: "10px",
            width: "260px",
            borderRadius: "4px",
            border: "none",
            marginTop: "10px",
          }}
          placeholder="Find a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleSearch}
        />

        <a className="btn" href="/login">
          Recommendations
        </a>
      </div>
    </>
  );
}
