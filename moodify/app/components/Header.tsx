"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className="header">
      <a href="/" className="logo">Moodify</a>

      <nav className="nav-right">
        {!loggedIn && (
          <>
            <a href="/login" className="btn-small">Sign in</a>
            <a href="/register" className="btn-small-outline">Register</a>
          </>
        )}

        {loggedIn && (
          <>
            <a href="/recommends" className="nav-link">Recommendations</a>
            <a href="/profile" className="nav-link">Profile</a>

            <button
              onClick={logout}
              className="btn-small-outline"
              style={{
                color: "white",
                border: "1px solid white",
                background: "transparent",
                cursor: "pointer"
              }}
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
