"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setIsSubmitting(true);
    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    setIsSubmitting(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    router.push("/login");
  };

  return (
    <main className="auth-main">
      <div className="auth-card">
        <div className="auth-logo">
          Footy<span>Wears</span>
        </div>
        <h1>Set a New Password</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <p style={{ color: "red" }}>{error}</p>}

          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn-17" disabled={isSubmitting}>
            <span className="text-container">
              <span className="text">
                {isSubmitting ? "Saving..." : "Reset Password"}
              </span>
            </span>
          </button>
        </form>
      </div>
    </main>
  );
}
