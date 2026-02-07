import React, { useState } from "react";
import "./Login.css";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
  const pattern = /^[a-z]+\.([a-z]+)[0-9]{4}@citchennai\.net$/;
  return pattern.test(email);
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email.trim()) {
      setError("Please enter your official college email");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Use format: name.departmentYEAR@citchennai.net");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      onLoginSuccess(email.toLowerCase());
    } catch (err) {
      setError(err.message || "Backend not running");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">📚</div>
          <h2>Student OD Tracker</h2>
          <p>Login using your official college email</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Official College Email</label>
            <div className="input-wrapper">
              <input
                id="email"
                type="email"
                placeholder="name.department2024@citchennai.net"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className={
                  error && email && !validateEmail(email)
                    ? "input-error"
                    : ""
                }
              />
            </div>
          </div>

          {error && (
            <div className="error-alert">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            className={`login-button ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="button-spinner"></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Secure access for CIT students only</p>
          <div className="security-badges">
            <span className="badge">🔐 Secure</span>
            <span className="badge">✓ Verified</span>
          </div>
        </div>
      </div>

      <div className="login-illustration">
        <div className="illustration-circle circle-1"></div>
        <div className="illustration-circle circle-2"></div>
        <div className="illustration-circle circle-3"></div>
      </div>
    </div>
  );
}

export default Login;
