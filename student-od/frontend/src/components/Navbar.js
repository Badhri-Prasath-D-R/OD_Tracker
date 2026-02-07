import React, { useState } from "react";
import "./Navbar.css";

function Navbar({ studentEmail, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogoutClick = () => {
    setShowDropdown(false);
    onLogout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        {/* LEFT */}
        <div className="navbar-left">
          <span className="navbar-title">
            📋 Student OD Tracker
          </span>
        </div>

        {/* RIGHT */}
        <div className="navbar-right">
          <div className="user-menu">
            <button
              className="user-button"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="user-avatar">
                {studentEmail.charAt(0).toUpperCase()}
              </div>
              <span className="user-email">
                {studentEmail.split("@")[0]}
              </span>
              <span className={`arrow ${showDropdown ? "open" : ""}`}>
                ▼
              </span>
            </button>

            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-email">{studentEmail}</div>
                <button
                  className="logout-button"
                  onClick={handleLogoutClick}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
