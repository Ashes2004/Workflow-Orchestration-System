require("dotenv").config();
const connectDB = require("../config/database");
const Worker = require("./worker");
const { connectRedis } = require('../config/redis');

(async () => {
  await connectDB();
  await connectRedis();
  const worker = new Worker();

  while (true) {
    await worker.runOnce();
    await new Promise(r => setTimeout(r, 1000));
  }
})();
