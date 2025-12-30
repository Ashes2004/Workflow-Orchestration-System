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

  async findAllExecutions(req, res) {
    try {
      const execution = await this.executionService.findAllExecutions();
      res.status(201).json(execution);
    } catch (error) {
      res.status(400).json({ error: err.message });
    }
  }

   async findExecutionById(req ,res){
      try {
        const {executionId} = req.params;
        if(!executionId) throw new Error('execution id needed');
        const execution = await this.executionService.findExecutionById(executionId);
        res.status(201).json(execution);
      } catch (error) {
         res.status(400).json({ error: err.message });
      }
   }

  async pause(req, res) {
    try {
      const execution = await this.executionService.pauseExecution(
        req.params.executionId
      );
      res.json(execution);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async resume(req, res) {
    try {
      const execution = await this.executionService.resumeExecution(
        req.params.executionId
      );
      res.json(execution);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = ExecutionController;
