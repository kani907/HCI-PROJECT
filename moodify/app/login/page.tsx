"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please fill all fields.");
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!res.ok) {
        setError("Invalid email or password.");
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.access_token);

      router.push("/");
    } catch (err) {
      setError("Server error. Try again later.");
    }
  };

  return (
    <div className="split">
      <div className="left">
        <h2>Sign In</h2>

        <div className="form-box">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>
          )}

          <button className="btn" style={{ width: "100%" }} onClick={handleLogin}>
            Sign In
          </button>

          <a href="#">Forgot password?</a>
        </div>
      </div>

      <div className="right orange">
        <h2>Don't have an account?</h2>

        <a className="btn" href="/register">
          Register
        </a>
      </div>
    </div>
  );
}
