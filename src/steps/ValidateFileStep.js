const StepInterface = require("./StepInterface");

class ValidateFileStep extends StepInterface {
  async execute(config, input, context) {
    console.log(`[${context.executionId}] Validating file`);

    if (Math.round(Math.random() * 10) < 6) {
      throw new Error("File validation failed");
    } else {
      return {
        valid: true,
      };
    }
  }
}

module.exports = ValidateFileStep;
