const Execution = require("../models/Execution.model");

class ExecutionRepository {
  async create(workflowId, input) {
    return Execution.create({
      workflowId,
      input,
      status: "RUNNING",
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
    return Execution.findOne({ status: "RUNNING" }).sort({ createdAt: 1 });
  }

  async findById(executionId) {
    return Execution.findById(executionId).lean();
  }
  async findRunningExecutions() {
    return Execution.find({ status: "RUNNING" }).lean();
  }

  async findAll() {
    return Execution.find().lean();
  }
  async pause(executionId) {
    return Execution.findByIdAndUpdate(
      executionId,
      { status: "PAUSED" },
      { new: true }
    );
  }

  async resume(executionId) {
    return Execution.findByIdAndUpdate(
      executionId,
      { status: "RUNNING" },
      { new: true }
    );
  }
}

module.exports = ExecutionRepository;
