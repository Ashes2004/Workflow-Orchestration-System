const connectDB = require('../config/database');
const { connectRedis } = require('../config/redis');

const startWorker = async () => {
    await connectDB();
    await connectRedis();
    console.log("Worker process started... waiting for jobs (Not implemented yet)");
    
    // Keep process alive
    setInterval(() => {}, 1000); 
};

startWorker();