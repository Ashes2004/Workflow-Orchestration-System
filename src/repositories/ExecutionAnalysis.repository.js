const ExecutionAnalysis = require("../models/ExecutionAnalysis.model");

class ExecutionAnalysisRepository {
  async save(executionId, analysis) {
    return ExecutionAnalysis.findOneAndUpdate(
      { executionId },
      { executionId, ...analysis },
      { upsert: true, new: true }
    );
  }

  async getAnalysis(executionId)
  {
    return ExecutionAnalysis.find({executionId});
  }
}

module.exports = ExecutionAnalysisRepository;
