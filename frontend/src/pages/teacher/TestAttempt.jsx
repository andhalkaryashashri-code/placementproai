import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";

function TestAttempt() {
  const { testId } = useParams();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    getQuestions();
  }, []);

  const getQuestions = async () => {
    try {
      const res = await API.get(`/questions/${testId}`);

      if (Array.isArray(res.data)) {
        setQuestions(res.data);
      } else if (res.data.questions) {
        setQuestions(res.data.questions);
      } else {
        setQuestions([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const selectAnswer = (id, answer) => {
    setAnswers({
      ...answers,
      [id]: answer,
    });
  };

  const submitTest = async () => {
    let total = 0;

    questions.forEach((q) => {
      if (answers[q._id] === q.answer) {
        total++;
      }
    });

    setScore(total);
    setSubmitted(true);

    const user = JSON.parse(localStorage.getItem("user"));

    try {
      await API.post("/performance/save", {
        userId: user._id,
        testId: testId,
        testName: "Placement Test",
        subject: "Aptitude",
        totalQuestions: questions.length,
        score: total,
        percentage: Number(
          ((total / questions.length) * 100).toFixed(2)
        ),
      });

      alert("Test Submitted Successfully");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Performance Save Failed"
      );
    }
  };

  return (
    <div className="page">
      <h1>Test</h1>

      {questions.length === 0 ? (
        <h3>No Questions Found</h3>
      ) : (
        <>
          {questions.map((q, index) => (
            <div className="question-card" key={q._id}>
              <h3>
                {index + 1}. {q.question}
              </h3>

              {q.options.map((option) => (
                <label
                  key={option}
                  style={{
                    display: "block",
                    margin: "10px 0",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name={q._id}
                    value={option}
                    disabled={submitted}
                    checked={answers[q._id] === option}
                    onChange={() =>
                      selectAnswer(q._id, option)
                    }
                  />

                  {" "}{option}
                </label>
              ))}
            </div>
          ))}

          <button
            onClick={submitTest}
            disabled={submitted}
          >
            {submitted ? "Submitted" : "Submit Test"}
          </button>

          {score !== null && (
            <h2 style={{ marginTop: "20px" }}>
              Score : {score}/{questions.length}
            </h2>
          )}
        </>
      )}
    </div>
  );
}

export default TestAttempt;