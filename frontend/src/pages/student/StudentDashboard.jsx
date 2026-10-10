
import Navbar from "../../components/layout/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import "../../styles/StudentDashboard.css";

function StudentDashboard() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [tests, setTests] = useState([]);

  const [performance, setPerformance] = useState({
    overallScore: 0,
    totalTests: 0,
    strongAreas: [],
    weakAreas: []
  });


  // =============================
  // LOAD TESTS
  // =============================

  const loadTests = async () => {

    try {

      const res = await API.get("/tests");

      if (res.data.tests) {

        setTests(res.data.tests);

      }

      else if (Array.isArray(res.data)) {

        setTests(res.data);

      }

      else {

        setTests([]);

      }

    }

    catch (error) {

      console.log("Tests Load Error:", error);

      setTests([]);

    }

  };


  // =============================
  // LOAD STUDENT PERFORMANCE
  // =============================

  const loadPerformance = async () => {

    try {

      const userId = user?._id;

      if (!userId) return;

      const res = await API.get(
        `/performance/student/${userId}`
      );

      if (res.data.success) {

        setPerformance(
          res.data.data || {
            overallScore: 0,
            totalTests: 0,
            strongAreas: [],
            weakAreas: []
          }
        );

      }

    }

    catch (error) {

      console.log(
        "Performance Load Error:",
        error.response?.data || error
      );

      setPerformance({
        overallScore: 0,
        totalTests: 0,
        strongAreas: [],
        weakAreas: []
      });

    }

  };


  // =============================
  // LOAD DATA
  // =============================

  useEffect(() => {

    loadTests();
    loadPerformance();

  }, []);


  // =============================
  // SUBJECTS
  // =============================

  const subjects = [

    "DSA",
    "DBMS",
    "Operating System",
    "Computer Network",
    "Java",
    "Python",
    "C Programming",
    "C++",
    "SQL",
    "Web Development",
    "Software Engineering",
    "Cloud Computing",
    "Cyber Security",
    "OOP Concepts",
    "Aptitude"

  ];


  return (

    <>

      <Navbar />


      <main className="student-dashboard">


        {/* =================================
            WELCOME HEADER
        ================================= */}

        <section className="dashboard-header">

          <h1>
            Welcome {user?.name || "Student"} 👋
          </h1>

          <p>
            Your AI powered placement preparation
            journey starts here 🚀
          </p>

        </section>


        {/* =================================
            PROFILE
        ================================= */}

        <section className="dashboard-card">

          <h2>
            👤 Profile
          </h2>


          <div className="profile-grid">


            <div className="profile-item">

              <span>Name</span>

              <strong>
                {user?.name || "Student"}
              </strong>

            </div>


            <div className="profile-item">

              <span>Email</span>

              <strong>
                {user?.email || "Not Available"}
              </strong>

            </div>


            <div className="profile-item">

              <span>College</span>

              <strong>
                {user?.college || "Not Available"}
              </strong>

            </div>


            <div className="profile-item">

              <span>Branch</span>

              <strong>
                {user?.branch || "Not Available"}
              </strong>

            </div>


            <div className="profile-item">

              <span>Year</span>

              <strong>
                {user?.year || "Not Available"}
              </strong>

            </div>


          </div>

        </section>


        {/* =================================
            TECHNICAL SUBJECTS
        ================================= */}

        <section className="dashboard-card">

          <h2>
            📚 Technical Subjects
          </h2>


          <div className="subjects-container">

            {

              subjects.map((sub) => (

                <button

                  key={sub}

                  className="subject-btn"

                  onClick={() =>
                    navigate(
                      `/student/subject/${encodeURIComponent(sub)}`
                    )
                  }

                >

                  📖 {sub}

                </button>

              ))

            }

          </div>

        </section>


        {/* =================================
            TEACHER ASSIGNED TESTS
        ================================= */}

        <section className="dashboard-card">

          <h2>
            📝 Teacher Assigned Tests
          </h2>


          {

            tests.length === 0 ? (

              <div className="empty-state">

                <p>
                  No Tests Available
                </p>

              </div>

            ) : (

              <div className="tests-container">

                {

                  tests.map((test) => (

                    <div

                      className="dashboard-test-card"

                      key={test._id}

                    >

                      <h3>
                        {test.title}
                      </h3>


                      <p>
                        <strong>
                          Subject:
                        </strong>{" "}
                        {test.subject}
                      </p>


                      <p>
                        <strong>
                          Marks:
                        </strong>{" "}
                        {test.totalMarks}
                      </p>


                      <p>
                        <strong>
                          Duration:
                        </strong>{" "}
                        {test.duration} Minutes
                      </p>


                      <button

                        onClick={() =>
                          navigate(
                            `/aptitude/${test._id}`
                          )
                        }

                      >

                        🚀 Start Test

                      </button>


                    </div>

                  ))

                }

              </div>

            )

          }

        </section>


        {/* =================================
            AI PLACEMENT TOOLS
        ================================= */}

        <section className="dashboard-card">

          <h2>
            🤖 AI Placement Tools
          </h2>


          <div className="tools-container">


            {/* RESUME BUILDER */}

            <div className="tool-card">

              <h3>
                📄 AI Resume Builder
              </h3>

              <p>
                Create ATS friendly resume
                with AI assistance.
              </p>

              <button

                onClick={() =>
                  navigate(
                    "/student/resume-builder"
                  )
                }

              >

                Open Resume Builder

              </button>

            </div>


            {/* MOCK INTERVIEW */}

            <div className="tool-card">

              <h3>
                🎤 AI Mock Interview
              </h3>

              <p>
                Practice real interviews using
                AI camera and voice.
              </p>

              <button

                onClick={() =>
                  navigate(
                    "/student/mock-interview"
                  )
                }

              >

                🎤 Start Interview

              </button>

            </div>


          </div>

        </section>


        {/* =================================
            PERFORMANCE ANALYTICS
        ================================= */}

        <section className="dashboard-card performance-card">

          <h2>
            📊 Performance Analytics
          </h2>


          <div className="performance-summary">


            {/* OVERALL SCORE */}

            <div className="performance-item">

              <span>
                Overall Score
              </span>

              <strong>
                {performance?.overallScore || 0}%
              </strong>

            </div>


            {/* TESTS ATTEMPTED */}

            <div className="performance-item">

              <span>
                Tests Attempted
              </span>

              <strong>
                {performance?.totalTests || 0}
              </strong>

            </div>


          </div>


          {/* STRONG / WEAK AREAS */}

          <div className="performance-area">


            <p>

              <strong>
                🔥 Strong Areas:
              </strong>{" "}

              {

                performance?.strongAreas?.length > 0

                  ?

                  performance.strongAreas.join(", ")

                  :

                  "No Data"

              }

            </p>


            <p>

              <strong>
                ⚠️ Need Improvement:
              </strong>{" "}

              {

                performance?.weakAreas?.length > 0

                  ?

                  performance.weakAreas.join(", ")

                  :

                  "No Weak Areas"

              }

            </p>


          </div>


          {/* DETAILED REPORT */}

          <button

            className="performance-btn"

            onClick={() =>
              navigate(
                "/student/performance"
              )
            }

          >

            📊 View Detailed Report

          </button>


        </section>


      </main>

    </>

  );

}


export default StudentDashboard;
