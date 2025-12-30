const ExecutionRepository = require("../repositories/Execution.repository");
const StepExecutionRepository = require("../repositories/stepExecution.repository");
const WorkflowRepository = require("../repositories/workflow.repository");

class ExecutionService {
  constructor() {
    this.executionRepo = new ExecutionRepository();
    this.stepExecutionRepo = new StepExecutionRepository();
    this.workflowRepo = new WorkflowRepository();
  }

  async startExecution(workflowId, input) {
    // Load workflow blueprint
    const workflow = await this.workflowRepo.findById(workflowId);
    if (!workflow) {
      throw new Error("Workflow not found");
    }

    // Create execution
    const execution = await this.executionRepo.create(workflowId, input);

    // Create step executions (ALL start as PENDING)
    const stepExecutions = workflow.steps.map((step) => ({
      executionId: execution._id,
      stepId: step.stepId,
      handler: step.handler,
      config: step.config,
      input,
    }));

    await this.stepExecutionRepo.createMany(stepExecutions);

    return execution;
  }

  async findAllExecutions() {
    return this.executionRepo.findAll();
  }

  async pauseExecution(executionId) {
    const execution = await this.executionRepo.findById(executionId);

    if (!execution) {
      throw new Error("Execution not found");
    }

    if (execution.status !== "RUNNING") {
      throw new Error("Only RUNNING executions can be paused");
    }

    return this.executionRepo.pause(executionId);
  }

  async resumeExecution(executionId) {
    const execution = await this.executionRepo.findById(executionId);

    if (!execution) {
      throw new Error("Execution not found");
    }

    if (execution.status !== "PAUSED") {
      throw new Error("Only PAUSED executions can be resumed");
    }

    return this.executionRepo.resume(executionId);
  }

  async findExecutionById(id){
     return this.executionRepo.findById(id);
  }
}

module.exports = ExecutionService;
