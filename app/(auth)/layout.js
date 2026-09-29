export default function AuthLayout({ children }) {
  return (
    <div className="auth-body">
      {children}
      <footer className="auth-footer-bar">
        <p>&copy; 2026 FootyWears. All rights reserved.</p>
      </footer>
    </div>
  );
}
