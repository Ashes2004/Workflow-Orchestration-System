const express = require('express');
const workflowRoutes = require("./api/routes/workflow.routes");
const executionRoutes = require("./api/routes/execution.routes");
const app = express();

app.use(express.json());

app.get('/' , (req , res)=>{
    res.send("Hello ,  Welcome to Workflow Orchestration System");
})
app.get('/health', (req, res) => {
    res.json({ status: 'UP', service: 'workflow-engine-api-' });
});

app.use("/workflows", workflowRoutes);
app.use("/executions", executionRoutes);

module.exports = app;