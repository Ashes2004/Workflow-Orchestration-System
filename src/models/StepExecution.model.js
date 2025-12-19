const StepExecutionSchema = new mongoose.Schema({
  executionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Execution',
    required: true
  },
  stepId: { type: String, required: true },
  handler: { type: String, required: true },
  config: { type: mongoose.Schema.Types.Mixed, default: {} },

  status: {
    type: String,
    enum: ['PENDING', 'RUNNING', 'SUCCESS', 'FAILED'],
    default: 'PENDING'
  },

  input: mongoose.Schema.Types.Mixed,
  output: mongoose.Schema.Types.Mixed,
  error: String,
  retries: { type: Number, default: 0 },

  startedAt: Date,
  completedAt: Date
}, { timestamps: true });

StepExecutionSchema.index(
  { executionId: 1, stepId: 1 },
  { unique: true }
);

module.exports = mongoose.model("StepExecution", StepExecutionSchema);