export default function Footer() {
  return (
    <footer style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "20px",
      backgroundColor: "#222",
      color: "#fff",
      borderTop: "1px solid #444"
    }}>
      <div style={{ textAlign: "left", lineHeight: "1.6" }}>
        Created in 2025 for HCI subject at Kyungpook National University
      </div>

      <div style={{ textAlign: "right", lineHeight: "1.6" }}>
        About Us<br />
        Our Policy
      </div>
    </footer>
  );
}
