const mongoose = require("mongoose");

const ExecutionAnalysisSchema = new mongoose.Schema({
  executionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Execution",
    required: true,
    unique: true
  },
  summary: String,
  stepInsights: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model(
  "ExecutionAnalysis",
  ExecutionAnalysisSchema
);
