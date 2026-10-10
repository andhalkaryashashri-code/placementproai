
import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import API from "../../api/axios";
import "./Prediction.css";

function Prediction() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load students from the backend
  useEffect(() => {
    const loadStudents = async () => {
      try {
        const response = await API.get("/users/students");
        setStudents(response.data.students || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Could not load students. Check the backend."
        );
      }
    };

    loadStudents();
  }, []);

  // Get prediction from the backend
  const getPrediction = async () => {
    if (!studentId) {
      setError("Please select a student first.");
      return;
    }

    setLoading(true);
    setError("");
    setPrediction(null);

    try {
      const response = await API.get(
        `/performance/prediction/${studentId}`
      );

      setPrediction(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Prediction failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Prepare graph data from actual previous test scores
  const graphScores = (prediction?.previousScores || []).map(Number);

  const graphData = (() => {
    if (
      !prediction?.enoughData ||
      graphScores.length < 2 ||
      !graphScores.every(Number.isFinite)
    ) {
      return null;
    }

    const n = graphScores.length;
    const meanX = (n + 1) / 2;
    const meanY =
      graphScores.reduce((sum, score) => sum + score, 0) / n;

    let numerator = 0;
    let denominator = 0;

    graphScores.forEach((score, index) => {
      const x = index + 1;
      numerator += (x - meanX) * (score - meanY);
      denominator += (x - meanX) ** 2;
    });

    const slope =
      denominator === 0 ? 0 : numerator / denominator;

    const intercept = meanY - slope * meanX;

    return {
      scores: graphScores,
      lineStart: intercept + slope,
      lineEnd: intercept + slope * (n + 1),
      predicted: Number(prediction.predictedPercentage),
    };
  })();

  // Graph coordinates
  const chartX = (testNumber, totalTests) =>
    60 + ((testNumber - 1) / totalTests) * 610;

  const chartY = (score) =>
    25 + ((100 - Math.max(0, Math.min(100, score))) / 100) * 230;

  return (
    <>
      <Navbar />

      <main className="prediction-page">
        <div className="prediction-container">
          {/* Page heading */}
          <header className="prediction-heading">
            <div className="prediction-eyebrow">
              <span>✦</span> SMART PLACEMENT ANALYTICS
            </div>

            <h1>AI Student Performance Prediction</h1>

            <p>
              Understand student progress with Artificial Intelligence.
              Linear Regression analyzes previous test scores and
              estimates the student's next test percentage.
            </p>
          </header>

          {/* Student selection */}
          <section className="prediction-card">
            <div className="prediction-card-icon">🧠</div>

            <div className="prediction-card-title">
              <h2>Predict Student Performance</h2>
              <p>
                Select a student to analyze their previous scores
                and estimate their future performance.
              </p>
            </div>

            <div className="prediction-form">
              <label
                htmlFor="student"
                className="prediction-label"
              >
                Select Student
              </label>

              <select
                id="student"
                className="prediction-select"
                value={studentId}
                onChange={(event) => {
                  setStudentId(event.target.value);
                  setPrediction(null);
                  setError("");
                }}
              >
                <option value="">Choose a student</option>

                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name} ({student.email})
                  </option>
                ))}
              </select>

              <p className="prediction-help">
                Choose the student whose performance you want to predict.
              </p>

              <button
                className="prediction-submit"
                onClick={getPrediction}
                disabled={loading || !studentId}
              >
                {loading ? (
                  <>
                    <span className="prediction-spinner" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <span>✦</span>
                    Predict Performance
                    <span className="prediction-button-arrow">→</span>
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="prediction-error" role="alert">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}
          </section>

          {/* Prediction results */}
          {prediction && (
            <section className="prediction-result">
              <div className="result-heading">
                <div className="result-icon">📊</div>

                <div>
                  <h2>Prediction Result</h2>
                  <p>Student performance analysis</p>
                </div>
              </div>

              {!prediction.enoughData ? (
                <div className="prediction-notice">
                  <span>ℹ️</span>
                  <p>{prediction.message}</p>
                </div>
              ) : (
                <>
                  {/* Predicted score */}
                  <div className="prediction-score-card">
                    <span className="score-caption">
                      PREDICTED NEXT TEST SCORE
                    </span>

                    <div className="prediction-score">
                      {prediction.predictedPercentage}%
                    </div>

                    <p>
                      Estimated from the student's previous test results.
                    </p>
                  </div>

                  {/* Linear Regression graph */}
                  {graphData && (
                    <div className="regression-chart-card">
                      <div className="regression-chart-heading">
                        <div>
                          <h3>📈 Linear Regression Graph</h3>
                          <p>
                            Previous test scores and predicted next
                            test performance
                          </p>
                        </div>

                        <span className="regression-chart-tag">
                          LINEAR REGRESSION
                        </span>
                      </div>

                      <div className="regression-chart-scroll">
                        <svg
                          viewBox="0 0 720 310"
                          className="regression-chart"
                          role="img"
                          aria-label="Previous test scores, fitted linear regression line, and predicted next test score"
                        >
                          {/* Horizontal grid and percentage labels */}
                          {[0, 20, 40, 60, 80, 100].map(
                            (value) => (
                              <g key={value}>
                                <line
                                  x1="60"
                                  y1={chartY(value)}
                                  x2="670"
                                  y2={chartY(value)}
                                  stroke="#e8ded2"
                                  strokeDasharray="4 5"
                                />

                                <text
                                  x="48"
                                  y={chartY(value) + 4}
                                  textAnchor="end"
                                  fontSize="11"
                                  fill="#806e5d"
                                >
                                  {value}%
                                </text>
                              </g>
                            )
                          )}

                          {/* Axes */}
                          <line
                            x1="60"
                            y1="25"
                            x2="60"
                            y2="255"
                            stroke="#a58a73"
                          />

                          <line
                            x1="60"
                            y1="255"
                            x2="670"
                            y2="255"
                            stroke="#a58a73"
                          />

                          {/* Previous test labels and score points */}
                          {graphData.scores.map((score, index) => (
                            <g key={index}>
                              <text
                                x={chartX(
                                  index + 1,
                                  graphData.scores.length
                                )}
                                y="278"
                                textAnchor="middle"
                                fontSize="11"
                                fill="#806e5d"
                              >
                                Test {index + 1}
                              </text>

                              <circle
                                cx={chartX(
                                  index + 1,
                                  graphData.scores.length
                                )}
                                cy={chartY(score)}
                                r="6"
                                fill="#8b5e3c"
                                stroke="#ffffff"
                                strokeWidth="2"
                              >
                                <title>
                                  {`Test ${index + 1}: ${score}%`}
                                </title>
                              </circle>
                            </g>
                          ))}

                          {/* Fitted regression trend line */}
                          <line
                            x1={chartX(
                              1,
                              graphData.scores.length
                            )}
                            y1={chartY(graphData.lineStart)}
                            x2={chartX(
                              graphData.scores.length + 1,
                              graphData.scores.length
                            )}
                            y2={chartY(graphData.lineEnd)}
                            stroke="#b89575"
                            strokeWidth="3"
                            strokeDasharray="7 5"
                            strokeLinecap="round"
                          />

                          {/* Predicted next test point */}
                          <circle
                            cx={chartX(
                              graphData.scores.length + 1,
                              graphData.scores.length
                            )}
                            cy={chartY(graphData.predicted)}
                            r="8"
                            fill="#5c4033"
                            stroke="#ead8c4"
                            strokeWidth="3"
                          >
                            <title>
                              {`Predicted next test: ${graphData.predicted}%`}
                            </title>
                          </circle>

                          <text
                            x={chartX(
                              graphData.scores.length + 1,
                              graphData.scores.length
                            )}
                            y={Math.max(
                              16,
                              chartY(graphData.predicted) - 14
                            )}
                            textAnchor="middle"
                            fontSize="12"
                            fontWeight="700"
                            fill="#5c4033"
                          >
                            {graphData.predicted}%
                          </text>

                          <text
                            x={chartX(
                              graphData.scores.length + 1,
                              graphData.scores.length
                            )}
                            y="278"
                            textAnchor="middle"
                            fontSize="11"
                            fontWeight="700"
                            fill="#5c4033"
                          >
                            Next test
                          </text>

                          <text
                            x="365"
                            y="303"
                            textAnchor="middle"
                            fontSize="12"
                            fill="#806e5d"
                          >
                            Test sequence
                          </text>
                        </svg>
                      </div>

                      {/* Graph legend */}
                      <div className="regression-legend">
                        <span>
                          <i className="legend-dot" />
                          Previous scores
                        </span>

                        <span>
                          <i className="legend-line" />
                          Regression trend line
                        </span>

                        <span>
                          <i className="legend-predicted" />
                          Predicted score
                        </span>
                      </div>

                      <p className="regression-chart-note">
                        The dotted line is fitted to the historical
                        scores. The predicted point is supplied by the
                        backend model.
                      </p>
                    </div>
                  )}

                  {/* Performance statistics */}
                  <div className="prediction-stats">
                    <div className="prediction-stat">
                      <span className="stat-icon">🧮</span>
                      <div>
                        <span className="stat-label">Algorithm</span>
                        <strong>{prediction.algorithm}</strong>
                      </div>
                    </div>

                    <div className="prediction-stat">
                      <span className="stat-icon">📝</span>
                      <div>
                        <span className="stat-label">Previous Tests</span>
                        <strong>{prediction.totalTests}</strong>
                      </div>
                    </div>

                    <div className="prediction-stat">
                      <span className="stat-icon">📈</span>
                      <div>
                        <span className="stat-label">
                          Performance Trend
                        </span>
                        <strong>{prediction.trend}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Previous test score bars */}
                  <div className="previous-scores">
                    <h3>Previous Test Scores</h3>

                    <div className="score-list">
                      {graphScores.map((score, index) => (
                        <div className="score-row" key={index}>
                          <span className="score-test-name">
                            Test {index + 1}
                          </span>

                          <div className="score-track">
                            <div
                              className="score-fill"
                              style={{
                                width: `${Math.max(
                                  0,
                                  Math.min(100, score)
                                )}%`,
                              }}
                            />
                          </div>

                          <strong className="score-value">
                            {score}%
                          </strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="prediction-disclaimer">
                    <span>💡</span>
                    <p>
                      This prediction is an estimate based on past scores.
                      Actual performance may be different.
                    </p>
                  </div>
                </>
              )}
            </section>
          )}

          <footer className="prediction-footer">
            <span>✦</span> PlacementPro AI · Smart Placement Analytics
          </footer>
        </div>
      </main>
    </>
  );
}

export default Prediction;
