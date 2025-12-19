const express = require('express');
const app = express();

app.use(express.json());

app.get('/' , (req , res)=>{
    res.send("Hello ,  Welcome to Workflow Orchestration System");
})
app.get('/health', (req, res) => {
    res.json({ status: 'UP', service: 'workflow-engine-api-' });
});

module.exports = app;