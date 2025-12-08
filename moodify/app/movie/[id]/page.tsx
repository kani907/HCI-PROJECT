import AddToProfileButton from "@/app/components/AddToProfileButton";

interface MoviePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MovieProfile({ params }: MoviePageProps) {
  const { id } = await params;

  // --- FETCH ---
  const res = await fetch(`http://localhost:8000/movie/find_id/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div style={{ padding: "40px" }}>
        <h1>Movie not found</h1>
      </div>
    );
  }

  const movie = await res.json();

  return (
    <div style={{ padding: "40px" }}>
      <h1>{movie.name}</h1>

      <p style={{ marginTop: "10px", fontSize: "18px", opacity: 0.9 }}>
        Rating: {movie.rating}
      </p>

      <div style={{ marginTop: "10px", opacity: 0.8 }}>
        <strong>Year:</strong> {movie.release_date}
      </div>

      <div style={{ marginTop: "10px", opacity: 0.8 }}>
        <strong>Genres:</strong> {movie.tags?.genres?.join(", ")}
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
      <AddToProfileButton movieId={id} />
    </div>
  );
}
