const express = require("express");

const router = express.Router();

const performanceController =
  require("../controllers/performanceController");

// =====================================================
// SAVE PERFORMANCE
// POST /api/performance/save
// =====================================================

router.post(
  "/save",
  performanceController.savePerformance
);

// =====================================================
// GET ALL PERFORMANCE
// GET /api/performance/all
// =====================================================

router.get(
  "/all",
  performanceController.getPerformance
);

// =====================================================
// GET STUDENT PERFORMANCE
// GET /api/performance/student/:userId
// =====================================================

router.get(
  "/student/:userId",
  performanceController.getStudentPerformance
);

// =====================================================
// GET PERFORMANCE BY TEST
// GET /api/performance/test/:testId
// =====================================================

router.get(
  "/test/:testId",
  performanceController.getPerformanceByTest
);

router.get(
  "/prediction/:userId",
  performanceController.predictStudentPerformance
);

module.exports = router;