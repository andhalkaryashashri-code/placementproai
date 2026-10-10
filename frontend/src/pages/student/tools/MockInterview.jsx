import { useEffect, useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import Navbar from "../../../components/layout/Navbar";
import "../../../styles/MockInterview.css";
import subjects from "../../../data/subjects.js";

// =====================================================
// SUBJECT MAP
// =====================================================

const SUBJECT_MAP = {
  Java: "Java",
  Python: "Python",
  DBMS: "DBMS",
  "Operating System": "OperatingSystem",
  "Computer Network": "ComputerNetwork",
  "Computer Networks": "ComputerNetwork",
  DSA: "DSA",
  SQL: "SQL",
  "C Programming": "CProgramming",
  C: "CProgramming",
  "C++": "Cpp",
  "Web Development": "WebDevelopment",
  "Software Engineering": "SoftwareEngineering",
  "Cloud Computing": "CloudComputing",
  "Cyber Security": "CyberSecurity",
  "OOP Concepts": "OOPConcepts",
  Aptitude: "Aptitude",
};

// =====================================================
// SUBJECTS
// =====================================================

const SUBJECTS = [
  "Java",
  "Python",
  "DBMS",
  "Operating System",
  "Computer Network",
  "DSA",
  "SQL",
  "C Programming",
  "C++",
  "Web Development",
  "Software Engineering",
  "Cloud Computing",
  "Cyber Security",
  "OOP Concepts",
  "Aptitude",
  "Other",
];

const TOTAL_QUESTIONS = 8;
const ANSWER_TIME_LIMIT = 90;

// =====================================================
// END PHRASES
// =====================================================

const END_PHRASES = [
  "that is my answer",
  "thats my answer",
  "that's my answer",
  "done",
  "finished",
  "i am done",
  "im done",
  "thank you",
];

// =====================================================
// SANITIZE
// =====================================================

function sanitizeSpokenText(text) {
  if (!text) return "";

  return text
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// =====================================================
// END PHRASE
// =====================================================

function detectEndPhrase(rawText) {
  const normalized = sanitizeSpokenText(rawText).toLowerCase();

  if (!normalized) {
    return {
      matched: false,
      cleaned: rawText,
    };
  }

  for (const phrase of END_PHRASES) {
    if (
      normalized === phrase ||
      normalized.endsWith(" " + phrase)
    ) {
      const cutIndex = normalized.length - phrase.length;

      const cleaned = rawText
        .trim()
        .slice(0, cutIndex)
        .trim();

      return {
        matched: true,
        cleaned,
      };
    }
  }

  return {
    matched: false,
    cleaned: rawText,
  };
}

// =====================================================
// NUMBER HELPER
// =====================================================

function safeNumber(value, min = 0, max = 100) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return min;
  }

  return Math.min(max, Math.max(min, number));
}

// =====================================================
// FALLBACK SCORE
// =====================================================

function calculateFallbackQuestionScore(answer) {
  if (!answer || !answer.trim()) {
    return 0;
  }

  const words = answer.trim().split(/\s+/).length;

  if (words >= 35) return 7;
  if (words >= 20) return 6;
  if (words >= 10) return 5;
  if (words >= 5) return 3;

  return 2;
}

// =====================================================
// AI INTERVIEW SCORING
// =====================================================

async function scoreInterviewWithAI(subjectName, qaLog) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing VITE_GROQ_API_KEY in .env file."
    );
  }

  if (!qaLog || qaLog.length === 0) {
    throw new Error("No interview answers available.");
  }

  const transcript = qaLog
    .map(
      (qa, i) =>
        `Q${i + 1}: ${qa.question}\nA${i + 1}: ${
          qa.answer || "(No answer)"
        }`
    )
    .join("\n\n");

  // ===================================================
  // STRONGER PROMPT
  // ===================================================

  const systemPrompt = `
You are an expert technical interview evaluator.

Subject: ${subjectName}

Evaluate the candidate's REAL answers.
Do not automatically give zero.
Give partial credit when the answer contains
some technically correct information.

For every question:
- 0 = no answer / completely irrelevant
- 1-3 = mostly incorrect
- 4-5 = partially correct
- 6-7 = mostly correct
- 8-9 = very good
- 10 = excellent and complete

The candidate may use simple English.
Do not penalize minor grammar mistakes heavily.

Return ONLY valid JSON.
No markdown.
No code fences.
No explanation outside JSON.

Use EXACTLY this structure:

{
  "overall": 0,
  "communication": 0,
  "technical": 0,
  "confidence": 0,
  "problemSolving": 0,
  "grammarFluency": 0,

  "questionScores": [
    {
      "questionNumber": 1,
      "question": "",
      "answer": "",
      "score": 0,
      "feedback": ""
    }
  ],

  "strengths": [],
  "weaknesses": [],
  "mistakes": [],

  "sampleAnswers": [
    {
      "question": "",
      "betterAnswer": ""
    }
  ],

  "improvementSuggestions": [],
  "topicsToStudy": [],

  "finalFeedback": ""
}

IMPORTANT:
- Score EVERY question separately.
- Never make every score zero unless answers are empty.
- Use the actual technical content of each answer.
- Give partial credit for partially correct answers.
- questionScores MUST contain exactly ${qaLog.length} items.
- Each question score must be 0 to 10.
- Overall must be 0 to 100.
- Communication, technical, confidence, problemSolving and grammarFluency must be 0 to 100.
`;

  // ===================================================
  // GROQ CALL
  // ===================================================

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },

      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",

        temperature: 0.1,

        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: transcript,
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Groq API Error ${response.status}: ${errorText}`
    );
  }

  const data = await response.json();

  const rawText =
    data?.choices?.[0]?.message?.content || "";

  if (!rawText.trim()) {
    throw new Error("Groq returned an empty response.");
  }

  console.log("RAW GROQ RESPONSE:", rawText);

  // ===================================================
  // CLEAN JSON
  // ===================================================

  let cleaned = rawText.trim();

  cleaned = cleaned
    .replace(/^```json/i, "")
    .replace(/^```/i, "")
    .replace(/```$/i, "")
    .trim();

  // Sometimes AI adds text before/after JSON
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.slice(
      firstBrace,
      lastBrace + 1
    );
  }

  let parsed;

  try {
    parsed = JSON.parse(cleaned);
  } catch (error) {
    console.error(
      "AI JSON PARSE ERROR:",
      cleaned
    );

    throw new Error(
      "AI returned invalid JSON."
    );
  }

  // ===================================================
  // QUESTION SCORE NORMALIZATION
  // ===================================================

  const aiScores = Array.isArray(
    parsed.questionScores
  )
    ? parsed.questionScores
    : [];

  const normalizedScores = qaLog.map(
    (qa, index) => {
      const aiItem =
        aiScores.find(
          (item) =>
            Number(item.questionNumber) ===
            index + 1
        ) || aiScores[index];

      let score = Number(
        aiItem?.score
      );

      // If AI score invalid, calculate fallback
      if (
        Number.isNaN(score) ||
        score < 0 ||
        score > 10
      ) {
        score =
          calculateFallbackQuestionScore(
            qa.answer
          );
      }

      score = Math.round(
        Math.min(10, Math.max(0, score))
      );

      return {
        questionNumber: index + 1,

        question:
          aiItem?.question ||
          qa.question,

        answer:
          qa.answer ||
          "(No answer captured)",

        score,

        feedback:
          aiItem?.feedback ||
          (
            score >= 8
              ? "Excellent answer."
              : score >= 6
              ? "Good answer with minor gaps."
              : score >= 4
              ? "Partially correct. Add more technical detail."
              : score > 0
              ? "Answer needs more technical explanation."
              : "No answer provided."
          ),
      };
    }
  );

  // ===================================================
  // CALCULATE ACTUAL OVERALL
  // ===================================================

  const totalScore =
    normalizedScores.reduce(
      (sum, item) =>
        sum + item.score,
      0
    );

  const overall =
    normalizedScores.length > 0
      ? Math.round(
          (totalScore /
            (normalizedScores.length * 10)) *
            100
        )
      : 0;

  // ===================================================
  // CATEGORY FALLBACKS
  // ===================================================

  const technicalFromAI =
    safeNumber(
      parsed.technical,
      0,
      100
    );

  const communicationFromAI =
    safeNumber(
      parsed.communication,
      0,
      100
    );

  const confidenceFromAI =
    safeNumber(
      parsed.confidence,
      0,
      100
    );

  const problemSolvingFromAI =
    safeNumber(
      parsed.problemSolving,
      0,
      100
    );

  const grammarFromAI =
    safeNumber(
      parsed.grammarFluency,
      0,
      100
    );

  return {
    overall,

    communication:
      communicationFromAI ||
      overall,

    technical:
      technicalFromAI ||
      overall,

    confidence:
      confidenceFromAI ||
      overall,

    problemSolving:
      problemSolvingFromAI ||
      overall,

    grammarFluency:
      grammarFromAI ||
      overall,

    questionScores:
      normalizedScores,

    strengths:
      Array.isArray(parsed.strengths)
        ? parsed.strengths
        : [],

    weaknesses:
      Array.isArray(parsed.weaknesses)
        ? parsed.weaknesses
        : [],

    mistakes:
      Array.isArray(parsed.mistakes)
        ? parsed.mistakes
        : [],

    sampleAnswers:
      Array.isArray(parsed.sampleAnswers)
        ? parsed.sampleAnswers
        : [],

    improvementSuggestions:
      Array.isArray(
        parsed.improvementSuggestions
      )
        ? parsed.improvementSuggestions
        : [],

    topicsToStudy:
      Array.isArray(
        parsed.topicsToStudy
      )
        ? parsed.topicsToStudy
        : [],

    finalFeedback:
      parsed.finalFeedback ||
      "Keep practicing technical questions and improve the depth of your answers.",
  };
}

// =====================================================
// COMPONENT
// =====================================================

function MockInterview() {
  const webcamRef = useRef(null);
  const recognitionRef = useRef(null);

  const manualStopRef = useRef(false);
  const stageRef = useRef("setup");

  const questionIndexRef =
    useRef(0);

  const qaLogRef = useRef([]);

  const finalTranscriptRef =
    useRef("");

  const askedQuestionsRef =
    useRef([]);

  const countdownRef =
    useRef(null);

  const submittingRef =
    useRef(false);

  const effectiveSubjectRef =
    useRef("");

  const [stage, setStage] =
    useState("setup");

  const [subject, setSubject] =
    useState("");

  const [customSubject, setCustomSubject] =
    useState("");

  const [cameraOn, setCameraOn] =
    useState(false);

  const [error, setError] =
    useState("");

  const [questionIndex, setQuestionIndex] =
    useState(0);

  const [question, setQuestion] =
    useState("");

  const [answer, setAnswer] =
    useState("");

  const [interim, setInterim] =
    useState("");

  const [confirmAnswer, setConfirmAnswer] =
    useState("");

  const [timeLeft, setTimeLeft] =
    useState(ANSWER_TIME_LIMIT);

  const [micSupported, setMicSupported] =
    useState(true);

  const [micStatus, setMicStatus] =
    useState("idle");

  const [aiSpeaking, setAiSpeaking] =
    useState(false);

  const [report, setReport] =
    useState(null);

  const [qaLog, setQaLog] =
    useState([]);

  const effectiveSubject =
    subject === "Other"
      ? customSubject.trim()
      : subject;

  // ===================================================
  // STAGE
  // ===================================================

  const setStageBoth = (value) => {
    stageRef.current = value;
    setStage(value);
  };

  // ===================================================
  // CLEANUP
  // ===================================================

  useEffect(() => {
    setMicSupported(
      !!(
        window.SpeechRecognition ||
        window.webkitSpeechRecognition
      )
    );

    return () => {
      window.speechSynthesis.cancel();

      manualStopRef.current = true;

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }

      clearInterval(
        countdownRef.current
      );
    };
  }, []);

  // ===================================================
  // SPEAK
  // ===================================================

  const speak = (text) =>
    new Promise((resolve) => {
      window.speechSynthesis.cancel();

      const clean =
        sanitizeSpokenText(text);

      const utter =
        new SpeechSynthesisUtterance(
          clean
        );

      utter.lang = "en-IN";
      utter.rate = 0.95;

      setAiSpeaking(true);

      utter.onend = () => {
        setAiSpeaking(false);
        resolve();
      };

      utter.onerror = () => {
        setAiSpeaking(false);
        resolve();
      };

      window.speechSynthesis.speak(
        utter
      );
    });

  // ===================================================
  // CAMERA
  // ===================================================

  const startCamera = async () => {
    try {
      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            video: true,
            audio: true,
          }
        );

      stream
        .getTracks()
        .forEach((track) =>
          track.stop()
        );

      setCameraOn(true);
      setError("");
    } catch {
      setCameraOn(false);

      setError(
        "Camera and microphone access denied. Please allow both permissions."
      );
    }
  };

  const stopCamera = () => {
    setCameraOn(false);
  };

  // ===================================================
  // COUNTDOWN
  // ===================================================

  const startCountdown = () => {
    clearInterval(
      countdownRef.current
    );

    setTimeLeft(
      ANSWER_TIME_LIMIT
    );

    countdownRef.current =
      setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(
              countdownRef.current
            );

            goToConfirm();

            return 0;
          }

          return prev - 1;
        });
      }, 1000);
  };

  // ===================================================
  // LISTENING
  // ===================================================

  const beginListening = (
    resume = false
  ) => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!resume) {
      finalTranscriptRef.current = "";
      setAnswer("");
    }

    submittingRef.current = false;
    setInterim("");

    if (!SpeechRecognition) {
      setStageBoth("listening");
      setMicStatus("idle");
      startCountdown();
      return;
    }

    manualStopRef.current = false;

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognitionRef.current =
      recognition;

    recognition.onresult = (
      event
    ) => {
      let interimText = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const transcript =
          event.results[i][0]
            .transcript;

        if (
          event.results[i].isFinal
        ) {
          finalTranscriptRef.current +=
            transcript + " ";
        } else {
          interimText += transcript;
        }
      }

      const currentAnswer =
        finalTranscriptRef.current.trim();

      setAnswer(currentAnswer);
      setInterim(interimText);

      const result =
        detectEndPhrase(
          finalTranscriptRef.current
        );

      if (
        result.matched &&
        !submittingRef.current
      ) {
        submittingRef.current = true;

        finalTranscriptRef.current =
          result.cleaned;

        setAnswer(
          result.cleaned
        );

        setInterim("");

        goToConfirm(
          result.cleaned
        );
      }
    };

    recognition.onerror = (
      event
    ) => {
      console.log(
        "Speech recognition error:",
        event.error
      );
    };

    recognition.onend = () => {
      if (
        !manualStopRef.current &&
        stageRef.current ===
          "listening"
      ) {
        try {
          recognition.start();
        } catch {}
      }
    };

    try {
      recognition.start();
    } catch {}

    setStageBoth("listening");
    setMicStatus("listening");

    startCountdown();
  };

  // ===================================================
  // STOP LISTENING
  // ===================================================

  const stopListening = () => {
    manualStopRef.current = true;

    setMicStatus("idle");

    clearInterval(
      countdownRef.current
    );

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
  };

  // ===================================================
  // CONFIRM
  // ===================================================

  const goToConfirm = (
    textOverride
  ) => {
    stopListening();

    const text = (
      textOverride ??
      finalTranscriptRef.current ??
      answer ??
      ""
    ).trim();

    setConfirmAnswer(text);

    setStageBoth("confirming");
  };

  const resumeAnswering = () => {
    finalTranscriptRef.current =
      confirmAnswer
        ? confirmAnswer + " "
        : "";

    setAnswer(confirmAnswer);

    beginListening(true);
  };

  // ===================================================
  // LOAD QUESTION
  // ===================================================

  const loadQuestion = async (
    index
  ) => {
    setStageBoth(
      "loading-question"
    );

    setError("");

    try {
      const key =
        SUBJECT_MAP[
          effectiveSubjectRef.current
        ] ||
        effectiveSubjectRef.current;

      const subjectData =
        subjects[key];

      if (!subjectData) {
        setError(
          "Subject not found."
        );

        setStageBoth("setup");
        return;
      }

      const allQuestions =
        subjectData.questions || [];

      const remainingQuestions =
        allQuestions.filter(
          (q) =>
            !askedQuestionsRef.current.includes(
              q
            )
        );

      if (
        remainingQuestions.length === 0
      ) {
        finishInterview();
        return;
      }

      const randomQuestion =
        remainingQuestions[
          Math.floor(
            Math.random() *
              remainingQuestions.length
          )
        ];

      askedQuestionsRef.current.push(
        randomQuestion
      );

      const cleanQuestion =
        sanitizeSpokenText(
          randomQuestion
        );

      setQuestion(
        cleanQuestion
      );

      setQuestionIndex(index);

      questionIndexRef.current =
        index;

      setStageBoth(
        "ai-speaking"
      );

      await speak(
        cleanQuestion
      );

      if (
        stageRef.current ===
        "ai-speaking"
      ) {
        beginListening(false);
      }
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load interview question."
      );

      setStageBoth("setup");
    }
  };

  // ===================================================
  // FINALIZE ANSWER
  // ===================================================

  const finalizeAnswer =
    useCallback(
      (finalAnswerText) => {
        const finalAnswer =
          (
            finalAnswerText || ""
          ).trim();

        const newQA = {
          question,
          answer:
            finalAnswer ||
            "(No answer captured)",
        };

        qaLogRef.current = [
          ...qaLogRef.current,
          newQA,
        ];

        setQaLog(
          qaLogRef.current
        );

        const nextIndex =
          questionIndexRef.current +
          1;

        if (
          nextIndex <
          TOTAL_QUESTIONS
        ) {
          loadQuestion(
            nextIndex
          );
        } else {
          finishInterview();
        }
      },
      [question]
    );

  // ===================================================
  // CONFIRM YES
  // ===================================================

  const confirmYes = () => {
    finalizeAnswer(
      confirmAnswer
    );
  };

  // ===================================================
  // CONFIRM NO
  // ===================================================

  const confirmNo = () => {
    resumeAnswering();
  };

  // ===================================================
  // MANUAL SUBMIT
  // ===================================================

  const requestSubmit = () => {
    goToConfirm();
  };

  // ===================================================
  // START INTERVIEW
  // ===================================================

  const startInterview =
    async () => {
      if (!effectiveSubject) {
        setError(
          "Please select an interview subject."
        );
        return;
      }

      if (!cameraOn) {
        setError(
          "Turn on camera and microphone first."
        );
        return;
      }

      effectiveSubjectRef.current =
        effectiveSubject;

      setError("");
      setReport(null);

      qaLogRef.current = [];
      setQaLog([]);

      askedQuestionsRef.current =
        [];

      questionIndexRef.current =
        0;

      setStageBoth("intro");

      await speak(
        `Hello, welcome to your AI mock interview for ${effectiveSubject}. I will ask you ${TOTAL_QUESTIONS} questions. Please answer each question clearly. Say done when you finish your answer.`
      );

      if (
        stageRef.current ===
        "intro"
      ) {
        loadQuestion(0);
      }
    };

  // ===================================================
  // FINISH INTERVIEW
  // ===================================================

  const finishInterview =
    async () => {
      setStageBoth("submitting");

      setMicStatus("idle");

      clearInterval(
        countdownRef.current
      );

      try {
        console.log(
          "FINAL QA LOG:",
          qaLogRef.current
        );

        // =========================================
        // AI SCORING
        // =========================================

        const result =
          await scoreInterviewWithAI(
            effectiveSubjectRef.current,
            qaLogRef.current
          );

        console.log(
          "FINAL AI RESULT:",
          result
        );

        setReport(result);

        setError("");
      } catch (err) {
        console.error(
          "INTERVIEW SCORING ERROR:",
          err
        );

        // =========================================
        // FALLBACK REPORT
        // =========================================

        const fallbackScores =
          qaLogRef.current.map(
            (qa, index) => ({
              questionNumber:
                index + 1,

              question:
                qa.question,

              answer:
                qa.answer,

              score:
                calculateFallbackQuestionScore(
                  qa.answer
                ),

              feedback:
                qa.answer &&
                qa.answer.trim()
                  ? "Answer captured. AI scoring was unavailable, so a basic answer score was calculated."
                  : "No answer provided.",
            })
          );

        const total =
          fallbackScores.reduce(
            (sum, item) =>
              sum + item.score,
            0
          );

        const fallbackOverall =
          fallbackScores.length
            ? Math.round(
                (total /
                  (fallbackScores.length *
                    10)) *
                  100
              )
            : 0;

        setReport({
          overall:
            fallbackOverall,

          communication:
            fallbackOverall,

          technical:
            fallbackOverall,

          confidence:
            fallbackOverall,

          problemSolving:
            fallbackOverall,

          grammarFluency:
            fallbackOverall,

          questionScores:
            fallbackScores,

          strengths: [],

          weaknesses: [],

          mistakes: [],

          sampleAnswers: [],

          improvementSuggestions: [
            "Practice answering technical questions with definitions and examples.",
            "Give complete answers instead of very short responses.",
          ],

          topicsToStudy: [
            effectiveSubjectRef.current,
          ],

          finalFeedback:
            "Your answers were captured successfully, but AI evaluation was temporarily unavailable. The displayed score is a basic fallback score.",
        });

        setError(
          "AI scoring was unavailable. A fallback score is shown."
        );
      } finally {
        setStageBoth("finished");

        speak(
          "Your interview is complete. Here is your performance report."
        );
      }
    };

  // ===================================================
  // RESTART
  // ===================================================

  const restart = () => {
    window.speechSynthesis.cancel();

    setReport(null);
    setQaLog([]);

    qaLogRef.current = [];

    askedQuestionsRef.current =
      [];

    setQuestion("");
    setAnswer("");
    setInterim("");
    setConfirmAnswer("");

    setSubject("");
    setCustomSubject("");

    setMicStatus("idle");
    setError("");

    setTimeLeft(
      ANSWER_TIME_LIMIT
    );

    setStageBoth("setup");
  };

  // ===================================================
  // INTERVIEW STATES
  // ===================================================

  const inInterview = [
    "intro",
    "loading-question",
    "ai-speaking",
    "listening",
    "confirming",
    "submitting",
  ].includes(stage);

  // ===================================================
  // SCORE ROWS
  // ===================================================

  const scoreRows = report
    ? [
        [
          "Overall Score",
          report.overall,
        ],
        [
          "Communication",
          report.communication,
        ],
        [
          "Technical Knowledge",
          report.technical,
        ],
        [
          "Confidence",
          report.confidence,
        ],
        [
          "Problem Solving",
          report.problemSolving,
        ],
        [
          "Grammar & Fluency",
          report.grammarFluency,
        ],
      ]
    : [];

  // ===================================================
  // UI
  // ===================================================

  return (
    <>
      <Navbar />

      <div className="mock-container">
        <h1>
          🎤 AI Mock Interview
        </h1>

        <p>
          Real-time, voice-based AI
          interview practice
        </p>

        {/* =========================================
            SETUP
        ========================================= */}

        {stage === "setup" && (
          <>
            <div className="role-card">
              <h2>
                Select Interview Subject
              </h2>

              <select
                value={subject}
                onChange={(e) =>
                  setSubject(
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select Subject
                </option>

                {SUBJECTS.map((s) => (
                  <option
                    key={s}
                    value={s}
                  >
                    {s}
                  </option>
                ))}
              </select>

              {subject === "Other" && (
                <input
                  className="custom-subject-input"
                  type="text"
                  placeholder="Enter subject"
                  value={
                    customSubject
                  }
                  onChange={(e) =>
                    setCustomSubject(
                      e.target.value
                    )
                  }
                />
              )}
            </div>

            <div className="camera-card">
              <h2>
                📷 Camera & Microphone
                Check
              </h2>

              {cameraOn ? (
                <Webcam
                  ref={webcamRef}
                  audio={true}
                  className="webcam"
                  videoConstraints={{
                    width: 400,
                    height: 300,
                    facingMode:
                      "user",
                  }}
                />
              ) : (
                <div className="camera-off">
                  Camera OFF
                </div>
              )}

              {!micSupported && (
                <p className="warning">
                  Speech recognition
                  is not supported in
                  this browser.
                </p>
              )}

              <button
                onClick={
                  cameraOn
                    ? stopCamera
                    : startCamera
                }
              >
                {cameraOn
                  ? "❌ Stop Camera"
                  : "📷 Start Camera"}
              </button>
            </div>

            {error && (
              <p className="error">
                {error}
              </p>
            )}

            <button
              className="start-btn"
              onClick={
                startInterview
              }
            >
              🚀 Start Interview
            </button>
          </>
        )}

        {/* =========================================
            LIVE INTERVIEW
        ========================================= */}

        {inInterview && (
          <div className="interview-live">
            <div className="progress-track">
              {Array.from({
                length:
                  TOTAL_QUESTIONS,
              }).map(
                (_, i) => (
                  <span
                    key={i}
                    className={
                      "progress-dot" +
                      (i <
                      questionIndex
                        ? " done"
                        : "") +
                      (i ===
                      questionIndex
                        ? " active"
                        : "")
                    }
                  />
                )
              )}
            </div>

            <div className="status-bar">
              <span
                className={
                  "status-badge mic-" +
                  micStatus
                }
              >
                🎙 Microphone:{" "}
                {micStatus ===
                "listening"
                  ? "Listening"
                  : "Idle"}
              </span>

              <span
                className={
                  "status-badge" +
                  (aiSpeaking
                    ? " ai-speaking-badge"
                    : "")
                }
              >
                🤖 AI:{" "}
                {aiSpeaking
                  ? "Speaking"
                  : "Idle"}
              </span>
            </div>

            <div className="question-card">
              <h2>
                🤖 AI Interviewer
              </h2>

              <h3>
                Question{" "}
                {questionIndex + 1}
                {" / "}
                {TOTAL_QUESTIONS}
              </h3>

              {stage === "intro" && (
                <p className="status-line">
                  Introducing the
                  interview…
                </p>
              )}

              {stage ===
                "loading-question" && (
                <p className="status-line">
                  Preparing your next
                  question…
                </p>
              )}

              {stage ===
                "ai-speaking" && (
                <p className="status-line speaking">
                  🔊 Speaking the
                  question…
                </p>
              )}

              <p className="question-text">
                {question}
              </p>
            </div>

            {/* ANSWER */}

            {stage === "listening" && (
              <div className="answer-card">
                <div className="answer-header">
                  <h2>
                    🎙 Your Answer
                  </h2>

                  <span
                    className={
                      "timer" +
                      (timeLeft <= 10
                        ? " low"
                        : "")
                    }
                  >
                    ⏱ {timeLeft}s
                  </span>
                </div>

                <p className="listening-indicator">
                  🔴 Listening… say
                  "done" when finished
                </p>

                <textarea
                  value={
                    answer +
                    (interim
                      ? " " +
                        interim
                      : "")
                  }
                  onChange={(e) => {
                    finalTranscriptRef.current =
                      e.target.value;

                    setAnswer(
                      e.target.value
                    );

                    setInterim("");
                  }}
                  placeholder="Speak or type your answer here"
                />

                <button
                  className="submit-btn"
                  onClick={
                    requestSubmit
                  }
                >
                  ✅ I'm Done — Review
                  Answer
                </button>
              </div>
            )}

            {/* CONFIRM */}

            {stage ===
              "confirming" && (
              <div className="answer-card confirm-card">
                <h2>
                  📝 Confirm Your Answer
                </h2>

                <p className="listening-indicator">
                  Review your answer
                  before submitting.
                </p>

                <textarea
                  value={
                    confirmAnswer
                  }
                  onChange={(e) =>
                    setConfirmAnswer(
                      e.target.value
                    )
                  }
                  placeholder="Your answer"
                />

                <div className="confirm-actions">
                  <button
                    className="submit-btn"
                    onClick={
                      confirmYes
                    }
                  >
                    ✅ Yes, Submit
                  </button>

                  <button
                    className="resume-btn"
                    onClick={
                      confirmNo
                    }
                  >
                    🎙 Keep Answering
                  </button>
                </div>
              </div>
            )}

            {stage ===
              "submitting" && (
              <p className="status-line">
                🤖 Scoring your
                interview…
              </p>
            )}

            {error && (
              <p className="error">
                {error}
              </p>
            )}
          </div>
        )}

        {/* =========================================
            FINAL REPORT
        ========================================= */}

        {stage === "finished" &&
          report && (
            <div className="score-card">
              <h2>
                📊 Interview Result
              </h2>

              <div className="final-score-highlight">
                <span>
                  🏆 Final Interview
                  Score
                </span>

                <strong>
                  {report.overall ?? 0}%
                </strong>

                <small>
                  Based on your answers
                  to {qaLog.length}{" "}
                  questions
                </small>
              </div>

              {/* CATEGORY SCORES */}

              <div className="score-grid">
                {scoreRows.map(
                  ([label, value]) => (
                    <div
                      className="score-item"
                      key={label}
                    >
                      <span className="score-label">
                        {label}
                      </span>

                      <span className="score-value">
                        {value ?? 0}%
                      </span>
                    </div>
                  )
                )}
              </div>

              {/* QUESTION PERFORMANCE */}

              {qaLog.length > 0 && (
                <div className="transcript">
                  <h3>
                    📋 Question-by-Question
                    Performance
                  </h3>

                  <div className="question-review-table">
                    <div className="question-review-header">
                      <div>
                        Question
                      </div>

                      <div>
                        Your Answer
                      </div>

                      <div>
                        Score
                      </div>

                      <div>
                        AI Feedback
                      </div>
                    </div>

                    {qaLog.map(
                      (qa, i) => {
                        const result =
                          report.questionScores?.find(
                            (item) =>
                              Number(
                                item.questionNumber
                              ) ===
                              i + 1
                          );

                        const score =
                          Number(
                            result?.score
                          ) || 0;

                        return (
                          <div
                            className="question-review-row"
                            key={i}
                          >
                            <div className="review-question">
                              <strong>
                                Q{i + 1}
                              </strong>

                              <p>
                                {
                                  qa.question
                                }
                              </p>
                            </div>

                            <div className="review-answer">
                              {qa.answer ||
                                "(No answer captured)"}
                            </div>

                            <div className="review-score">
                              <span className="question-score">
                                {score}/10
                              </span>

                              <small>
                                {score >=
                                8
                                  ? "Excellent"
                                  : score >=
                                    6
                                  ? "Good"
                                  : score >=
                                    4
                                  ? "Needs Improvement"
                                  : score > 0
                                  ? "Poor"
                                  : "No Answer"}
                              </small>
                            </div>

                            <div className="review-feedback">
                              {result?.feedback ||
                                "No feedback available."}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>

                  {/* SCORE SUMMARY */}

                  <div className="question-score-summary">
                    <h3>
                      📈 Answer Score
                      Summary
                    </h3>

                    <div className="question-score-list">
                      {report.questionScores?.map(
                        (
                          item,
                          index
                        ) => (
                          <div
                            className="question-score-mini"
                            key={index}
                          >
                            <span>
                              Q
                              {
                                item.questionNumber
                              }
                            </span>

                            <strong>
                              {
                                item.score
                              }
                              /10
                            </strong>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STRENGTHS */}

              {report.strengths?.length >
                0 && (
                <div className="feedback-section">
                  <h3>
                    ✅ Strengths
                  </h3>

                  <ul>
                    {report.strengths.map(
                      (item, i) => (
                        <li key={i}>
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {/* WEAKNESSES */}

              {report.weaknesses?.length >
                0 && (
                <div className="feedback-section">
                  <h3>
                    ⚠️ Weaknesses
                  </h3>

                  <ul>
                    {report.weaknesses.map(
                      (item, i) => (
                        <li key={i}>
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {/* MISTAKES */}

              {report.mistakes?.length >
                0 && (
                <div className="feedback-section">
                  <h3>
                    ❌ Mistakes Made
                  </h3>

                  <ul>
                    {report.mistakes.map(
                      (item, i) => (
                        <li key={i}>
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {/* SAMPLE ANSWERS */}

              {report.sampleAnswers
                ?.length > 0 && (
                <div className="feedback-section">
                  <h3>
                    💡 Better Sample
                    Answers
                  </h3>

                  {report.sampleAnswers.map(
                    (item, i) => (
                      <div
                        className="sample-answer-box"
                        key={i}
                      >
                        <p className="transcript-q">
                          Q.{" "}
                          {item.question}
                        </p>

                        <p className="transcript-a">
                          {
                            item.betterAnswer
                          }
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}

              {/* IMPROVEMENT */}

              {report
                .improvementSuggestions
                ?.length > 0 && (
                <div className="feedback-section">
                  <h3>
                    📈 Personalized
                    Improvement
                    Suggestions
                  </h3>

                  <ul>
                    {report.improvementSuggestions.map(
                      (
                        item,
                        i
                      ) => (
                        <li key={i}>
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {/* TOPICS */}

              {report.topicsToStudy
                ?.length > 0 && (
                <div className="feedback-section">
                  <h3>
                    📚 Topics to Study
                  </h3>

                  <ul>
                    {report.topicsToStudy.map(
                      (
                        item,
                        i
                      ) => (
                        <li key={i}>
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {/* FINAL FEEDBACK */}

              {report.finalFeedback && (
                <div className="feedback-section">
                  <h3>
                    📝 Final Interview
                    Feedback
                  </h3>

                  <p>
                    {
                      report.finalFeedback
                    }
                  </p>
                </div>
              )}

              <button
                onClick={restart}
              >
                🔄 Give New Interview
              </button>
            </div>
          )}
      </div>
    </>
  );
}

export default MockInterview;