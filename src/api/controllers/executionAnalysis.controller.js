const ExecutionAnalysisRepository = require("../../repositories/ExecutionAnalysis.repository");

 class ExecutionAnalysisController {
  constructor() {
    this.executionAnalysisRepo = new ExecutionAnalysisRepository();
  }

  async getExecutionAnalysis(req, res) {
    try {
      const { id } = req.params;
      const data = await this.executionAnalysisRepo.getAnalysis(id);
      return res.status(200).json({ data });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
module.exports = ExecutionAnalysisController;