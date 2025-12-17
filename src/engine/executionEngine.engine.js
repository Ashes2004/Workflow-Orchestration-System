/**
 * Decides the next action based on workflow definition and current history.
 * * @param {Object} workflow - The full workflow document
 * @param {Array} stepExecutions - List of StepExecution documents for this run
 * @returns {Object} { action: 'RUN_STEP' | 'COMPLETE' | 'FAIL', step: Object | null }
 */
const determineNextStep = (workflow, stepExecutions) => {
    // 1. Create a map for fast lookup: "stepId" -> Status
    const executionMap = {};
    stepExecutions.forEach(exec => {
        executionMap[exec.stepId] = exec;
    });

    // 2. Iterate through the blueprint order
    for (const stepConfig of workflow.steps) {
        const stepId = stepConfig.stepId;
        const currentStatus = executionMap[stepId]?.status; // e.g., 'SUCCESS', 'FAILED', undefined

        // Case A: Step hasn't started yet
        if (!currentStatus) {
            return { action: 'RUN_STEP', step: stepConfig };
        }

        // Case B: Step is currently running (or worker crashed while running)
        // In a real system, we'd check timestamps to detect "stuck" jobs. 
        // For now, we assume if it's IN_PROGRESS, let it finish.
        if (currentStatus === 'IN_PROGRESS') {
            return { action: 'WAIT', step: null }; 
        }

        // Case C: Step Failed
        if (currentStatus === 'FAILED') {
            const attemptCount = executionMap[stepId].attemptCount || 0;
            const maxRetries = stepConfig.config.retries || 0;

            if (attemptCount <= maxRetries) {
                return { action: 'RUN_STEP', step: stepConfig }; // Retry!
            } else {
                return { action: 'FAIL', step: null }; // Exhausted retries
            }
        }

        // Case D: Step Success
        if (currentStatus === 'SUCCESS') {
            continue; // Move to next step in loop
        }
    }

    // 3. If loop finishes, all steps are SUCCESS
    return { action: 'COMPLETE', step: null };
};

module.exports = { determineNextStep };