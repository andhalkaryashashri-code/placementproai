import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import API from "../../api/axios";
import "../../styles/TeacherDashboard.css";

function ManageQuestions() {
  const navigate = useNavigate();

  const [tests, setTests] = useState([]);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      const res = await API.get("/tests");

      console.log("MANAGE TESTS:", res.data);

      if (Array.isArray(res.data)) {
        setTests(res.data);
      } else if (res.data.tests) {
        setTests(res.data.tests);
      } else {
        setTests([]);
      }
    } catch (error) {
      console.log(error.response?.data || error);
    }
  };

  const deleteTest = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this test?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/tests/${id}`);

      alert("Test deleted successfully!");

      loadTests();
    } catch (error) {
      console.log(error.response?.data || error);
      alert("Failed to delete test");
    }
  };

  return (
    <>
      <Navbar />

      <div className="dashboard-container">
        <h2>📚 Manage Questions</h2>
        <p>Select your created test and manage questions</p>

        {tests.length === 0 ? (
          <p>No Tests Found</p>
        ) : (
          <div className="dashboard-grid">
            {tests.map((test) => (
              <div className="dashboard-card" key={test._id}>
                <h3>{test.title}</h3>

                <p>
                  <strong>Subject :</strong> {test.subject}
                </p>

                <p>
                  <strong>Total Marks :</strong> {test.totalMarks}
                </p>

                <p>
                  <strong>Duration :</strong> {test.duration} Minutes
                </p>

                <button
                  onClick={() =>
                    navigate(`/teacher/add-question/${test._id}`)
                  }
                >
                  ➕ Add Question
                </button>

                <button
                  onClick={() =>
                    navigate(`/teacher/questions/${test._id}`)
                  }
                >
                  📋 View Questions
                </button>

                <button
                  onClick={() =>
                    navigate(`/teacher/result/${test._id}`)
                  }
                >
                  📊 View Result
                </button>

                <button
                  style={{
                    background: "#dc2626",
                    color: "#fff",
                    marginTop: "10px",
                  }}
                  onClick={() => deleteTest(test._id)}
                >
                  🗑 Delete Test
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ManageQuestions;