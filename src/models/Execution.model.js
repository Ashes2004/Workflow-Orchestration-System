const mongoose = require('mongoose');

const ExecutionSchema = new mongoose.Schema({
    workflowId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Workflow', 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['PENDING', 'RUNNING', 'COMPLETED', 'FAILED'], 
        default: 'PENDING' 
    },
    currentStepId: { 
        type: String, 
        default: null 
        // The stepId currently being processed
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Update timestamp on save
ExecutionSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Execution', ExecutionSchema);