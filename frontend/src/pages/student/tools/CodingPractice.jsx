import { useState } from "react";
import Navbar from "../../../components/layout/Navbar";
import "../../../styles/CodingPractice.css";
import codingQuestions from "../../../data/codingQuestions";

function CodingPractice() {
  const [difficulty, setDifficulty] = useState("Easy");
  const [search, setSearch] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const questions = codingQuestions.filter((q) => {
    return (
      q.difficulty === difficulty &&
      (q.title.toLowerCase().includes(search.toLowerCase()) ||
        q.topic.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <>
      <Navbar />

      <div className="coding-container">

        <div className="coding-header">
          <h1>💻 Coding Practice</h1>

          <p>
            Practice coding problems by difficulty level.
            Improve problem-solving, logic building, and programming
            skills with real interview questions.
          </p>
        </div>

        {/* Search */}

        <div className="search-box">
          <input
            type="text"
            placeholder="Search by title or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Difficulty */}

        <div className="difficulty-buttons">

          <button
            className={difficulty === "Easy" ? "active easy" : ""}
            onClick={() => {
              setDifficulty("Easy");
              setSelectedQuestion(null);
            }}
          >
            🟢 Easy
          </button>

          <button
            className={difficulty === "Medium" ? "active medium" : ""}
            onClick={() => {
              setDifficulty("Medium");
              setSelectedQuestion(null);
            }}
          >
            🟡 Medium
          </button>

          <button
            className={difficulty === "Hard" ? "active hard" : ""}
            onClick={() => {
              setDifficulty("Hard");
              setSelectedQuestion(null);
            }}
          >
            🔴 Hard
          </button>

        </div>

        {/* Question Cards */}

        <div className="question-list">

          {questions.map((q) => (

            <div
              key={q.id}
              className="question-card"
              onClick={() => setSelectedQuestion(q)}
            >

              <h3>{q.title}</h3>

              <span className="tag">
                {q.topic}
              </span>

              <p>{q.description}</p>

              <button className="solve-btn">
                View Problem
              </button>

            </div>

          ))}

        </div>

        {/* Question Details */}

        {selectedQuestion && (

          <div className="question-details">

            <h2>{selectedQuestion.title}</h2>

            <p>
              <strong>Difficulty :</strong>{" "}
              {selectedQuestion.difficulty}
            </p>

            <p>
              <strong>Topic :</strong>{" "}
              {selectedQuestion.topic}
            </p>

            <h3>Problem Statement</h3>

            <p>{selectedQuestion.problem}</p>

            <h3>Example</h3>

            <pre>{selectedQuestion.example}</pre>

            <h3>Constraints</h3>

            <ul>

              {selectedQuestion.constraints.map((item, index) => (

                <li key={index}>{item}</li>

              ))}

            </ul>

          </div>

        )}

      </div>
    </>
  );
}

export default CodingPractice;