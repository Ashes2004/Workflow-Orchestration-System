const Execution = require("../models/Execution.model");

class ExecutionRepository {
  async create(workflowId, input) {
    return Execution.create({
      workflowId,
      input,
      status: "RUNNING"
    });
  }

  async markSuccess(executionId) {
    return Execution.findByIdAndUpdate(
      executionId,
      { status: "SUCCESS" },
      { new: true }
    );
  }

  async markFailed(executionId) {
    return Execution.findByIdAndUpdate(
      executionId,
      { status: "FAILED" },
      { new: true }
    );
  }

  async findRunningExecution() {
    return Execution.findOne({ status: "RUNNING" });
  }
}

module.exports = ExecutionRepository;
