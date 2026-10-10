const Performance = require("../models/Performance");

// =====================================================
// SAVE PERFORMANCE
// POST /api/performance/save
// =====================================================

exports.savePerformance = async (req, res) => {
  try {
    const {
      userId,
      testId,
      testName,
      subject,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      score,
      percentage,
      strongAreas,
      weakAreas,
      startedAt,
      submittedAt,
      submissionReason,
    } = req.body;

    console.log("=================================");
    console.log("SAVE PERFORMANCE REQUEST");
    console.log("USER ID:", userId);
    console.log("TEST ID:", testId);
    console.log("TEST NAME:", testName);
    console.log("SUBJECT:", subject);
    console.log("SCORE:", score);
    console.log("PERCENTAGE:", percentage);
    console.log("=================================");

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!userId || !testId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Test ID are required",
      });
    }

    // ==========================================
    // CHECK EXISTING PERFORMANCE
    // ==========================================

    const existingPerformance =
      await Performance.findOne({
        userId: userId,
        testId: testId,
      });

    if (existingPerformance) {
      return res.status(400).json({
        success: false,
        message: "You already attempted this test",
      });
    }

    // ==========================================
    // PERCENTAGE
    // ==========================================

    const finalPercentage =
      Math.max(
        0,
        Math.min(
          100,
          Number(percentage) || 0
        )
      );

    // ==========================================
    // PERFORMANCE LEVEL
    // ==========================================

    let level = "Average";

    if (finalPercentage >= 80) {
      level = "Excellent";
    } else if (finalPercentage >= 60) {
      level = "Good";
    } else if (finalPercentage < 40) {
      level = "Need Improvement";
    }

    // ==========================================
    // SUBMISSION REASON
    // ==========================================

    let finalReason = "manual";

    if (
      submissionReason === "time" ||
      submissionReason === "tab" ||
      submissionReason === "manual"
    ) {
      finalReason = submissionReason;
    }

    // ==========================================
    // CREATE PERFORMANCE
    // ==========================================

    const performance =
      await Performance.create({
        userId: userId,

        testId: testId,

        testName:
          testName || "Test",

        subject:
          subject || "Aptitude",

        totalQuestions:
          Number(totalQuestions) || 0,

        correctAnswers:
          Number(correctAnswers) || 0,

        wrongAnswers:
          Number(wrongAnswers) || 0,

        score:
          Number(score) || 0,

        percentage:
          finalPercentage,

        performanceLevel:
          level,

        strongAreas:
          Array.isArray(strongAreas)
            ? strongAreas
            : [],

        weakAreas:
          Array.isArray(weakAreas)
            ? weakAreas
            : [],

        startedAt:
          startedAt
            ? new Date(startedAt)
            : undefined,

        submittedAt:
          submittedAt
            ? new Date(submittedAt)
            : new Date(),

        submissionReason:
          finalReason,

        attemptedAt:
          new Date(),
      });

    console.log(
      "PERFORMANCE SAVED:",
      performance._id
    );

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(201).json({
      success: true,
      message: "Performance Saved Successfully",
      performance: performance,
    });
  } catch (error) {
    console.log(
      "SAVE PERFORMANCE ERROR:",
      error
    );

    // ==========================================
    // DUPLICATE ENTRY
    // ==========================================

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "You already attempted this test",
      });
    }

    // ==========================================
    // OTHER ERROR
    // ==========================================

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET ALL PERFORMANCE
// GET /api/performance/all
// =====================================================

exports.getPerformance = async (
  req,
  res
) => {
  try {
    const performances =
      await Performance.find()
        .populate(
          "userId",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      performances: performances,
    });
  } catch (error) {
    console.log(
      "GET PERFORMANCE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET STUDENT PERFORMANCE
// GET /api/performance/student/:userId
// =====================================================

exports.getStudentPerformance = async (
  req,
  res
) => {
  try {
    const userId =
      req.params.userId;

    console.log(
      "================================="
    );

    console.log(
      "GET STUDENT PERFORMANCE"
    );

    console.log(
      "REQUESTED STUDENT ID:",
      userId
    );

    // ==========================================
    // GET PERFORMANCE
    // ==========================================

    const performances =
      await Performance.find({
        userId: userId,
      })
        .populate(
          "userId",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    console.log(
      "PERFORMANCE RECORDS FOUND:",
      performances.length
    );

    // ==========================================
    // NO PERFORMANCE
    // ==========================================

    if (
      performances.length === 0
    ) {
      return res.status(200).json({
        success: true,

        data: {
          overallScore: 0,

          totalTests: 0,

          strongAreas: [],

          weakAreas: [],

          performances: [],
        },
      });
    }

    // ==========================================
    // CALCULATE OVERALL SCORE
    // ==========================================

    let totalPercentage = 0;

    performances.forEach(
      (item) => {
        totalPercentage +=
          Number(
            item.percentage
          ) || 0;
      }
    );

    const overallScore =
      Math.round(
        totalPercentage /
          performances.length
      );

    // ==========================================
    // STRONG / WEAK AREAS
    // ==========================================

    const strong = [];
    const weak = [];

    performances.forEach(
      (item) => {
        if (
          Array.isArray(
            item.strongAreas
          )
        ) {
          strong.push(
            ...item.strongAreas
          );
        }

        if (
          Array.isArray(
            item.weakAreas
          )
        ) {
          weak.push(
            ...item.weakAreas
          );
        }
      }
    );

    // ==========================================
    // REMOVE DUPLICATES
    // ==========================================

    const uniqueStrongAreas =
      [
        ...new Set(strong),
      ];

    const uniqueWeakAreas =
      [
        ...new Set(weak),
      ];

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      data: {
        overallScore:
          overallScore,

        totalTests:
          performances.length,

        strongAreas:
          uniqueStrongAreas,

        weakAreas:
          uniqueWeakAreas,

        performances:
          performances,
      },
    });
  } catch (error) {
    console.log(
      "GET STUDENT PERFORMANCE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET PERFORMANCE BY TEST
// GET /api/performance/test/:testId
// =====================================================

exports.getPerformanceByTest =
  async (req, res) => {
    try {
      const testId =
        req.params.testId;

      console.log(
        "GET TEST PERFORMANCE:",
        testId
      );

      const performances =
        await Performance.find({
          testId: testId,
        })
          .populate(
            "userId",
            "name email"
          )
          .sort({
            createdAt: -1,
          });

      return res.status(200).json({
        success: true,
        data: performances,
      });
    } catch (error) {
      console.log(
        "GET TEST PERFORMANCE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
/*
  AIML FEATURE:
  Predict a student's next test score using Linear Regression.
  Add this function at the bottom of performanceController.js.
*/

exports.predictStudentPerformance = async (req, res) => {
  try {
    const { userId } = req.params;

    const records = await Performance.find({ userId }).sort({
      attemptedAt: 1,
      createdAt: 1,
    });

    // Keep only records with valid percentages.
    const scores = records
      .map((record) => Number(record.percentage))
      .filter((score) => Number.isFinite(score) && score >= 0 && score <= 100);

    if (scores.length < 3) {
      return res.status(200).json({
        success: true,
        enoughData: false,
        message: "At least 3 valid test attempts are needed.",
        totalTests: scores.length,
      });
    }

    // X = test attempt number; Y = percentage scored.
    const n = scores.length;
    const xValues = scores.map((_, index) => index + 1);
    const meanX = xValues.reduce((sum, x) => sum + x, 0) / n;
    const meanY = scores.reduce((sum, y) => sum + y, 0) / n;

    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < n; i++) {
      numerator += (xValues[i] - meanX) * (scores[i] - meanY);
      denominator += (xValues[i] - meanX) ** 2;
    }

    // Linear Regression: Y = intercept + slope * X
    const slope = denominator === 0 ? 0 : numerator / denominator;
    const intercept = meanY - slope * meanX;
    const rawPrediction = intercept + slope * (n + 1);
    const predictedPercentage = Math.round(
      Math.max(0, Math.min(100, rawPrediction)) * 100
    ) / 100;

    return res.status(200).json({
      success: true,
      enoughData: true,
      algorithm: "Linear Regression",
      totalTests: n,
      previousScores: scores,
      predictedPercentage,
      trend:
        slope > 0.5
          ? "Improving"
          : slope < -0.5
          ? "Declining"
          : "Nearly stable",
      message: "Prediction is an estimate based on previous test scores.",
    });
  } catch (error) {
    console.error("STUDENT PREDICTION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to predict student performance.",
    });
  }
};
