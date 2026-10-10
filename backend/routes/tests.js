const express = require("express");

const router = express.Router();

const Test = require("../models/Test");

// =====================================================
// CREATE TEST
// =====================================================

router.post("/", async (req, res) => {
  try {
    const test = await Test.create({
      title: req.body.title,
      subject: req.body.subject,
      totalMarks: Number(req.body.totalMarks),
      duration: Number(req.body.duration),
      date: req.body.date || new Date(),
      time: req.body.time || "10:00 AM",
      createdBy: req.body.createdBy || "Teacher"
    });

    return res.status(201).json({
      success: true,
      message: "Test Created Successfully",
      test: test
    });
  } catch (error) {
    console.log("CREATE TEST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// =====================================================
// GET ALL TESTS
// =====================================================

router.get("/", async (req, res) => {
  try {
    const tests = await Test.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      tests: tests
    });
  } catch (error) {
    console.log("GET TESTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// =====================================================
// START TEST
// =====================================================

router.post("/:id/start", async (req, res) => {
  try {
    const test = await Test.findById(
      req.params.id
    );

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found"
      });
    }

    const startedAt = new Date();

    const duration =
      Number(test.duration) || 30;

    const expiresAt = new Date(
      startedAt.getTime() +
        duration * 60 * 1000
    );

    return res.status(200).json({
      success: true,
      message: "Test Started",
      startedAt: startedAt,
      expiresAt: expiresAt,
      duration: duration
    });
  } catch (error) {
    console.log("START TEST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// =====================================================
// GET SINGLE TEST
// =====================================================

router.get("/:id", async (req, res) => {
  try {
    const test = await Test.findById(
      req.params.id
    );

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found"
      });
    }

    return res.status(200).json({
      success: true,
      test: test
    });
  } catch (error) {
    console.log("GET SINGLE TEST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// =====================================================
// DELETE TEST
// =====================================================

router.delete("/:id", async (req, res) => {
  try {
    const test = await Test.findById(
      req.params.id
    );

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found"
      });
    }

    await Test.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Test Deleted Successfully"
    });
  } catch (error) {
    console.log("DELETE TEST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;