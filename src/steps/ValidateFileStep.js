const StepInterface = require("./StepInterface");

class ValidateFileStep extends StepInterface {
  async execute(config, input, context) {
    console.log(`[${context.executionId}] Validating file`);

    if (Math.random() < 0.4) {
      throw new Error("File validation failed");
    }

    return {
      valid: true
    };
    //  throw new Error("Validation failed");
  }
}

module.exports = ValidateFileStep;
