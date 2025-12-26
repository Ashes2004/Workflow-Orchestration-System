const ExecutionRepository = require("../repositories/Execution.repository");
const StepExecutionRepository = require("../repositories/stepExecution.repository");

class ExecutionEngine {
  constructor() {
    this.executionRepo = new ExecutionRepository();
    this.stepExecutionRepo = new StepExecutionRepository();
  }

  async getNextRunnableStep() {
    // 1) find RUNNING execution
    const execution = await this.executionRepo.findRunningExecution();
    if (!execution) return null;

    // 2) load steps in order
    const steps = await this.stepExecutionRepo.findByExecutionId(execution._id);

    for (let i = 0; i < steps.length; i++) {
      const curr = steps[i];

      //  ALL previous steps must be SUCCESS
      const allPreviousSuccessful = steps
        .slice(0, i)
        .every(s => s.status === "SUCCESS");

      if (curr.status === "PENDING" && allPreviousSuccessful) {
        return {
          executionId: execution._id,
          stepExecutionId: curr._id,
          stepId: curr.stepId,
          handler: curr.handler,
          config: curr.config,
          input: curr.input
        };
      }
    }

    return null;
  }
}

module.exports = ExecutionEngine;
