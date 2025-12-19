const WorkflowRepository = require("../repositories/workflow.repository");

class WorkflowService {
  constructor() {
    this.workflowRepo = new WorkflowRepository();
  }

  async createWorkflow(data) {
    // data = { name, steps }
    return this.workflowRepo.create(data);
  }

  async getWorkflowById(workflowId) {
    return this.workflowRepo.findById(workflowId);
  }
}

module.exports = WorkflowService;
