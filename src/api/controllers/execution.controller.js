const ExecutionService = require("../../services/Execution.service");

class ExecutionController {
  constructor() {
    this.executionService = new ExecutionService();
  }

  async startExecution(req, res) {
    try {
      const execution = await this.executionService.startExecution(
        req.params.workflowId,
        req.body
      );
      res.status(201).json(execution);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = ExecutionController;
