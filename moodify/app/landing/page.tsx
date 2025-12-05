export default function Landing() {
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
            marginTop: "10px"
          }}
          placeholder="Find a movie..."
        />

        <a className="btn" href="/login">
          Recommendations
        </a>
      </div>

    </>
  );
}
