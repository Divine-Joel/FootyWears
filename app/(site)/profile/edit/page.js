"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../context/AuthContext";

export default function EditProfilePage() {
  const { user, loading, setUser } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (user) {
      setFormData((prev) => ({ ...prev, name: user.name, email: user.email }));
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <main className="profile-page">
        <p>Loading...</p>
      </main>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmNewPassword
    ) {
      setError("New passwords don't match.");
      return;
    }

    setIsSubmitting(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword || undefined,
      }),
    });
    const data = await res.json();
    setIsSubmitting(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    setUser(data);
    setSuccess("Your profile has been updated.");
    setFormData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    }));
  };

  return (
    <main className="profile-page">
      <h1>Edit Profile</h1>

      <section className="profile-section">
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}

          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="currentPassword">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            required
          />

          <label htmlFor="newPassword">
            New Password (leave blank to keep current)
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
          />

          <label htmlFor="confirmNewPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmNewPassword"
            name="confirmNewPassword"
            value={formData.confirmNewPassword}
            onChange={handleChange}
          />

          <button type="submit" className="btn-17" disabled={isSubmitting}>
            <span className="text-container">
              <span className="text">
                {isSubmitting ? "Saving..." : "Save Changes"}
              </span>
            </span>
          </button>
        </form>
      </section>
    </main>
  );
}
