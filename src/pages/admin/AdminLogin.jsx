import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config/api";
import PasswordInput from "../../components/PasswordInput";
import SEO from "../../components/SEO";

// The demo-credential fallback (button + auto-login) only exists to make local
// development easier when the backend isn't running. `import.meta.env.DEV` is
// false in a production build, so none of this ships to a live admin panel.
const isDev = import.meta.env.DEV;

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleFillDemo = () => {
    setUsername("admin");
    setPassword("admin123");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        login(data.token, data.user);
        navigate("/admin");
      } else {
        if (isDev && username === "admin" && password === "admin123") {
          login("demo-jwt-token-wanderama-2026", { username: "admin", email: "admin@wanderama.com", role: "admin" });
          navigate("/admin");
        } else {
          setError(data.message || "Invalid username or password");
        }
      }
    } catch (err) {
      if (isDev && username === "admin" && password === "admin123") {
        login("demo-jwt-token-wanderama-2026", { username: "admin", email: "admin@wanderama.com", role: "admin" });
        navigate("/admin");
      } else {
        setError("Unable to connect to server. Make sure Node.js server is running on port 5000.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <SEO title="Admin Login" noindex />
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "#FFFFFF",
          borderRadius: "16px",
          padding: "36px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
          border: "1px solid #E2E8F0",
        }}
      >
        <div className="text-center mb-4">
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "#0564F2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFF",
              fontWeight: "800",
              fontSize: "22px",
              margin: "0 auto 12px auto",
            }}
          >
            W
          </div>
          <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#0F172A", margin: 0 }}>Wanderama Admin</h2>
          <p style={{ fontSize: "13px", color: "#64748B", marginTop: "4px" }}>Sign in to access management desk</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-600 text-dark">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-600 text-dark">Password</label>
            <PasswordInput
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-100 fw-600 py-2"
            style={{ borderRadius: "8px", fontSize: "14px" }}
          >
            {loading ? "Signing in..." : "Sign In to Control Desk"}
          </button>
        </form>

        {isDev && (
          <div className="mt-4 pt-3 border-top text-center">
            <button
              type="button"
              onClick={handleFillDemo}
              className="btn btn-light btn-sm w-100 text-primary border"
              style={{ borderRadius: "8px", fontSize: "13px", fontWeight: "600" }}
            >
              🔑 Fill Demo Credentials (admin / admin123)
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
