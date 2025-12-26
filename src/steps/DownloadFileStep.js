const StepInterface = require("./StepInterface");

class DownloadFileStep extends StepInterface {
  async execute(config, input, context) {
    console.log(`[${context.executionId}] Downloading file`);

    // simulate delay
    await new Promise(r => setTimeout(r, 1000));

    return {
      filePath: "/tmp/file.dat"
    };
  }
}

module.exports = DownloadFileStep;
