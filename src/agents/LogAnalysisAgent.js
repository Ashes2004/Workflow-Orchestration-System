const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
class LogAnalysisAgent {
  constructor() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });
  }

async analyze(execution, steps) {
  try {
    const prompt = this.buildPrompt(execution, steps);
    const result = await this.model.generateContent(prompt);
    const response = result.response.text();
     console.log(response);
    return {
      summary: response.slice(0, 300),
      stepInsights: response
    };
  } catch (err) {
    console.error("Gemini error:", err.message);

    // fallback (DO NOT BREAK SYSTEM)
    return {
      summary: "AI analysis failed",
      stepInsights: err.message
    };
  }
}


 buildPrompt(execution, steps) {
  return `
You are a senior backend observability analyst.

Your job is to analyze a completed workflow execution and explain what happened
in a clear, professional, post-mortem style.

IMPORTANT RULES:
- The execution is already finished (SUCCESS or FAILED).
- Do NOT mention internal engine mechanics.
- Do NOT speculate about future steps.
- Do NOT repeat raw data.
- Be precise, concise, and factual.
- Write in clear English, suitable for an engineering dashboard.

EXECUTION SUMMARY:
- Final Status: ${execution.status}

STEP TIMELINE:
${steps.map((s, i) => `
${i + 1}. Step: ${s.stepId}
   Status: ${s.status}
   Attempts: ${(s.retries || 0) + 1}
   Error: ${s.error || "None"}
`).join("")}

TASK:
Produce a structured explanation with the following sections:

1. Overall Outcome  
   - Clearly state whether the workflow succeeded or failed.

2. Step Analysis  
   - Briefly explain how each step behaved.
   - Mention retries only if they happened.

3. Failure Analysis (ONLY if execution failed)  
   - Identify the exact step that caused failure.
   - Explain why the workflow stopped.

4. Reliability Notes  
   - Comment on retries and stability in one sentence.

STYLE REQUIREMENTS:
- Use short paragraphs.
- No markdown lists.
- No bullet points.
- No emojis.
- No assumptions beyond the data.
if failure , give a field reaseon:string , where give exact reason of failure , no extra talks
Now generate the analysis.
`;
}

}

module.exports = LogAnalysisAgent;
