"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    setIsSubmitting(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {error && <p style={{ color: "red" }}>{error}</p>}

      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        placeholder="you@company.com"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <label htmlFor="password">Password</label>
      <div className="password-field">
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <i
          className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"} toggle-password`}
          onClick={() => setShowPassword(!showPassword)}
        ></i>
      </div>

      <div className="auth-row">
        <a href="/forgot-password" className="auth-link">
          Forgot Your Password?
        </a>
      </div>
      <button type="submit" className="btn-17" disabled={isSubmitting}>
        <span className="text-container">
          <span className="text">
            {isSubmitting ? "Logging in..." : "Log In"}
          </span>
        </span>
      </button>
    </form>
  );
}
