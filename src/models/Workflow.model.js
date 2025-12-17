const mongoose = require('mongoose');

const StepSchema = new mongoose.Schema({
    stepId: { 
        type: String, 
        required: true,
        // e.g., "download_file_step_1". Must be unique within this workflow.
    },
    handler: { 
        type: String, 
        required: true 
        // Maps to the actual JS file (e.g. "download_file")
    },
    config: { 
        type: mongoose.Schema.Types.Mixed, 
        default: {} 
        // Static config like URL, retry attempts, timeouts
    },
    nextStepId: { 
        type: String, 
        default: null 
        // Pointer to the next step. Null means Workflow ends here.
    }
});

const WorkflowSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    },
    steps: [StepSchema], // The ordered list of instructions
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Workflow', WorkflowSchema);