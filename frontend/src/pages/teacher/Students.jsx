
import Navbar from "../../components/layout/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  // ================================
  // NEW: PERFORMANCE STATE
  // ================================

  const [performances, setPerformances] = useState({});

  const navigate = useNavigate();

  // =====================================================
  // LOAD STUDENTS
  // =====================================================

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);

      const res = await API.get("/users/students");

      const studentsList = res.data.students || [];

      setStudents(studentsList);

      // Load performance for every student
      loadStudentPerformances(studentsList);

    } catch (error) {
      console.error(
        "LOAD STUDENTS ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to load students"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD STUDENT PERFORMANCES
  // =====================================================

  const loadStudentPerformances = async (studentsList) => {
    try {
      const result = {};

      await Promise.all(
        studentsList.map(async (student) => {
          try {
            const res = await API.get(
              `/performance/student/${student._id}`
            );

            if (res.data.success) {
              result[student._id] =
                res.data.data;
            }
          } catch (error) {
            console.log(
              `No performance found for ${student.name}`
            );

            result[student._id] = {
              overallScore: 0,
              totalTests: 0,
              strongAreas: [],
              weakAreas: [],
            };
          }
        })
      );

      setPerformances(result);

    } catch (error) {
      console.error(
        "LOAD PERFORMANCE ERROR:",
        error
      );
    }
  };

  // =====================================================
  // DELETE STUDENT
  // =====================================================

  const deleteStudent = async (
    studentId,
    studentName
  ) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${studentName}?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeleting(studentId);

      await API.delete(
        `/users/${studentId}`
      );

      setStudents((previousStudents) =>
        previousStudents.filter(
          (student) =>
            student._id !== studentId
        )
      );

      // Remove performance from state too
      setPerformances((previous) => {
        const updated = { ...previous };
        delete updated[studentId];
        return updated;
      });

      alert(
        "✅ Student deleted successfully!"
      );
    } catch (error) {
      console.error(
        "DELETE STUDENT ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete student"
      );
    } finally {
      setDeleting(null);
    }
  };

  // =====================================================
  // VIEW STUDENT PROGRESS
  // =====================================================

  const viewProgress = (studentId) => {
    navigate(
      `/teacher/student-progress/${studentId}`
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="dashboard-container">
          <h1>👨‍🎓 Students</h1>
          <p>Loading students...</p>
        </div>
      </>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      <Navbar />

      <div className="dashboard-container">

        <h1>👨‍🎓 Students</h1>

        <p>
          View student profiles and progress.
        </p>

        {students.length === 0 ? (

          <div className="dashboard-card">

            <h3>No Students Found</h3>

            <p>
              There are currently no registered
              students.
            </p>

          </div>

        ) : (

          students.map((student) => {

            const performance =
              performances[student._id] || {
                overallScore: 0,
                totalTests: 0,
                strongAreas: [],
                weakAreas: [],
              };

            return (

              <div
                className="dashboard-card"
                key={student._id}
              >

                <h3>
                  {student.name || "Student"}
                </h3>

                <p>
                  <strong>Email:</strong>{" "}
                  {student.email || "No email"}
                </p>


                {/* ================================= */}
                {/* PERFORMANCE ANALYSIS */}
                {/* ================================= */}

                <div
                  style={{
                    marginTop: "15px",
                    padding: "15px",
                    borderRadius: "8px",
                    backgroundColor: "#f5f7fb",
                  }}
                >

                  <h4>
                    📊 Performance Analysis
                  </h4>

                  <p>
                    <strong>
                      Overall Score:
                    </strong>{" "}
                    {performance.overallScore || 0}%
                  </p>

                  <p>
                    <strong>
                      Tests Attempted:
                    </strong>{" "}
                    {performance.totalTests || 0}
                  </p>

                  <p>
                    <strong>
                      🔥 Strong Areas:
                    </strong>{" "}

                    {performance.strongAreas?.length > 0
                      ? performance.strongAreas.join(
                          ", "
                        )
                      : "No Data"}
                  </p>

                  <p>
                    <strong>
                      ⚠️ Need Improvement:
                    </strong>{" "}

                    {performance.weakAreas?.length > 0
                      ? performance.weakAreas.join(
                          ", "
                        )
                      : "No Data"}
                  </p>

                </div>


                {/* VIEW PROGRESS BUTTON */}

                <button
                  type="button"
                  onClick={() =>
                    viewProgress(student._id)
                  }
                  style={{
                    marginTop: "15px",
                    marginRight: "10px",
                    padding: "10px 18px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    fontWeight: "600",
                  }}
                >
                  📊 View Progress
                </button>


                {/* DELETE BUTTON */}

                <button
                  type="button"
                  onClick={() =>
                    deleteStudent(
                      student._id,
                      student.name ||
                        "this student"
                    )
                  }
                  disabled={
                    deleting === student._id
                  }
                  style={{
                    marginTop: "15px",
                    padding: "10px 18px",
                    border: "none",
                    borderRadius: "6px",
                    cursor:
                      deleting === student._id
                        ? "not-allowed"
                        : "pointer",
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    fontWeight: "600",
                  }}
                >
                  {deleting === student._id
                    ? "Deleting..."
                    : "🗑️ Delete Student"}
                </button>

              </div>

            );
          })

        )}

      </div>
    </>
  );
}

export default Students;