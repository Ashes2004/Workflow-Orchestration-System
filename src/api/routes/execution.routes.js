const express = require("express");
const router = express.Router();
const ExecutionController = require("../controllers/execution.controller");
const StepExecutionReadController = require("../controllers/stepExecutionRead.controller");

const controller = new ExecutionController();
const stepController = new StepExecutionReadController();
router.post("/:workflowId/run", controller.startExecution.bind(controller));
router.post("/:workflowId/run", controller.startExecution.bind(controller));
router.get("/execution/:executionId/steps", stepController.getSteps.bind(stepController));
router.get("/" , controller.findAllExecutions.bind(controller));

router.post("/:executionId/pause", controller.pause.bind(controller));
router.post("/:executionId/resume", controller.resume.bind(controller));
module.exports = router;
