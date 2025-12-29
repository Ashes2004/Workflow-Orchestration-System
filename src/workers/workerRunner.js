
const connectDB = require("../config/database");
const Worker = require("./worker");
const ExecutionRepository = require("../repositories/Execution.repository");
const StepExecutionRepository = require("../repositories/stepExecution.repository");
const { connectRedis } = require('../config/redis');
require("dotenv").config();
(async () => {
  // ✅ WAIT for DB
  await connectDB();
  await connectRedis();
  const executionRepo = new ExecutionRepository();
  const stepRepo = new StepExecutionRepository();

  // 🔧 STARTUP RECOVERY
  const runningExecutions = await executionRepo.findRunningExecutions();

  for (const exec of runningExecutions) {
    await stepRepo.resetRunningSteps(exec._id);
    console.log(`Recovered execution ${exec._id}`);
  }

  // 🚀 Worker loop
  const worker = new Worker();
  while (true) {
    await worker.runOnce();
    await new Promise(r => setTimeout(r, 1000));
  }
})();
