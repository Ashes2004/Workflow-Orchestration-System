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
    const stepExecutions = workflow.steps.map(step => ({
      executionId: execution._id,
      stepId: step.stepId,
      handler: step.handler,
      config: step.config,
      input
    }));

    await this.stepExecutionRepo.createMany(stepExecutions);

    return execution;
  }
}

module.exports = ExecutionService;
