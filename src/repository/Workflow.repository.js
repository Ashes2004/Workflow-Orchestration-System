const Workflow = require("../models/Workflow.model");

class WorkflowRepository {
  async create(workflowData) {
    return Workflow.create(workflowData);
  }

  async findById(workflowId) {
    return Workflow.findById(workflowId).lean();
  }
}

module.exports = WorkflowRepository;
