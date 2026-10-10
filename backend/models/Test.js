const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    subject: {
      type: String,
      required: true,
      trim: true
    },

    date: {
      type: Date,
      default: Date.now
    },

    time: {
      type: String,
      default: "10:00 AM"
    },

    duration: {
      type: Number,
      default: 30,
      min: 1
    },

    totalMarks: {
      type: Number,
      required: true,
      min: 0
    },

    createdBy: {
      type: String,
      default: "Teacher"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Test",
  testSchema
);