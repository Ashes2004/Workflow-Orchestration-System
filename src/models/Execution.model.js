const mongoose = require('mongoose');

const ExecutionSchema = new mongoose.Schema({
  workflowId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workflow',
    required: true
  },
  status: {
    type: String,
    enum: ['RUNNING', 'SUCCESS', 'FAILED'],
    default: 'RUNNING'
  },
  input: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

module.exports = mongoose.model("Execution", ExecutionSchema);