"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.sub; // <-- ID usera

      fetch(`http://localhost:8000/users/find/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => {
          if (!res.ok) throw new Error("Unauthorized");
          return res.json();
        })
        .then((data) => {
          setUser(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });

    } catch {
      setLoading(false);
    }

  }, []);

  if (loading) {
    return (
      <div className="orange-frame">
        <div className="content-box">
          <h1 className="rec-title">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="orange-frame">
        <div className="content-box">
          <h1 className="rec-title">Not logged in</h1>
          <p>You must sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orange-frame">
      <div className="content-box">
        <h1 className="rec-title">Your Profile</h1>

        <div className="profile-box">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      </div>
    </div>
  );
}
