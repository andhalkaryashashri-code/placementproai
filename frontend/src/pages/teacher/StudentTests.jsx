import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import API from "../../api/axios";

function StudentTests() {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      const res = await API.get("/tests");

      if (Array.isArray(res.data)) {
        setTests(res.data);
      } else if (res.data.tests) {
        setTests(res.data.tests);
      } else {
        setTests([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="page">
        <h1>My Tests</h1>

        {tests.length === 0 ? (
          <div className="dashboard-card">
            <h2>No Tests Available</h2>
            <p>No tests have been created yet.</p>
          </div>
        ) : (
          tests.map((test) => (
            <div className="dashboard-card" key={test._id}>
              <h2>{test.title}</h2>

              <p>
                <strong>Subject:</strong> {test.subject}
              </p>

              <p>
                <strong>Total Marks:</strong> {test.totalMarks}
              </p>

              <p>
                <strong>Duration:</strong> {test.duration} Minutes
              </p>

              <button>Start Test</button>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default StudentTests;