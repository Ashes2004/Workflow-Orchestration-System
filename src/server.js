const app = require("./app");
const connectDB = require("./config/database");
const { connectRedis } = require("./config/redis");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();
  await connectRedis();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
