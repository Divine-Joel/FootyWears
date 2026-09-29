"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setIsSubmitting(true);
    const res = await fetch("/api/register", {
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

      <label htmlFor="name">Name</label>
      <input
        type="text"
        id="name"
        name="name"
        placeholder="Your full name"
        value={formData.name}
        onChange={handleChange}
        required
      />

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
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <i
          className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"} toggle-password`}
          onClick={() => setShowPassword(!showPassword)}
        ></i>
      </div>

      <label htmlFor="confirmPassword">Confirm Password</label>
      <div className="password-field">
        <input
          type={showConfirmPassword ? "text" : "password"}
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Re-enter your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <i
          className={`fa-regular ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} toggle-password`}
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        ></i>
      </div>

      <button type="submit" className="btn-17" disabled={isSubmitting}>
        <span className="text-container">
          <span className="text">
            {isSubmitting ? "Creating account..." : "Register"}
          </span>
        </span>
      </button>
    </form>
  );
}
