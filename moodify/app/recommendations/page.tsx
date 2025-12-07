export default function Recommends() {
  const movies = [
    {
      title: "Inception",
      description: "A skilled thief enters dreams to steal secrets.",
      img: "/placeholder.png",
    },
    {
      title: "Interstellar",
      description: "A journey beyond the stars to save humanity.",
      img: "/placeholder.png",
    },
    {
      title: "The Matrix",
      description: "A hacker discovers the truth about reality.",
      img: "/placeholder.png",
    },
    {
      title: "Blade Runner 2049",
      description: "A young blade runner uncovers a long-hidden secret.",
      img: "/placeholder.png",
    },
    {
      title: "Arrival",
      description: "Linguist communicates with extraterrestrial visitors.",
      img: "/placeholder.png",
    },
    {
      title: "Whiplash",
      description: "A drummer pushed to his limits by a brutal instructor.",
      img: "/placeholder.png",
    },
  ];

  return (
    <div className="orange-frame">
      <div className="content-box">

        <h1 className="rec-title">Moodify recommends...</h1>

        <div className="card-grid">
          {movies.map((movie, i) => (
            <div className="card" key={i}>
              <div className="card-img" />
              <div className="card-text">
                <h3>{movie.title}</h3>
                <p>{movie.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
