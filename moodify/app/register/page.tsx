"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:8000/users/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          role: "user"
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert("Error: " + (err.detail || "Failed to register"));
        return;
      }

      router.push("/login");
    } catch (err) {
      console.error(err);
      alert("Request failed");
    }
  };

  return (
    <div className="split">
      <div className="left orange">
        <h2>Already have an account?</h2>
        <a className="btn" href="/login">Sign In</a>
      </div>

      <div className="right">
        <h2>Register</h2>

        <div className="form-box">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn" style={{ width: "100%" }} onClick={handleRegister}>
            Register
          </button>

          <a href="#">Forgot password?</a>
        </div>
      </div>
    </div>
  );
}
