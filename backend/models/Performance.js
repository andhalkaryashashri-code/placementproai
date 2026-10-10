const mongoose = require("mongoose");

const performanceSchema = new mongoose.Schema(
  {
    // ==========================================
    // STUDENT
    // ==========================================
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==========================================
    // TEST ID
    // Can be MongoDB ObjectId for normal tests
    // OR string like "mock-interview" for AI interview
    // ==========================================
    testId: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    // ==========================================
    // TEST NAME
    // ==========================================
    testName: {
      type: String,
      required: true,
    },

    // ==========================================
    // SUBJECT
    // ==========================================
    subject: {
      type: String,
      default: "Aptitude",
    },

    // ==========================================
    // QUESTIONS
    // ==========================================
    totalQuestions: {
      type: Number,
      required: true,
      default: 0,
    },

    correctAnswers: {
      type: Number,
      default: 0,
    },

    wrongAnswers: {
      type: Number,
      default: 0,
    },

    // ==========================================
    // SCORE
    // ==========================================
    score: {
      type: Number,
      required: true,
      default: 0,
    },

    percentage: {
      type: Number,
      required: true,
      default: 0,
    },

    // ==========================================
    // PERFORMANCE LEVEL
    // ==========================================
    performanceLevel: {
      type: String,
      enum: [
        "Excellent",
        "Good",
        "Average",
        "Need Improvement",
      ],
      default: "Average",
    },

    // ==========================================
    // STRONG / WEAK AREAS
    // ==========================================
    strongAreas: {
      type: [String],
      default: [],
    },

    weakAreas: {
      type: [String],
      default: [],
    },

    // ==========================================
    // TIME DETAILS
    // ==========================================
    startedAt: {
      type: Date,
    },

    submittedAt: {
      type: Date,
    },

    // ==========================================
    // SUBMISSION REASON
    // ==========================================
    submissionReason: {
      type: String,
      enum: ["manual", "time", "tab"],
      default: "manual",
    },

    // ==========================================
    // ATTEMPTED AT
    // ==========================================
    attemptedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// ONE STUDENT = ONE ATTEMPT PER TEST
// ==========================================

performanceSchema.index(
  {
    userId: 1,
    testId: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "Performance",
  performanceSchema
);