"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setHydrated(true);
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    router.push("/login");
  };

  if (!hydrated) return null;

  return (
    <header className="header">
      <span onClick={() => router.push("/")} className="logo" style={{ cursor: "pointer" }}>
        Moodify
      </span>

      <nav className="nav-right">
        {!loggedIn && (
          <>
            <button className="btn-small" onClick={() => router.push("/login")}>
              Sign in
            </button>
            <button className="btn-small-outline" onClick={() => router.push("/register")}>
              Register
            </button>
          </>
        )}

        {loggedIn && (
          <>
            <button
              className="nav-link"
              onClick={() => router.push("/recommends")}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              Recommendations
            </button>

            <button
              className="nav-link"
              onClick={() => router.push("/for_you")}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              For You
            </button>

            <button
              className="nav-link"
              onClick={() => router.push("/profile")}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              Profile
            </button>

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
