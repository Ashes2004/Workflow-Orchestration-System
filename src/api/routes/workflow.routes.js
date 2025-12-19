const express = require("express");
const router = express.Router();
const WorkflowController = require("../controllers/workflow.controller");

const controller = new WorkflowController();

router.post("/", controller.createWorkflow.bind(controller));
router.get("/:id", controller.getWorkflow.bind(controller));

module.exports = router;
