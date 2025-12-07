import { movies } from "../../data/movies";

interface MoviePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MovieProfile({ params }: MoviePageProps) {
  const { id } = await params; // ⬅️ ważne!

  const movie = movies.find((m) => m.id === id);

  if (!movie) {
    return (
      <div style={{ padding: "40px" }}>
        <h1>Movie not found</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>{movie.title}</h1>

      <p style={{ marginTop: "10px", fontSize: "18px", opacity: 0.9 }}>
        {movie.description}
      </p>

      <div style={{ marginTop: "20px", opacity: 0.8 }}>
        <strong>Year:</strong> {movie.year}
      </div>

      <div
        style={{
          width: "200px",
          height: "280px",
          background: "#444",
          borderRadius: "6px",
          marginTop: "30px",
        }}
      />
    </div>
  );
}
