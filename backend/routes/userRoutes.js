
const express = require("express");

const router = express.Router();

const User = require("../models/user");
const Performance = require("../models/Performance");

// =====================================================
// GET ALL STUDENTS
// =====================================================

router.get("/students", async (req, res) => {
  try {
    const students = await User.find({
      role: "student",
    }).select("-password");

    res.status(200).json({
      success: true,
      students,
    });
  } catch (error) {
    console.log(
      "GET STUDENTS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// DELETE STUDENT
// =====================================================

router.delete("/:id", async (req, res) => {
  try {
    const studentId = req.params.id;

    // Find student
    const student = await User.findOne({
      _id: studentId,
      role: "student",
    });

    // Student not found
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Delete student's performance records
    await Performance.deleteMany({
      userId: studentId,
    });

    // Delete student
    await User.findByIdAndDelete(studentId);

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.log(
      "DELETE STUDENT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;