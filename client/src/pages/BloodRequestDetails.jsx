import React from "react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";

import "../styles/BloodRequestDetails.css";

import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const BloodRequestDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);

  const [existingResponse, setExistingResponse] = useState(null);

  const fetchRequest = async () => {
    try {
      const response = await api.get(`/blood-requests/${id}`);

      if (response.data.success) {
        setRequest(response.data.request);
      }

      if (user?._id) {
        const donationResponse = await api.get(
          `/donations/request/${id}`
        );

        const donations =
          donationResponse.data.donations ||
          donationResponse.data.responses ||
          [];

        const userDonation = donations.find((donation) => {
          const donorId =
            typeof donation.donor === "object"
              ? donation.donor?._id
              : donation.donor;

          return String(donorId) === String(user._id);
        });

        setExistingResponse(userDonation?.status || null);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to load blood request."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [id, user?._id]);

  const respondToRequest = async (status) => {
    if (existingResponse) {
      toast.info(
        `You have already ${existingResponse.toLowerCase()} this request.`
      );
      return;
    }

    try {
      setResponding(true);

      const response = await api.post("/donations/respond", {
        donor: user._id,
        bloodRequest: id,
        status,
      });

      if (response.data.success) {
        toast.success(
          status === "Accepted"
            ? "You accepted the blood request."
            : "You declined the blood request.",
        );

        navigate("/notifications");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit your response.",
      );
    } finally {
      setResponding(false);
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="blood-request-page">
        <div className="request-loading">
          <div className="request-loading-icon">+</div>

          <h2>Loading Blood Request</h2>

          <p>Please wait while we retrieve the emergency request.</p>

          <div className="request-loading-bar"></div>
        </div>
      </div>
    );
  }

  /* =========================
     REQUEST NOT FOUND
  ========================= */

  if (!request) {
    return (
      <div className="blood-request-page">
        <div className="request-not-found">
          <div className="not-found-icon">!</div>

          <h2>Request Not Found</h2>

          <p>
            This blood request may have been removed or is no longer available.
          </p>

          <Link to="/notifications" className="request-back-button">
            ← Back to Notifications
          </Link>
        </div>
      </div>
    );
  }

  const isUrgent = request.urgency?.toLowerCase().includes("urgent");

  return (
    <div className="blood-request-page">
      <div className="blood-request-wrapper">
        {/* ==================================
            BACK LINK
        ================================== */}

        <Link to="/notifications" className="top-back-link">
          <ion-icon name="arrow-back"></ion-icon>
        </Link>

        {/* ==================================
            MAIN CARD
        ================================== */}

        <div className="request-detail-card">
          {/* ==================================
              EMERGENCY HEADER
          ================================== */}

          <div className="request-hero">
            <div className="request-hero-content">
              <div className="request-alert-icon"><ion-icon name="add"></ion-icon></div>

              <div>
                <span className="request-eyebrow">EMERGENCY BLOOD REQUEST</span>

                <h1>Blood Donation Needed</h1>

                <p>A hospital has requested blood from a matching donor.</p>
              </div>
            </div>

            <div className={`request-urgency ${isUrgent ? "urgent" : ""}`}>
              <span className="urgency-pulse"></span>

              {request.urgency}
            </div>
          </div>

          {/* ==================================
              QUICK BLOOD SUMMARY
          ================================== */}

          <div className="blood-summary">
            <div className="blood-summary-main">
              <span>Blood Group</span>

              <strong>{request.bloodGroup}</strong>
            </div>

            <div className="summary-divider"></div>

            <div>
              <span>Units Required</span>

              <strong>{request.unitsNeeded}</strong>
            </div>

            <div className="summary-divider"></div>

            <div>
              <span>Location</span>

              <strong>{request.city}</strong>
            </div>
          </div>

          {/* ==================================
              PATIENT INFORMATION
          ================================== */}

          <div className="request-detail-section">
            <div className="section-heading">
              <div className="section-icon"><ion-icon name="person"></ion-icon></div>

              <div>
                <span>PATIENT INFORMATION</span>

                <h2>Patient Details</h2>
              </div>
            </div>

            <div className="detail-grid">

              <div className="detail-item">
                <span>Blood Group</span>

                <strong className="blood-value">{request.bloodGroup}</strong>
              </div>

              <div className="detail-item">
                <span>Units Needed</span>

                <strong>{request.unitsNeeded} unit(s)</strong>
              </div>

              <div className="detail-item">
                <span>Urgency</span>

                <strong className="urgency-text">{request.urgency}</strong>
              </div>
            </div>
          </div>

          {/* ==================================
              LOCATION
          ================================== */}

          <div className="request-detail-section">
            <div className="section-heading">
              <div className="section-icon"><ion-icon name="location"></ion-icon></div>

              <div>
                <span>DONATION LOCATION</span>

                <h2>Where Blood Is Needed</h2>
              </div>
            </div>

            <div className="location-card">

              <div>
                <strong>
                  {request.city}, {request.state}
                </strong>

                <p>
                  Please contact the hospital for further donation instructions.
                </p>
              </div>
            </div>
          </div>``

          {/* ==================================
              DONOR RESPONSE
          ================================== */}

          {existingResponse ? <div className="response-true">{`You have already ${existingResponse.toLowerCase()} this request.`}</div> :

            <div className="donor-response">
              <div className="response-icon"><ion-icon name="heart-outline"></ion-icon></div>

              <h2>Can you help save a life?</h2>

              <p>
                Your response will be sent to the hospital. Please only accept if
                you are available and eligible to donate.
              </p>

              <div className="response-buttons">
                <button
                  className="accept-button"
                  disabled={responding}
                  onClick={() => respondToRequest("Accepted")}
                >
                  <span><ion-icon name="checkmark-outline"></ion-icon></span>

                  {responding ? "Processing..." : "I Can Donate"}
                </button>

                <button
                  className="decline-button"
                  disabled={responding}
                  onClick={() => respondToRequest("Declined")}
                >
                  <span><ion-icon name="close-outline"></ion-icon></span>
                  {responding ? "Processing..." : "I Can't Donate"}
                </button>
              </div>

              <small>You can respond only once to this request.</small>
            </div>}



          {/* ==================================
              FOOTER
          ================================== */}

          <div className="request-footer">
            <span>Every donation can make a difference.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodRequestDetails;
