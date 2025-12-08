"use client";

export default function AddToProfileButton({ movieId }: { movieId: string }) {
  const handleClick = async () => {
    try {
      // get JWT token stored after login
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You are not logged in");
        return;
      }

      const res = await fetch(`http://localhost:8000/users/add_movie/${movieId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log(res);

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert("Error: " + (err.detail || "cannot add movie"));
        return;
      }

      alert("Movie added!");
    } catch (err) {
      console.error(err);
      alert("Request failed");
    }
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
