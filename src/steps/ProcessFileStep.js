const StepInterface = require("./StepInterface");

class ProcessFileStep extends StepInterface {
  async execute(config, input, context) {
    console.log(`[${context.executionId}] Processing file`);

    // simulate delay
    await new Promise(r => setTimeout(r, 1500));

    return {
      processed: true
    };
  }
}

module.exports = ProcessFileStep;
