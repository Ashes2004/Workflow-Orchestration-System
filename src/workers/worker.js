const ExecutionEngine = require("../engine/executionEngine.engine");
const StepExecutionRepository = require("../repositories/stepExecution.repository");
const ExecutionRepository = require("../repositories/Execution.repository");
const RetryPolicy = require("../engine/retryPolicy.engine");
const LockManager = require("../engine/lockManager.engine");
const stepRegistry = require("./stepRegistry");

class Worker {
  constructor() {
    this.engine = new ExecutionEngine();
    this.stepRepo = new StepExecutionRepository();
    this.executionRepo = new ExecutionRepository();
  }

  async runOnce() {
    const task = await this.engine.getNextRunnableStep();
    if (!task) return;

    const {
      executionId,
      stepExecutionId,
      stepId,
      handler,
      config,
      input
    } = task;

    const lockKey = `lock:${executionId}:${stepId}`;
    const locked = await LockManager.acquire(lockKey, 30);
    if (!locked) return;

    try {
      // Mark step RUNNING
      await this.stepRepo.markRunning(stepExecutionId);

      //Load step handler
      const StepClass = stepRegistry[handler];
      if (!StepClass) {
        throw new Error(`Unknown step handler: ${handler}`);
      }

      const step = new StepClass();
      const context = { executionId, stepId };

      // Execute step
      const output = await step.execute(config, input, context);

      // Mark step SUCCESS
      await this.stepRepo.markSuccess(stepExecutionId, output);

      // Check if execution is COMPLETE
      const steps = await this.stepRepo.findByExecutionId(executionId);
      const execution = await this.executionRepo.findById(executionId);

      const allStepsSuccessful = steps.every(
        s => s.status === "SUCCESS"
      );

      if (
        execution.status === "RUNNING" &&
        allStepsSuccessful
      ) {
        await this.executionRepo.markSuccess(executionId);
      }

    } catch (err) {
      //  Retry handling
      const retries = await this.stepRepo.incrementRetry(stepExecutionId);

      if (RetryPolicy.canRetry(retries)) {
        await this.stepRepo.markPending(stepExecutionId);
      } else {
        await this.stepRepo.markFailed(stepExecutionId, err.message);
        await this.executionRepo.markFailed(executionId);
      }

    } finally {
      //  Always release lock
      await LockManager.release(lockKey);
    }
  }
}

module.exports = Worker;
