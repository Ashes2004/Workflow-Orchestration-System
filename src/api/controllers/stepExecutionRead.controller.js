const StepExecutionRepository =
  require("../../repositories/stepExecution.repository");

class StepExecutionReadController {
  constructor() {
    this.stepRepo = new StepExecutionRepository();
  }

  async getSteps(req, res) {
    try {
      const steps = await this.stepRepo.findByExecutionId(
        req.params.executionId
      );
      res.json(steps);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = StepExecutionReadController;
