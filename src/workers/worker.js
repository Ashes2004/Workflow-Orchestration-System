const ExecutionEngine = require("../engine/executionEngine.engine");
const StepExecutionRepository = require("../repositories/stepExecution.repository");
const ExecutionRepository = require("../repositories/Execution.repository");
const RetryPolicy = require("../engine/retryPolicy.engine");
const LockManager = require("../engine/lockManager.engine");
const stepRegistry = require("./stepRegistry");

const LogAnalysisAgent = require("../agents/LogAnalysisAgent");
const ExecutionAnalysisRepository = require("../repositories/ExecutionAnalysis.repository");

const aiAgent = new LogAnalysisAgent();
const analysisRepo = new ExecutionAnalysisRepository();

class Worker {
  constructor() {
    this.engine = new ExecutionEngine();
    this.stepRepo = new StepExecutionRepository();
    this.executionRepo = new ExecutionRepository();
  }

 async runOnce() {
  const task = await this.engine.getNextRunnableStep();
  if (!task) return;

  const { executionId, stepExecutionId, stepId, handler, config, input } = task;

  const executionLockKey = `lock:execution:${executionId}`;
  const execLocked = await LockManager.acquire(executionLockKey, 60);
  if (!execLocked) return;

  const lockKey = `lock:${executionId}:${stepId}`;
  const locked = await LockManager.acquire(lockKey, 30);
  if (!locked) {
    await LockManager.release(executionLockKey);
    return;
  }

  try {
    await this.stepRepo.markRunning(stepExecutionId);

    const StepClass = stepRegistry[handler];
    if (!StepClass) throw new Error(`Unknown step handler: ${handler}`);

    const step = new StepClass();
    const output = await step.execute(config, input, { executionId, stepId });

    await this.stepRepo.markSuccess(stepExecutionId, output);

    const steps = await this.stepRepo.findByExecutionId(executionId);
    const execution = await this.executionRepo.findById(executionId);

    if (
      execution.status === "RUNNING" &&
      steps.every(s => s.status === "SUCCESS")
    ) {
      await this.executionRepo.markSuccess(executionId);
      const finalExecution = await this.executionRepo.findById(executionId);

      const analysis = await aiAgent.analyze(finalExecution, steps);
      await analysisRepo.save(executionId, analysis);
    }

  } catch (err) {
    const retries = await this.stepRepo.incrementRetry(stepExecutionId);

    if (RetryPolicy.canRetry(retries)) {
      await this.stepRepo.markPending(stepExecutionId);
    } else {
      await this.stepRepo.markFailed(stepExecutionId, err.message);
      await this.executionRepo.markFailed(executionId);

      const steps = await this.stepRepo.findByExecutionId(executionId);
      const execution = await this.executionRepo.findById(executionId);

      const analysis = await aiAgent.analyze(execution, steps);
      await analysisRepo.save(executionId, analysis);
    }
  } finally {
    await LockManager.release(lockKey);
    await LockManager.release(executionLockKey);
  }
}

}

module.exports = Worker;
