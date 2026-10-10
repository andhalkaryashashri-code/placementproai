import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import API from "../../api/axios";
import "../../styles/TeacherDashboard.css";

function TestAttempt() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [test, setTest] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [timeLeft, setTimeLeft] = useState(null);

  const [tabWarnings, setTabWarnings] = useState(0);

  const [started, setStarted] = useState(false);

  const [error, setError] = useState("");

  const submitInProgress = useRef(false);
  const startTimeRef = useRef(null);
  const expiryTimeRef = useRef(null);

  // =====================================================
  // LOAD TEST + QUESTIONS
  // =====================================================

  useEffect(() => {
    loadTest();
  }, [id]);

  const loadTest = async () => {
    try {
      setLoading(true);
      setError("");

      const [testResponse, questionResponse] =
        await Promise.all([
          API.get(`/tests/${id}`),
          API.get(`/questions/${id}`)
        ]);

      const testData =
        testResponse.data?.test || {};

      const questionData =
        questionResponse.data?.questions || [];

      setTest(testData);
      setQuestions(questionData);

      // =================================================
      // START TEST
      // =================================================

      const startResponse = await API.post(
        `/tests/${id}/start`
      );

      const startedAt =
        startResponse.data?.startedAt;

      const expiresAt =
        startResponse.data?.expiresAt;

      const duration =
        Number(
          startResponse.data?.duration ||
            testData.duration ||
            30
        );

      const startTime =
        startedAt
          ? new Date(startedAt).getTime()
          : Date.now();

      const expiryTime =
        expiresAt
          ? new Date(expiresAt).getTime()
          : startTime + duration * 60 * 1000;

      startTimeRef.current = startTime;
      expiryTimeRef.current = expiryTime;

      setStarted(true);

      updateTimer(expiryTime);
    } catch (err) {
      console.log(
        "LOAD TEST ERROR:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load test."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // TIMER
  // =====================================================

  const updateTimer = (expiryTime) => {
    const remaining = Math.max(
      0,
      Math.ceil(
        (expiryTime - Date.now()) / 1000
      )
    );

    setTimeLeft(remaining);

    if (remaining <= 0) {
      submitTest("time");
    }
  };

  useEffect(() => {
    if (
      !started ||
      !expiryTimeRef.current ||
      submitting
    ) {
      return;
    }

    const timer = setInterval(() => {
      updateTimer(expiryTimeRef.current);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [started, submitting]);

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (seconds) => {
    if (seconds === null) {
      return "--:--";
    }

    const minutes = Math.floor(
      seconds / 60
    );

    const remainingSeconds =
      seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(remainingSeconds).padStart(
      2,
      "0"
    )}`;
  };

  // =====================================================
  // SELECT ANSWER
  // =====================================================

  const selectAnswer = (
    questionId,
    value
  ) => {
    if (submitting) return;

    setAnswers((previous) => ({
      ...previous,
      [questionId]: value
    }));
  };

  // =====================================================
  // TAB / WINDOW CHANGE
  // =====================================================

  useEffect(() => {
    if (!started || submitting) {
      return;
    }

    const handleVisibilityChange = () => {
      if (
        document.visibilityState ===
        "hidden"
      ) {
        handleTabViolation();
      }
    };

    const handleWindowBlur = () => {
      handleTabViolation();
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    window.addEventListener(
      "blur",
      handleWindowBlur
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      window.removeEventListener(
        "blur",
        handleWindowBlur
      );
    };
  }, [started, submitting, tabWarnings]);

  const handleTabViolation = () => {
    if (
      submitInProgress.current ||
      submitting
    ) {
      return;
    }

    setTabWarnings((previous) => {
      const nextWarning = previous + 1;

      if (nextWarning >= 4) {
        setTimeout(() => {
          submitTest("tab");
        }, 0);
      } else {
        setTimeout(() => {
          alert(
            `⚠️ Warning ${nextWarning}/3\n\n` +
              "Do not switch tabs or windows.\n" +
              `One more violation will ${
                nextWarning === 3
                  ? "submit your test."
                  : "give another warning."
              }`
          );
        }, 0);
      }

      return nextWarning;
    });
  };

  // =====================================================
  // PREVENT COPY / PASTE / RIGHT CLICK
  // =====================================================

  useEffect(() => {
    if (!started || submitting) {
      return;
    }

    const preventAction = (event) => {
      event.preventDefault();
    };

    const preventKeyboardCopy = (event) => {
      const key =
        event.key.toLowerCase();

      if (
        (event.ctrlKey ||
          event.metaKey) &&
        ["c", "v", "x", "a"].includes(key)
      ) {
        event.preventDefault();
      }
    };

    document.addEventListener(
      "contextmenu",
      preventAction
    );

    document.addEventListener(
      "copy",
      preventAction
    );

    document.addEventListener(
      "cut",
      preventAction
    );

    document.addEventListener(
      "paste",
      preventAction
    );

    document.addEventListener(
      "keydown",
      preventKeyboardCopy
    );

    return () => {
      document.removeEventListener(
        "contextmenu",
        preventAction
      );

      document.removeEventListener(
        "copy",
        preventAction
      );

      document.removeEventListener(
        "cut",
        preventAction
      );

      document.removeEventListener(
        "paste",
        preventAction
      );

      document.removeEventListener(
        "keydown",
        preventKeyboardCopy
      );
    };
  }, [started, submitting]);

  // =====================================================
  // PREVENT BACK BUTTON
  // =====================================================

  useEffect(() => {
    if (!started || submitting) {
      return;
    }

    window.history.pushState(
      null,
      "",
      window.location.href
    );

    const handlePopState = () => {
      window.history.pushState(
        null,
        "",
        window.location.href
      );

      alert(
        "⚠️ You cannot go back during the test."
      );
    };

    window.addEventListener(
      "popstate",
      handlePopState
    );

    return () => {
      window.removeEventListener(
        "popstate",
        handlePopState
      );
    };
  }, [started, submitting]);

  // =====================================================
  // SUBMIT TEST
  // =====================================================

  const submitTest = async (
    submissionReason = "manual"
  ) => {
    if (submitInProgress.current) {
      return;
    }

    submitInProgress.current = true;
    setSubmitting(true);

    try {
      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      if (!user._id) {
        alert(
          "User not found. Please login again."
        );

        navigate("/login");
        return;
      }

      // ===============================================
      // CALCULATE RESULT
      // ===============================================

      let score = 0;
      let correct = 0;
      let wrong = 0;

      questions.forEach((question) => {
        const selectedAnswer =
          answers[question._id];

        if (
          selectedAnswer &&
          selectedAnswer ===
            question.correctAnswer
        ) {
          score +=
            Number(question.marks) || 1;

          correct++;
        } else {
          wrong++;
        }
      });

      const totalMarks =
        questions.reduce(
          (total, question) =>
            total +
            (Number(question.marks) || 1),
          0
        );

      const percentage =
        totalMarks > 0
          ? Math.round(
              (score / totalMarks) * 100
            )
          : 0;

      // ===============================================
      // PERFORMANCE LEVEL
      // ===============================================

      let performanceLevel = "Average";

      if (percentage >= 80) {
        performanceLevel = "Excellent";
      } else if (percentage >= 60) {
        performanceLevel = "Good";
      } else if (percentage < 40) {
        performanceLevel =
          "Need Improvement";
      }

      // ===============================================
      // STRONG / WEAK AREA
      // ===============================================

      const strongAreas = [];
      const weakAreas = [];

      if (percentage >= 70) {
        strongAreas.push(
          test?.subject || "Aptitude"
        );
      } else {
        weakAreas.push(
          test?.subject || "Aptitude"
        );
      }

      // ===============================================
      // SUBMISSION TIME
      // ===============================================

      const startedAt =
        startTimeRef.current
          ? new Date(
              startTimeRef.current
            ).toISOString()
          : new Date().toISOString();

      const submittedAt =
        new Date().toISOString();

      // ===============================================
      // RESULT DATA
      // ===============================================

      const resultData = {
        userId: user._id,

        testId: id,

        testName:
          test?.title || "Test",

        subject:
          test?.subject || "Aptitude",

        totalQuestions:
          questions.length,

        correctAnswers:
          correct,

        wrongAnswers:
          wrong,

        score: score,

        percentage: percentage,

        performanceLevel:
          performanceLevel,

        strongAreas:
          strongAreas,

        weakAreas:
          weakAreas,

        startedAt: startedAt,

        submittedAt: submittedAt,

        submissionReason:
          submissionReason
      };

      console.log(
        "SUBMITTING RESULT:",
        resultData
      );

      // ===============================================
      // SAVE PERFORMANCE
      // ===============================================

      const response = await API.post(
        "/performance/save",
        resultData
      );

      console.log(
        "SAVE PERFORMANCE RESPONSE:",
        response.data
      );

      // ===============================================
      // MESSAGE
      // ===============================================

      if (submissionReason === "time") {
        alert(
          "⏰ Time is over!\n\nYour test has been submitted automatically."
        );
      } else if (
        submissionReason === "tab"
      ) {
        alert(
          "🚨 You switched tabs/windows too many times.\n\nYour test has been submitted automatically."
        );
      } else {
        alert(
          "✅ Test Submitted Successfully!"
        );
      }

      navigate(
        "/student/performance"
      );
    } catch (error) {
      console.log(
        "SUBMIT TEST ERROR:",
        error.response?.data || error
      );

      // If duplicate submission happens
      if (
        error.response?.status === 400 &&
        error.response?.data?.message?.includes(
          "already attempted"
        )
      ) {
        alert(
          "You have already submitted this test."
        );

        navigate(
          "/student/performance"
        );

        return;
      }

      alert(
        error.response?.data?.message ||
          "Test submission failed."
      );

      submitInProgress.current = false;
      setSubmitting(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <>
        <Navbar />

        <div
          style={{
            padding: "40px",
            textAlign: "center"
          }}
        >
          <h2>Loading Test...</h2>
        </div>
      </>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <>
        <Navbar />

        <div
          style={{
            padding: "40px",
            textAlign: "center"
          }}
        >
          <h2>Unable to Load Test</h2>

          <p>{error}</p>

          <button
            onClick={() =>
              navigate("/student")
            }
          >
            Go Back
          </button>
        </div>
      </>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <>
      <Navbar />

      <div
        className="dashboard-container"
        style={{
          padding: "20px",
          maxWidth: "1000px",
          margin: "0 auto"
        }}
      >
        {/* ============================================
            TEST HEADER
        ============================================= */}

        <div
          className="dashboard-card"
          style={{
            position: "sticky",
            top: "0",
            zIndex: 100,
            marginBottom: "20px",
            padding: "20px",
            background: "#ffffff"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap"
            }}
          >
            <div>
              <h1>
                📝{" "}
                {test?.title ||
                  "Attempt Test"}
              </h1>

              <p>
                Subject:{" "}
                <strong>
                  {test?.subject ||
                    "Aptitude"}
                </strong>
              </p>

              <p>
                Total Questions:{" "}
                <strong>
                  {questions.length}
                </strong>
              </p>
            </div>

            {/* TIMER */}

            <div
              style={{
                padding: "15px 25px",
                borderRadius: "10px",
                background:
                  timeLeft !== null &&
                  timeLeft <= 60
                    ? "#ffdddd"
                    : "#eeeeee",
                textAlign: "center",
                minWidth: "150px"
              }}
            >
              <div>
                ⏱️ Time Remaining
              </div>

              <strong
                style={{
                  fontSize: "28px"
                }}
              >
                {formatTime(timeLeft)}
              </strong>
            </div>
          </div>

          {/* WARNINGS */}

          {tabWarnings > 0 && (
            <div
              style={{
                marginTop: "15px",
                padding: "10px",
                background: "#fff3cd",
                border:
                  "1px solid #ffecb5",
                borderRadius: "8px"
              }}
            >
              ⚠️ Tab/Window violations:{" "}
              <strong>
                {tabWarnings}/3
              </strong>

              <br />

              <small>
                4th violation will
                automatically submit
                your test.
              </small>
            </div>
          )}
        </div>

        {/* ============================================
            QUESTIONS
        ============================================= */}

        {questions.length === 0 ? (
          <div
            className="dashboard-card"
            style={{
              padding: "30px",
              textAlign: "center"
            }}
          >
            <h2>
              No Questions Available
            </h2>
          </div>
        ) : (
          questions.map(
            (question, index) => (
              <div
                className="dashboard-card"
                key={question._id}
                style={{
                  padding: "20px",
                  marginBottom: "20px"
                }}
              >
                <h3>
                  {index + 1}.{" "}
                  {question.question}
                </h3>

                {/* OPTION A */}

                <label
                  style={{
                    display: "block",
                    margin: "12px 0",
                    cursor: "pointer"
                  }}
                >
                  <input
                    type="radio"
                    name={question._id}
                    value="A"
                    checked={
                      answers[
                        question._id
                      ] === "A"
                    }
                    onChange={() =>
                      selectAnswer(
                        question._id,
                        "A"
                      )
                    }
                    disabled={submitting}
                  />

                  {"  "}
                  A){" "}
                  {question.optionA}
                </label>

                {/* OPTION B */}

                <label
                  style={{
                    display: "block",
                    margin: "12px 0",
                    cursor: "pointer"
                  }}
                >
                  <input
                    type="radio"
                    name={question._id}
                    value="B"
                    checked={
                      answers[
                        question._id
                      ] === "B"
                    }
                    onChange={() =>
                      selectAnswer(
                        question._id,
                        "B"
                      )
                    }
                    disabled={submitting}
                  />

                  {"  "}
                  B){" "}
                  {question.optionB}
                </label>

                {/* OPTION C */}

                <label
                  style={{
                    display: "block",
                    margin: "12px 0",
                    cursor: "pointer"
                  }}
                >
                  <input
                    type="radio"
                    name={question._id}
                    value="C"
                    checked={
                      answers[
                        question._id
                      ] === "C"
                    }
                    onChange={() =>
                      selectAnswer(
                        question._id,
                        "C"
                      )
                    }
                    disabled={submitting}
                  />

                  {"  "}
                  C){" "}
                  {question.optionC}
                </label>

                {/* OPTION D */}

                <label
                  style={{
                    display: "block",
                    margin: "12px 0",
                    cursor: "pointer"
                  }}
                >
                  <input
                    type="radio"
                    name={question._id}
                    value="D"
                    checked={
                      answers[
                        question._id
                      ] === "D"
                    }
                    onChange={() =>
                      selectAnswer(
                        question._id,
                        "D"
                      )
                    }
                    disabled={submitting}
                  />

                  {"  "}
                  D){" "}
                  {question.optionD}
                </label>
              </div>
            )
          )
        )}

        {/* ============================================
            SUBMIT BUTTON
        ============================================= */}

        {questions.length > 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "20px"
            }}
          >
            <button
              onClick={() =>
                submitTest("manual")
              }
              disabled={submitting}
              style={{
                padding:
                  "12px 30px",
                fontSize: "16px",
                cursor: submitting
                  ? "not-allowed"
                  : "pointer"
              }}
            >
              {submitting
                ? "Submitting..."
                : "Submit Test"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default TestAttempt;