import React from "react";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

import "../styles/Profile.css";

const Profile = () => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    bloodGroup: "",
    genotype: "",
    state: "",
    city: "",
    weight: "",
    isAvailable: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        bloodGroup: user.bloodGroup || "",
        genotype: user.genotype || "",
        state: user.state || "",
        city: user.city || "",
        weight: user.weight || "",
        isAvailable: user.isAvailable ?? true,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.put(`/auth/profile/${user._id}`, formData);

      if (response.data.success) {
        toast.success("Profile updated successfully.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-login-message">
          <div className="profile-login-icon">🔒</div>

          <h2>Login Required</h2>

          <p>Please login to access your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-wrapper">
        {/* Back to Dashboard */}

        <Link to="/dashboard" className="profile-back-link">
          <span>←</span>
          Back to Dashboard
        </Link>

        {/* =========================
            PROFILE HEADER
        ========================= */}
        <div className="profile-hero">
          <div className="profile-avatar">
            {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
          </div>

          <div className="profile-hero-content">
            <div className="profile-role">
              {user.role === "donor" ? "Blood Donor" : user.role}
            </div>

            <h1>{user.fullName}</h1>

            <p>
              Keep your information up to date so we can connect you with blood
              requests when you are needed.
            </p>
          </div>

          <div
            className={`profile-status ${
              formData.isAvailable
                ? "profile-status-available"
                : "profile-status-unavailable"
            }`}
          >
            <span className="status-dot"></span>

            {formData.isAvailable
              ? "Available to Donate"
              : "Currently Unavailable"}
          </div>
        </div>

        {/* =========================
            PROFILE FORM
        ========================= */}
        <div className="profile-card">
          <div className="profile-card-header">
            <div>
              <h2>Personal Information</h2>

              <p>
                Update your information to keep your donor profile accurate.
              </p>
            </div>

            <div className="profile-card-icon">👤</div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="profile-section">
              <div className="profile-section-title">
                <span>01</span>
                <div>
                  <h3>Basic Information</h3>
                  <p>Your personal account details</p>
                </div>
              </div>

              <div className="profile-form-grid">
                <div className="profile-form-group">
                  <label>Full Name</label>

                  <div className="input-wrapper">
                    <span className="input-icon">👤</span>

                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div className="profile-form-group">
                  <label>Email Address</label>

                  <div className="input-wrapper disabled-input">
                    <span className="input-icon">✉</span>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                    />
                  </div>

                  <small>Email cannot be changed.</small>
                </div>

                <div className="profile-form-group">
                  <label>Phone Number</label>

                  <div className="input-wrapper">
                    <span className="input-icon">☎</span>

                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="profile-section">
              <div className="profile-section-title">
                <span>02</span>

                <div>
                  <h3>Medical Information</h3>
                  <p>Information used for donor matching</p>
                </div>
              </div>

              <div className="profile-form-grid">
                <div className="profile-form-group">
                  <label>Blood Group</label>

                  <div className="input-wrapper">
                    <span className="input-icon blood-icon">+</span>

                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                    >
                      <option value="">Select blood group</option>

                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>

                <div className="profile-form-group">
                  <label>Genotype</label>

                  <div className="input-wrapper">
                    <span className="input-icon">🧬</span>

                    <select
                      name="genotype"
                      value={formData.genotype}
                      onChange={handleChange}
                    >
                      <option value="">Select genotype</option>

                      <option value="AA">AA</option>
                      <option value="AS">AS</option>
                      <option value="SS">SS</option>
                      <option value="AC">AC</option>
                      <option value="SC">SC</option>
                    </select>
                  </div>
                </div>

                <div className="profile-form-group">
                  <label>Weight</label>

                  <div className="input-wrapper">
                    <span className="input-icon">⚖</span>

                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="Enter weight"
                    />

                    <span className="input-unit">kg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="profile-section">
              <div className="profile-section-title">
                <span>03</span>

                <div>
                  <h3>Location</h3>
                  <p>Used to find nearby blood requests</p>
                </div>
              </div>

              <div className="profile-form-grid">
                <div className="profile-form-group">
                  <label>State</label>

                  <div className="input-wrapper">
                    <span className="input-icon">📍</span>

                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Enter your state"
                    />
                  </div>
                </div>

                <div className="profile-form-group">
                  <label>City</label>

                  <div className="input-wrapper">
                    <span className="input-icon">🏙</span>

                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter your city"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="availability-card">
              <div className="availability-icon">✓</div>

              <div className="availability-content">
                <h3>Available to Donate</h3>

                <p>
                  Allow hospitals to find you when your blood type is needed.
                </p>
              </div>

              <label className="switch">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                />

                <span className="slider"></span>
              </label>
            </div>

            {/* Submit */}
            <div className="profile-form-footer">
              <p>
                Your information helps us match you with relevant emergency
                blood requests.
              </p>

              <button
                type="submit"
                className="save-profile-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="button-spinner"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    Save Changes
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
