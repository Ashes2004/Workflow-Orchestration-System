const express = require("express");
const router = express.Router();
const ExecutionController = require("../controllers/execution.controller");

const controller = new ExecutionController();

router.post("/:workflowId/run", controller.startExecution.bind(controller));

module.exports = router;
