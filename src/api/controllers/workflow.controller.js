const WorkflowService = require("../../services/Workflow.service");

class WorkflowController {
  constructor() {
    this.workflowService = new WorkflowService();
  }

  async createWorkflow(req, res) {
    try {
      const workflow = await this.workflowService.createWorkflow(req.body);
      res.status(201).json(workflow);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async getWorkflow(req, res) {
    try {
      const workflow = await this.workflowService.getWorkflowById(req.params.id);
      res.json(workflow);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }
}

module.exports = WorkflowController;
