export default function Header() {
  return (
    <header className="header">

      {/* LOGO → HOME */}
      <a href="/" className="logo">
        Moodify
      </a>

      {/* NAV LINKS */}
      <nav className="nav-right">
        <a href="#" className="nav-link">Products</a>
        <a href="#" className="nav-link">Solutions</a>
        <a href="#" className="nav-link">Pricing</a>
        <a href="#" className="nav-link">Contact</a>

        <a href="/login" className="btn-small">Sign in</a>
        <a href="/register" className="btn-small-outline">Register</a>
      </nav>

    </header>
  );
}
