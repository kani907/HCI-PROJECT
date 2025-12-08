"use client";

export default function AddToProfileButton({ movieId }: { movieId: string }) {
  const handleClick = () => {
    console.log("Adding movie:", movieId);
    alert("Movie added to your profile! (mock)");
  };

  return (
    <button
      onClick={handleClick}
      style={{
        marginTop: "20px",
        padding: "12px 22px",
        fontSize: "16px",
        backgroundColor: "#ff6600",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
      }}
    >
      Add to My Movies
    </button>
  );
}
