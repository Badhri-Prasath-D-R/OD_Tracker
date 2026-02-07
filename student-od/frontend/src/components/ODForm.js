import React, { useState } from "react";
import "./ODForm.css";

function ODForm({ studentEmail }) {
  const [formData, setFormData] = useState({
    studentName: "",
    rollNo: "",
    department: "",
    section: "",
    reason: "",
    venue: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const reasons = [
    "Academic Event",
    "Sports Event",
    "Cultural Event",
    "Hackathon",
    "Workshop",
    "Conference",
    "Medical",
    "Other",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (
      !formData.studentName.trim() ||
      !formData.rollNo.trim() ||
      !formData.department.trim() ||
      !formData.section.trim()
    ) {
      setError("Please fill all student details");
      return false;
    }

    if (!formData.reason) {
      setError("Please select a reason");
      return false;
    }

    if (!formData.venue.trim()) {
      setError("Please enter venue / event name");
      return false;
    }

    if (!formData.description.trim()) {
      setError("Please enter description");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/od/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_email: studentEmail,
          student_name: formData.studentName,
          roll_no: formData.rollNo,
          department: formData.department,
          section: formData.section,
          reason: formData.reason,
          venue: formData.venue,
          description: formData.description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = "Failed to submit OD request";

        if (Array.isArray(data.detail)) {
          errorMessage = data.detail.map((err) => err.msg).join(", ");
        } else if (typeof data.detail === "string") {
          errorMessage = data.detail;
        }

        throw new Error(errorMessage);
      }

      setSuccess(true);
      setFormData({
        studentName: "",
        rollNo: "",
        department: "",
        section: "",
        reason: "",
        venue: "",
        description: "",
      });

    } catch (err) {
      setError(err.message || "Backend not running");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="od-form-container">
      <div className="od-form-card">
        <div className="form-header">
          <h2>📝 OD Request Form</h2>
          <p>
            Request Status: <strong>Pending</strong>
          </p>
        </div>

        {success && (
          <div className="success-alert">
            ✅ OD Request submitted successfully <br />
            <strong>Status: Pending</strong>
          </div>
        )}

        {error && (
          <div className="error-alert-form">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-content">

          {/* STUDENT DETAILS */}
          <div className="form-section">
            <h3 className="section-title">👤 Student Details</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Student Name *</label>
                <input
                  type="text"
                  name="studentName"
                  placeholder="Enter your full name"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Register Number *</label>
                <input
                  type="text"
                  name="rollNo"
                  placeholder="Enter register number"
                  value={formData.rollNo}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Department *</label>
                <input
                  type="text"
                  name="department"
                  placeholder="Eg: AIDS"
                  value={formData.department}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Section *</label>
                <input
                  type="text"
                  name="section"
                  placeholder="Eg: A"
                  value={formData.section}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* OD DETAILS */}
          <div className="form-section">
            <label>Reason *</label>
            <select
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              disabled={loading}
            >
              <option value="">Select reason</option>
              {reasons.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="form-section">
            <label>Venue / Event Name *</label>
            <input
              type="text"
              name="venue"
              placeholder="Eg: Inter-college Hackathon"
              value={formData.venue}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>

          <div className="form-section">
            <label>Description *</label>
            <textarea
              name="description"
              rows="4"
              placeholder="Brief description about the event"
              value={formData.description}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className={`submit-button ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit OD Request"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default ODForm;
