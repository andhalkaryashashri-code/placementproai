
import { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import API from "../../api/axios";
import "../../styles/AddTest.css";

function AddTest() {
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    totalMarks: "",
    duration: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Create test
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate title
    if (!formData.title.trim()) {
      alert("Please enter test title.");
      return;
    }

    // Validate subject
    if (!formData.subject) {
      alert("Please select a subject.");
      return;
    }

    // Convert values to numbers
    const totalMarks = Number(formData.totalMarks);
    const duration = Number(formData.duration);

    // Validate total marks
    if (
      !Number.isFinite(totalMarks) ||
      totalMarks <= 0
    ) {
      alert("Please enter valid total marks.");
      return;
    }

    // Validate duration
    if (
      !Number.isFinite(duration) ||
      duration <= 0
    ) {
      alert(
        "Please enter a valid duration in minutes."
      );
      return;
    }

    try {
      setLoading(true);

      // Get logged-in user
      let user = {};

      try {
        user = JSON.parse(
          localStorage.getItem("user") || "{}"
        );
      } catch (error) {
        console.log(
          "User data parse error:",
          error
        );
      }

      // Data sent to backend
      const data = {
        title: formData.title.trim(),
        subject: formData.subject,
        totalMarks: totalMarks,

        // Duration in minutes
        duration: duration,

        date: new Date(),
        time: "10:00 AM",

        createdBy: user._id || "Teacher",
      };

      console.log(
        "Sending Test Data:",
        data
      );

      // Create test
      const response = await API.post(
        "/tests",
        data
      );

      console.log(
        "Create Test Response:",
        response.data
      );

      alert(
        "✅ Test Created Successfully!"
      );

      // Reset form
      setFormData({
        title: "",
        subject: "",
        totalMarks: "",
        duration: "",
      });
    } catch (error) {
      console.error(
        "CREATE TEST ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to Create Test"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="add-test">
        <h1>Create New Test</h1>

        <form onSubmit={handleSubmit}>
          {/* Test Title */}

          <input
            type="text"
            name="title"
            placeholder="Test Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          {/* Subject */}

          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Subject
            </option>

            <option value="DBMS">
              DBMS
            </option>

            <option value="Operating System">
              Operating System
            </option>

            <option value="Computer Network">
              Computer Network
            </option>

            <option value="DSA">
              DSA
            </option>

            <option value="Java">
              Java
            </option>

            <option value="Python">
              Python
            </option>

            <option value="C Programming">
              C Programming
            </option>

            <option value="C++">
              C++
            </option>

            <option value="SQL">
              SQL
            </option>

            <option value="Aptitude">
              Aptitude
            </option>
          </select>

          {/* Total Marks */}

          <input
            type="number"
            name="totalMarks"
            placeholder="Total Marks"
            value={formData.totalMarks}
            onChange={handleChange}
            min="1"
            step="1"
            required
          />

          {/* Duration */}

          <input
            type="number"
            name="duration"
            placeholder="Duration (Minutes)"
            value={formData.duration}
            onChange={handleChange}
            min="1"
            step="1"
            required
          />

          <small>
            ⏱️ Enter test duration in minutes.
            Example: 30 = 30 minutes.
          </small>

          {/* Create Button */}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating Test..."
              : "Create Test"}
          </button>
        </form>
      </div>
    </>
  );
}

export default AddTest;
