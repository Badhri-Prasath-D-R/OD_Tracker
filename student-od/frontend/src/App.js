import React, { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import ODForm from "./components/ODForm";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem("studentEmail");
    if (email) {
      setIsAuthenticated(true);
      setStudentEmail(email);
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (email) => {
    setStudentEmail(email);
    setIsAuthenticated(true);
    localStorage.setItem("studentEmail", email);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setStudentEmail("");
    localStorage.removeItem("studentEmail");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="app">
      {isAuthenticated && (
        <Navbar studentEmail={studentEmail} onLogout={handleLogout} />
      )}

      <main className={`main-content ${isAuthenticated ? "authenticated" : ""}`}>
        {!isAuthenticated ? (
          <Login onLoginSuccess={handleLoginSuccess} />
        ) : (
          <ODForm studentEmail={studentEmail} />
        )}
      </main>
    </div>
  );
}

export default App;
