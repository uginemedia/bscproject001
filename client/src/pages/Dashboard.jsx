import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="dashboard-login-required">
        <div className="login-required-card">
          <div className="login-icon">🔒</div>

          <h2>Login Required</h2>

          <p>Please login to access your Smart Blood Donation dashboard.</p>

          <Link to="/login" className="dashboard-login-button">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* =========================
          TOP HEADER
      ========================= */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <div className="welcome-label">
            <span className="welcome-dot"></span>
            Dashboard
          </div>

          <h1>
            Welcome back, <span>{user.fullName}</span>
          </h1>

          <p>
            {user.role === "donor"
              ? "Thank you for helping save lives through blood donation."
              : "Manage your blood requests and donor activities from your dashboard."}
          </p>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          <span>↪</span>
          Logout
        </button>
      </div>

      {/* =========================
          DONOR DASHBOARD
      ========================= */}
      {user.role === "donor" && (
        <div className="dashboard-content">
          {/* Donor Overview */}
          <div className="dashboard-card donor-overview">
            <div className="card-heading">
              <div className="card-icon blood-icon">+</div>

              <div>
                <h2>Donor Overview</h2>
                <p>Your current donor information</p>
              </div>
            </div>

            <div className="info-grid">
              <div className="info-item blood-group-item">
                <span>Blood Group</span>

                <strong className="blood-group">
                  {user.bloodGroup || "--"}
                </strong>
              </div>

              <div className="info-item">
                <span>Location</span>

                <strong>{user.city || "Not provided"}</strong>

                <small>{user.state || "State not provided"}</small>
              </div>

              <div className="info-item">
                <span>Donor Status</span>

                <strong
                  className={
                    user.isAvailable ? "status available" : "status unavailable"
                  }
                >
                  <span className="status-dot"></span>

                  {user.isAvailable ? "Available" : "Not Available"}
                </strong>
              </div>

              <div className="info-item">
                <span>Account Type</span>

                <strong className="capitalize">{user.role}</strong>

                <small>Registered donor</small>
              </div>
            </div>
          </div>

          {/* Donor Actions */}
          <div className="section-title">
            <div>
              <h2>Quick Actions</h2>
              <p>Manage your donor activities</p>
            </div>
          </div>

          <div className="dashboard-actions">
            <Link to="/profile" className="dashboard-action">
              <div className="action-icon profile-icon">👤</div>

              <div className="action-content">
                <h3>My Profile</h3>

                <p>View and update your personal and donor information.</p>

                <span className="action-link">View Profile →</span>
              </div>
            </Link>

            <Link
              to="/notifications"
              className="dashboard-action notification-action"
            >
              <div className="action-icon notification-icon">🔔</div>

              <div className="action-content">
                <h3>Notifications</h3>

                <p>
                  View emergency blood requests that match your information.
                </p>

                <span className="action-link">View Notifications →</span>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
