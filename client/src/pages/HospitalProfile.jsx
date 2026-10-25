import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

import "../styles/HospitalProfile.css";

const initialFormData = {
  hospitalName: "",
  fullName: "",
  email: "",
  phone: "",
  address: "",
  state: "",
  city: "",
  hospitalLicense: "",
  licenseNumber: "",
};

const HospitalProfile = () => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState(initialFormData);
  const [requests, setRequests] = useState([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [donationResponses, setDonationResponses] = useState([]);

  // Load hospital information
  useEffect(() => {
    if (!user) return;

    setFormData({
      hospitalName: user.hospitalName || "",
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      state: user.state || "",
      city: user.city || "",
      hospitalLicense: user.hospitalLicense || "",
      licenseNumber: user.licenseNumber || "",
    });
  }, [user]);

  // Load hospital requests
  useEffect(() => {
    const fetchRequests = async () => {
      if (!user?._id) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/blood-requests/hospital/${user._id}`);

        if (response.data.success) {
          setRequests(response.data.requests || []);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load hospital statistics.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user?._id]);

  // Fetch user responses
  useEffect(() => {
    const fetchDonationResponses = async () => {
      if (!requests.length) {
        setDonationResponses([]);
        return;
      }

      try {
        const responses = await Promise.all(
          requests.map(async (request) => {
            const response = await api.get(`/donations/request/${request._id}`);

            return response.data.donations || response.data.responses || [];
          }),
        );

        setDonationResponses(responses.flat());
      } catch (error) {
        console.error("Error fetching donation responses:", error);
      }
    };

    fetchDonationResponses();
  }, [requests]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save updated hospital information
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const response = await api.put(`/auth/profile/${user._id}`, formData);

      if (response.data.success) {
        const updatedUser = response.data.user || {};

        setFormData((prev) => ({
          ...prev,
          ...updatedUser,
        }));

        setEditing(false);
        toast.success("Hospital profile updated successfully.");
      } else {
        toast.error(response.data.message || "Failed to update profile.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update hospital profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="hospital-profile-page">
        <div className="hospital-profile-empty">
          <h2>Please log in to view your profile.</h2>
          <Link to="/" className="hospital-primary-button">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const getDonorId = (response) => {
    const donor = response.donor;

    if (!donor) return null;

    return String(typeof donor === "object" ? donor._id : donor);
  };

  const acceptedUsers = new Set(
    donationResponses
      .filter((response) => response.status?.toLowerCase() === "accepted")
      .map(getDonorId)
      .filter(Boolean),
  );

  const declinedUsers = new Set(
    donationResponses
      .filter((response) => response.status?.toLowerCase() === "declined")
      .map(getDonorId)
      .filter(Boolean),
  );

  const totalRequests = requests.length;
  const acceptedRequests = acceptedUsers.size;
  const declinedRequests = declinedUsers.size;

  const displayValue = (value) => value || "Not provided";

  return (
    <div className="hospital-profile-page">
      <div className="hospital-profile-wrapper">
        {/* Back to Dashboard */}
        <Link to="/hospital-dashboard" className="hospital-profile-back">
          <span>←</span>
          Back to Dashboard
        </Link>

        {/* Profile Header */}
        <section className="hospital-profile-hero">
          <div className="hospital-profile-avatar">
            <span>✚</span>
          </div>

          <div className="hospital-profile-heading">
            <span className="hospital-profile-eyebrow">HOSPITAL ACCOUNT</span>

            <h1>
              {formData.hospitalName || formData.fullName || "Hospital Profile"}
            </h1>

            <p>Manage your hospital information and blood donation activity.</p>

            <div className="hospital-verification">
              <span
                className={
                  user.isVerified
                    ? "verification-dot verified"
                    : "verification-dot unverified"
                }
              />

              {user.isVerified ? "Verified Hospital" : "Not Yet Verified"}
            </div>
          </div>

          {!editing && (
            <button
              type="button"
              className="hospital-edit-button"
              onClick={() => setEditing(true)}
            >
              <span>✎</span> Edit Profile
            </button>
          )}
        </section>

        {/* Statistics */}
        <section className="hospital-profile-stats">
          <div className="hospital-stat-card">
            <div className="hospital-stat-icon red-icon">▤</div>
            <div>
              <span>Total Requests</span>
              <strong>{loading ? "—" : totalRequests}</strong>
            </div>
          </div>

          <div className="hospital-stat-card">
            <div className="hospital-stat-icon green-icon">✓</div>
            <div>
              <span>Accepted Requests</span>
              <strong>{loading ? "—" : acceptedRequests}</strong>
            </div>
          </div>

          <div className="hospital-stat-card">
            <div className="hospital-stat-icon red-icon">✕</div>
            <div>
              <span>Declined Requests</span>
              <strong>{loading ? "—" : declinedRequests}</strong>
            </div>
          </div>
        </section>

        {/* Profile Information */}
        <section className="hospital-profile-card">
          <div className="hospital-card-heading">
            <div>
              <h2>Hospital Information</h2>
              <p>Your hospital's identity and contact details.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="hospital-form-grid">
              <div className="hospital-form-group">
                <label htmlFor="hospitalName">Hospital Name</label>
                <input
                  id="hospitalName"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="Enter hospital name"
                  required
                />
              </div>

              <div className="hospital-form-group">
                <label htmlFor="fullName">Contact Person</label>
                <input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="Enter contact person's name"
                  required
                />
              </div>

              <div className="hospital-form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="hospital@example.com"
                  required
                />
              </div>

              <div className="hospital-form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div className="hospital-form-group full-width">
                <label htmlFor="address">Hospital Address</label>
                <input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="Street address"
                />
              </div>

              <div className="hospital-form-group">
                <label htmlFor="state">State</label>
                <input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="Enter state"
                  required
                />
              </div>

              <div className="hospital-form-group">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="Enter city"
                  required
                />
              </div>

              <div className="hospital-form-group">
                <label htmlFor="hospitalLicense">Hospital License</label>
                <input
                  id="hospitalLicense"
                  name="hospitalLicense"
                  value={formData.hospitalLicense}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="Enter hospital license"
                />
              </div>

              <div className="hospital-form-group">
                <label htmlFor="licenseNumber">Registration Number</label>
                <input
                  id="licenseNumber"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="Enter registration number"
                />
              </div>
            </div>

            {!editing && (
              <div className="hospital-profile-readonly-note">
                Your hospital details are shown in view mode. Select Edit
                Profile to make changes.
              </div>
            )}

            {editing && (
              <div className="hospital-form-actions">
                <button
                  type="button"
                  className="hospital-cancel-button"
                  onClick={() => {
                    setFormData({
                      hospitalName: user.hospitalName || "",
                      fullName: user.fullName || "",
                      email: user.email || "",
                      phone: user.phone || "",
                      address: user.address || "",
                      state: user.state || "",
                      city: user.city || "",
                      hospitalLicense: user.hospitalLicense || "",
                      licenseNumber: user.licenseNumber || "",
                    });
                    setEditing(false);
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="hospital-save-button"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        </section>

        {/* Account Information */}
        <section className="hospital-account-note">
          <div className="hospital-account-note-icon">i</div>
          <div>
            <h3>Account Verification</h3>
            <p>
              Verification status is managed by the system. Editing your profile
              does not automatically verify your hospital. Contact your system
              administrator if your verification status needs to be reviewed.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HospitalProfile;
