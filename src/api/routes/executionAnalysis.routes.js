const express = require("express");
const ExecutionAnalysisController  = require("../controllers/executionAnalysis.controller");
const router = express.Router();

const controller = new ExecutionAnalysisController();

router.get('/analysis/:id' , controller.getExecutionAnalysis.bind(controller));
module.exports = router;