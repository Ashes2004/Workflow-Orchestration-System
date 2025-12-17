const mongoose = require('mongoose');

const StepExecutionSchema = new mongoose.Schema({
    executionId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Execution', 
        required: true 
    },
    stepId: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['PENDING', 'IN_PROGRESS', 'SUCCESS', 'FAILED'], 
        default: 'PENDING' 
    },
    input: { type: mongoose.Schema.Types.Mixed },  // Data passed INTO step
    output: { type: mongoose.Schema.Types.Mixed }, // Data returned FROM step
    error: { type: String },                       // Error message if failed
    attemptCount: { type: Number, default: 0 },
    startedAt: { type: Date },
    completedAt: { type: Date }
});

// Compound index for fast lookups
// "Find the execution for step X in workflow run Y"
StepExecutionSchema.index({ executionId: 1, stepId: 1 }, { unique: true });

module.exports = mongoose.model('StepExecution', StepExecutionSchema);