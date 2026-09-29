import LoginForm from "../../../components/LoginForm";

export default function LoginPage() {
  return (
    <main className="auth-main">
      <div className="auth-card">
        <div className="auth-logo">
          Footy<span>Wears</span>
        </div>
        <h1>Welcome Back</h1>
        <p className="auth-subtitle">
          Enter your email and password to access your account.
        </p>

        <LoginForm />

        <p className="auth-footer">
          Don't Have An Account?{" "}
          <a href="/register" className="auth-link">
            Register Now.
          </a>
        </p>
      </div>
    </main>
  );
}
