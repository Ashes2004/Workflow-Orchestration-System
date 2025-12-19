const StepExecution = require("../models/StepExecution.model");

class StepExecutionRepository {
  async createMany(stepExecutions) {
    return StepExecution.insertMany(stepExecutions);
  }

  async findByExecutionId(executionId) {
    return StepExecution
      .find({ executionId })
      .sort({ createdAt: 1 })
      .lean();
  }

  async markRunning(stepExecutionId) {
    return StepExecution.findByIdAndUpdate(
      stepExecutionId,
      {
        status: "RUNNING",
        startedAt: new Date()
      }
    );
  }

  async markSuccess(stepExecutionId, output) {
    return StepExecution.findByIdAndUpdate(
      stepExecutionId,
      {
        status: "SUCCESS",
        output,
        completedAt: new Date()
      }
    );
  }

  async markFailed(stepExecutionId, error) {
    return StepExecution.findByIdAndUpdate(
      stepExecutionId,
      {
        status: "FAILED",
        error,
        completedAt: new Date()
      }
    );
  }

  async incrementRetry(stepExecutionId) {
    const step = await StepExecution.findByIdAndUpdate(
      stepExecutionId,
      { $inc: { retries: 1 } },
      { new: true }
    );
    return step.retries;
  }

  async markPending(stepExecutionId) {
    return StepExecution.findByIdAndUpdate(
      stepExecutionId,
      { status: "PENDING" }
    );
  }
}

module.exports = StepExecutionRepository;
