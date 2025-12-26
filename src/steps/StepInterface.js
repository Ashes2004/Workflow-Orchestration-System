class StepInterface {
  async execute(config, input, context) {
    throw new Error("execute() not implemented");
  }
}

module.exports = StepInterface;
