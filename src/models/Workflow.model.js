const mongoose = require('mongoose');

const StepSchema = new mongoose.Schema({
  stepId: { type: String, required: true },
  handler: { type: String, required: true },
  config: { type: mongoose.Schema.Types.Mixed, default: {} }
});


const WorkflowSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    },
    steps: [StepSchema], 
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Workflow', WorkflowSchema);