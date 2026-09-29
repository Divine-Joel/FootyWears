"use client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setResetLink("");

    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setIsSubmitting(false);
    setMessage(data.message);
    if (data.resetLink) {
      setResetLink(data.resetLink);
    }
  };

  return (
    <main className="auth-main">
      <div className="auth-card">
        <div className="auth-logo">
          Footy<span>Wears</span>
        </div>
        <h1>Reset Your Password</h1>
        <p className="auth-subtitle">
          Enter your email and we'll help you reset your password.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" className="btn-17" disabled={isSubmitting}>
            <span className="text-container">
              <span className="text">
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </span>
            </span>
          </button>
        </form>

        {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
        {resetLink && (
          <p style={{ marginTop: "0.5rem" }}>
            <a href={resetLink} className="auth-link">
              Click here to reset your password
            </a>
          </p>
        )}

        <p className="auth-footer">
          Remembered it?{" "}
          <a href="/login" className="auth-link">
            Sign In.
          </a>
        </p>
      </div>
    </main>
  );
}
