class ValidateMediaStep {
  async execute(config, input, context) {
    console.log(`[${context.executionId}] Validating media`);

    // ❌ Force failure to test retry
    if (!config.allowedFormats.includes(input.format)) {
      throw new Error("Invalid media format");
    }

    return { validated: true };
  }
}

module.exports = ValidateMediaStep;
