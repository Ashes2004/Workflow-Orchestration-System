const StepInterface = require("./StepInterface");

class UploadMediaStep extends StepInterface {
  async execute(config, input, context) {
    console.log(`[${context.executionId}] Uploading media`);

    if (!input.fileSizeMB || input.fileSizeMB > config.maxSizeMB) {
      throw new Error("Media size too large");
    }

    return {
      mediaId: "fake_media_123",
      format: input.format
    };
  }
}

module.exports = UploadMediaStep;
