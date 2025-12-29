const StepInterface = require("./StepInterface");

class PublishPostStep extends StepInterface{
  async execute(config, input, context) {
    console.log(`[${context.executionId}] Publishing post`);

    if (config.captionRequired && !input.caption) {
      throw new Error("Caption missing");
    }

    return {
      postId: "fake_post_456",
      status: "PUBLISHED"
    };
  }
}

module.exports = PublishPostStep;
