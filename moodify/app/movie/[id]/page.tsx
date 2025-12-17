import AddToProfileButton from "@/app/components/AddToProfileButton";

interface MoviePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MovieProfile({ params }: MoviePageProps) {
  const { id } = await params;

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
    <div
      style={{
        padding: "40px",
        display: "flex",
        gap: "40px",
        alignItems: "flex-start",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      {/* Poster */}
      <div
        style={{
          width: "260px",
          height: "380px",
          backgroundColor: "#333",
          borderRadius: "10px",
          backgroundImage:
            "url('https://placehold.co/260x380?text=Moodify')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          flexShrink: 0,
        }}
      />

      {/* Details */}
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: "42px", marginBottom: "10px" }}>
          {movie.name}
        </h1>

        <div
          style={{
            opacity: 0.85,
            marginBottom: "20px",
            fontSize: "18px",
            lineHeight: "1.6",
          }}
        >
          <p>
            <strong>Rating:</strong> {movie.rating}
          </p>
          <p>
            <strong>Year:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Genres:</strong> {movie.tags?.genres?.join(", ")}
          </p>
        </div>

        <AddToProfileButton movieId={id} />
      </div>
    </div>
  );
}
