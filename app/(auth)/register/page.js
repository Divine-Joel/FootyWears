import RegisterForm from "../../../components/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="auth-main">
      <div className="auth-card">
        <div className="auth-logo">
          Footy<span>Wears</span>
        </div>
        <h1>Create an Account</h1>
        <p className="auth-subtitle">
          Join now to streamline your experience from day one.
        </p>

        <RegisterForm />

        <p className="auth-footer">
          Already Have An Account?{" "}
          <a href="/login" className="auth-link">
            Sign In.
          </a>
        </p>
      </div>
    </main>
  );
}
