# Deterministic Workflow Orchestration Engine

> A production-grade, backend-focused workflow orchestration system for executing multi-step processes with deterministic behavior, crash safety, and intelligent observability.

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org)
[![Docker](https://img.shields.io/badge/docker-required-blue)](https://www.docker.com/)

---

## Table of Contents

- [Overview](#overview)
- [Why This Engine?](#why-this-engine)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Usage Guide](#usage-guide)
- [Execution Flow](#execution-flow)
- [Failure Handling & Retries](#failure-handling--retries)
- [Crash Recovery](#crash-recovery)
- [AI Observability](#ai-observability)
- [Real-World Integration](#real-world-integration)
- [API Reference](#api-reference)
- [Tech Stack](#tech-stack)
- [Monitoring & Debugging](#monitoring--debugging)
- [Contributing](#contributing)


---

## Overview

This workflow orchestration engine provides a robust foundation for executing complex, multi-step business processes with guarantees around execution order, failure isolation, and automatic recovery. It separates orchestration concerns from business logic, making your backend more maintainable and reliable.

**Core Philosophy:** Deterministic execution based on persistent state, with AI-powered insights for post-execution analysis.

### What It Does

- **Orchestrates** multi-step workflows in a controlled, predictable manner
- **Tracks** every step's state, output, and retry history
- **Recovers** automatically from system crashes and failures
- **Prevents** duplicate execution through distributed locking
- **Analyzes** completed executions using AI for actionable insights

### What It Doesn't Do

- Replace your existing services (it calls them)
- Make execution decisions based on AI
- Require rewriting business logic

---

## Why This Engine?

Real-world backend operations are rarely atomic. Consider these scenarios:

**Media Processing Pipeline**
```
Upload → Validate → Process → Store → Notify
```

**E-Commerce Order**
```
Reserve Inventory → Process Payment → Ship → Send Confirmation
```

**Data Synchronization**
```
Extract → Transform → Validate → Load → Audit
```

These workflows need:

- ✅ Guaranteed step ordering
- ✅ Safe retries on failure
- ✅ Isolation of failed steps
- ✅ Recovery from crashes
- ✅ Complete execution history

Without proper orchestration, you end up with:
- ❌ Scattered retry logic across services
- ❌ Inconsistent error handling
- ❌ Difficult debugging
- ❌ Lost execution state after crashes
- ❌ Race conditions in distributed systems

**This engine solves all of these problems.**

---

## Key Features

### 🎯 Deterministic Execution
All execution decisions based on persisted state—no guesswork, no race conditions.

### 🔄 Automatic Crash Recovery
Workers detect and resume incomplete executions on startup.

### 🔒 Distributed Locking
Redis-based locks prevent concurrent execution of the same workflow instance.

### 🔁 Intelligent Retries
Configurable retry policies with exponential backoff and failure boundaries.

### 🤖 AI-Powered Observability
Post-execution analysis identifies failure patterns and performance bottlenecks.

### 🧩 Clean Separation of Concerns
Orchestration logic completely decoupled from business logic.

### 🚀 Production-Ready
Docker Compose deployment, comprehensive logging, health checks, and monitoring hooks.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client / Backend Service                 │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ HTTP API
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Workflow Engine API                       │
│                    (Express Server)                          │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
        ▼                                     ▼
┌──────────────────┐                 ┌──────────────────┐
│  Execution       │                 │   Worker Pool    │
│  Engine          │◄────────────────│   (Background)   │
│  (State Logic)   │                 │                  │
└──────────────────┘                 └──────────────────┘
        │                                     │
        │                                     │
        ▼                                     ▼
┌──────────────────┐                 ┌──────────────────┐
│    MongoDB       │                 │  Step Handlers   │
│  (Source of      │                 │  (Business       │
│   Truth)         │                 │   Logic)         │
└──────────────────┘                 └──────────────────┘
        │                                     │
        │                                     ▼
        │                            ┌──────────────────┐
        │                            │  Backend         │
        │                            │  Services        │
        │                            └──────────────────┘
        │
        ▼
┌──────────────────┐
│     Redis        │
│  (Distributed    │
│   Locking)       │
└──────────────────┘
```

### Core Components

| Component | Responsibility |
|-----------|---------------|
| **Workflow** | Blueprint defining steps, handlers, and configuration |
| **Execution** | Single instance of a workflow run with unique ID |
| **StepExecution** | Tracks individual step state, retries, errors, timestamps |
| **Engine** | Pure decision logic for determining next runnable step |
| **Worker** | Executes steps, manages retries, updates state |
| **Step Handler** | Encapsulates service-specific business logic |
| **Lock Manager** | Ensures single-worker execution per workflow instance |

---

## Quick Start

### Prerequisites

- **Docker** 20.10+
- **Docker Compose** 2.0+
- **Node.js** 20+

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Ashes2004/Workflow-Orchestration-System.git
cd Workflow-Orchestration-System
```

**2. Configure environment**

Create `.env` file:

```env
# MongoDB Configuration
MONGO_URI=mongodb://mongo:27017/workflow_engine

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379

# AI Observability (Optional)
GEMINI_API_KEY=your_gemini_api_key_here


```

> **Note:** The system works fully without `GEMINI_API_KEY`—AI observability will be skipped.

**3. Start the system**

```bash
docker-compose up --build
```

Services started:
- ✅ API Server (`http://localhost:3000`)
- ✅ Worker Process (background)
- ✅ MongoDB (`localhost:27017`)
- ✅ Redis (`localhost:6379`)

**4. Verify health**

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{"status":"UP","service":"workflow-engine-api"}
```

---

## Usage Guide

### Creating Business Logic (Step Handlers)

All business logic lives in step handler classes. You never modify engine or worker code , only add handlers and workflow definitions.

#### Example: Media Upload Step

Create `src/steps/UploadMediaStep.js`:

```javascript
class UploadMediaStep {
  async execute(config, input, context) {
    const { executionId, stepId } = context;
    
    console.log(`[${executionId}] Starting media upload`);
    
    // Validate input
    if (!input.file) {
      throw new Error("Missing required field: file");
    }
    
    // Call your existing backend service
    const response = await fetch('http://media-service/api/upload', {
      method: 'POST',
      body: JSON.stringify({
        file: input.file,
        maxSize: config.maxSizeMB * 1024 * 1024
      })
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // Return output for next step
    return {
      mediaId: result.id,
      url: result.url,
      format: result.format,
      uploadedAt: new Date().toISOString()
    };
  }
}

module.exports = UploadMediaStep;
```

**Step Handler Contract:**

- **Input:** `config` (static), `input` (dynamic), `context` (metadata)
- **Output:** Object passed to next step
- **Errors:** Throwing triggers retry logic
- **Idempotency:** Handlers should be idempotent when possible

#### Register the Handler

Edit `src/workers/stepRegistry.js`:

```javascript
const UploadMediaStep = require("../steps/UploadMediaStep");
const ValidateMediaStep = require("../steps/ValidateMediaStep");
const ProcessMediaStep = require("../steps/ProcessMediaStep");

module.exports = {
  UploadMediaStep,
  ValidateMediaStep,
  ProcessMediaStep
  // Add new handlers here
};
```

### Defining Workflows

Workflows are stored in MongoDB. Seed them via the API or database directly.

**Example: Social Media Post Workflow**

```json
{
  "name": "Instagram Post Workflow",
  "description": "Upload, validate, and publish social media content",
  "steps": [
    {
      "stepId": "upload_media",
      "handler": "UploadMediaStep",
      "config": {
        "maxSizeMB": 10,
        "allowedTypes": ["image/jpeg", "image/png"]
      }
    },
    {
      "stepId": "validate_media",
      "handler": "ValidateMediaStep",
      "config": {
        "minWidth": 1080,
        "minHeight": 1080
      }
    },
    {
      "stepId": "publish_post",
      "handler": "PublishPostStep",
      "config": {
        "platform": "instagram",
        "visibility": "public"
      }
    }
  ]
}
```

**Workflow Properties:**

- `name`: Human-readable identifier
- `description`: Purpose documentation
- `steps`: Array of step definitions (executed in order)
  - `stepId`: Unique identifier within workflow
  - `handler`: Class name from step registry
  - `config`: Static configuration passed to handler
  - `retryPolicy`: Retry behavior for this step

### Triggering Executions

Start a workflow execution from any backend service:

**Request:**

```bash
POST /executions/:workflowId/start
Content-Type: application/json

{
    "file": "media/photo.jpg",
    "caption": "Beautiful sunset 🌅",
    "userId": "user_123"

}
```

**Response:**

```json
{
  "executionId": "6953ad856fcc2fac52c0f188",
  "workflowId": "6953ad706fcc2fac52c0f182",
  "status": "RUNNING",
  "input": {
    "file": "media/photo.jpg",
    "caption": "Beautiful sunset 🌅",
    "userId": "user_123"
  },
  "createdAt": "2025-12-30T10:46:29.574Z",
  "updatedAt": "2025-12-30T10:46:29.574Z"
}
```

---



**Status Progression:**

1. `PENDING` → Execution created, waiting to start
2. `RUNNING` → Worker processing steps
3. `SUCCESS` → All steps completed successfully
4. `FAILED` → One or more steps failed after retries
5. `PAUSED` → Manually paused, can be resumed

---

## Failure Handling & Retries

### Retry Boundaries

Each step maintains its boundary (currently its static 3 retries , will be dynamic soon). Failed steps **block** all downstream steps until resolved.

**Example Scenario:**

```
Step 1: Upload     [SUCCESS] ✓
Step 2: Validate   [FAILED]  ✗ (attempt 1/3)
Step 3: Process    [BLOCKED] ⏸  (waiting for step 2)
```

After retry:

```
Step 1: Upload     [SUCCESS] ✓
Step 2: Validate   [SUCCESS] ✓ (attempt 2/3)
Step 3: Process    [RUNNING] ▶
```
<!-- 
### Retry Configuration

```javascript
{
  "stepId": "payment_processing",
  "handler": "PaymentStep",
  "retryPolicy": {
    "maxRetries": 3,        // Total retry attempts
    "retryDelayMs": 5000,   // Delay between retries
    "backoffMultiplier": 2  // Exponential backoff (optional)
  }
}
```

**Retry Behavior:**

- Attempt 1: Immediate
- Attempt 2: After 5000ms
- Attempt 3: After 10000ms (with backoff)
- Attempt 4: After 20000ms (with backoff) -->

### Error Handling Best Practices

**In Step Handlers:**

```javascript
class RobustPaymentStep {
  async execute(config, input, context) {
    try {
      // Attempt operation
      const result = await paymentService.charge(input.amount);
      return result;
      
    } catch (error) {
      // Log for debugging
      console.error(`[${context.executionId}] Payment failed:`, error);
      
      // Distinguish between retryable and non-retryable errors
      if (error.code === 'INSUFFICIENT_FUNDS') {
        // Non-retryable: throw immediately
        throw new Error('Non-retryable: Insufficient funds');
      }
      
      // Retryable: throw to trigger retry
      throw error;
    }
  }
}
```

---

## Crash Recovery

The engine is designed for resilience in distributed environments.

### Recovery Process

**On Worker Startup:**

1. Query for executions with `status: RUNNING`
2. Check for steps stuck in `RUNNING` state
3. Reset stuck steps to `PENDING`
4. Resume execution from last known good state

**Example:**

```
Before Crash:
- Step 1: SUCCESS
- Step 2: RUNNING  ← Worker crashed here
- Step 3: PENDING

After Recovery:
- Step 1: SUCCESS  (unchanged)
- Step 2: PENDING  (reset)
- Step 3: PENDING  (unchanged)
```

### Preventing Data Loss

- All state changes persisted to MongoDB **before** execution
- Redis locks expire automatically (default: 5 minutes)
- Workers poll for stuck executions every 30 seconds

---

## AI Observability

AI analysis runs **only after** execution completes. It never influences runtime behavior.

### What AI Analyzes

- Overall execution outcome
- Step performance and retry patterns
- Root cause of failures
- Reliability insights

### Getting Analysis

**Request:**

```bash
GET /ai/analysis/:executionId
```

**Response:**

```json
{
 "data": [ 
	{
    "_id": "6953ad8eec713a0f9ea5bedb",
    "executionId": "6953ad856fcc2fac52c0f188",
    "__v": 0,
    "createdAt": "2025-12-30T10:46:38.510Z",
    "stepInsights": "Overall Outcome\nThe workflow execution concluded with a FAILED status.\n\nStep Analysis\nThe `publish_post` step completed successfully on its first attempt. The `upload_media` step also completed successfully on its first attempt. The `validate_media` step failed after four attempts due to an invalid media format.\n\nFailure Analysis\nThe workflow stopped at the `validate_media` step. This step repeatedly failed with an \"Invalid media format\" error, leading to the overall workflow failure.\nreason: Invalid media format\n\nReliability Notes\nThe `validate_media` step attempted to recover through retries but consistently encountered the same error, indicating a persistent issue with the provided media.",
    "summary": "Overall Outcome\nThe workflow execution concluded with a FAILED status.\n\nStep Analysis\nThe `publish_post` step completed successfully on its first attempt. The `upload_media` step also completed successfully on its first attempt. The `validate_media` step failed after four attempts due to an invalid "
	}
   ]
}
```

### AI Limitations

- **Cannot:** Retry steps, modify state, change execution flow
- **Can:** Provide insights, identify patterns, suggest improvements

---

## Real-World Integration

### Example: E-Commerce Order Processing

**Existing Architecture:**

```
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│ Inventory       │   │ Payment         │   │ Notification    │
│ Service         │   │ Service         │   │ Service         │
│ :8001           │   │ :8002           │   │ :8003           │
└─────────────────┘   └─────────────────┘   └─────────────────┘
```

**With Workflow Engine:**

```
                    ┌─────────────────────┐
                    │ Workflow Engine     │
                    │ Orchestrates:       │
                    │ 1. Reserve Inventory│
                    │ 2. Process Payment  │
                    │ 3. Send Notification│
                    └──────────┬──────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        ▼                      ▼                      ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│ Inventory       │   │ Payment         │   │ Notification    │
│ Service         │   │ Service         │   │ Service         │
└─────────────────┘   └─────────────────┘   └─────────────────┘
```

### Implementation

**Step 1: Reserve Inventory**

```javascript
// src/steps/ReserveInventoryStep.js
const axios = require("axios");

class ReserveInventoryStep {
  async execute(config, input, context) {
    const response = await axios.post(
      "http://inventory-service:8001/internal/reserve",
      {
        orderId: input.orderId,
        items: input.items
      },
      { timeout: 10000 }
    );
    
    return {
      reservationId: response.data.reservationId,
      expiresAt: response.data.expiresAt
    };
  }
}

module.exports = ReserveInventoryStep;
```

**Step 2: Process Payment**

```javascript
// src/steps/ProcessPaymentStep.js
const axios = require("axios");

class ProcessPaymentStep {
  async execute(config, input, context) {
    const response = await axios.post(
      "http://payment-service:8002/internal/charge",
      {
        orderId: input.orderId,
        amount: input.amount,
        paymentMethod: input.paymentMethod
      },
      { timeout: 15000 }
    );
    
    return {
      transactionId: response.data.transactionId,
      status: response.data.status
    };
  }
}

module.exports = ProcessPaymentStep;
```

**Step 3: Send Notification**

```javascript
// src/steps/SendNotificationStep.js
const axios = require("axios");

class SendNotificationStep {
  async execute(config, input, context) {
    await axios.post(
      "http://notification-service:8003/internal/send",
      {
        userId: input.userId,
        type: "order_confirmation",
        data: {
          orderId: input.orderId,
          transactionId: input.transactionId
        }
      },
      { timeout: 5000 }
    );
    
    return { notified: true };
  }
}

module.exports = SendNotificationStep;
```

### Triggering from Existing Backend

```javascript
// In your existing order service
const createOrder = async (req, res) => {
  const order = await Order.create(req.body);
  
  // Trigger workflow
  await axios.post('http://workflow-engine:3000/executions/start', {
    workflowId: 'order_fulfillment_workflow_id',
    input: {
      orderId: order.id,
      userId: order.userId,
      items: order.items,
      amount: order.total,
      paymentMethod: order.paymentMethod
    }
  });
  
  res.json({ orderId: order.id, status: 'processing' });
};
```

---

## API Reference

### Executions

#### Create Execution

```http
POST /executions/:workflowId/run
Content-Type: application/json

{
  "input": {}
}
```

#### Get All Executions

```http
GET /executions/
```

#### Get Execution Status

```http
GET /executions/:executionId
```

#### Get Step Details

```http
GET /executions/execution/:executionId/steps
```

#### Pause Execution

```http
POST /executions/:executionId/pause
```

#### Resume Execution

```http
POST /executions/:executionId/resume
```

### AI Analysis

#### Get Execution Analysis

```http
GET /ai/analysis/:executionId
```

### Health Check

```http
GET /health
```

---

## Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Runtime** | Node.js 20+ | JavaScript execution environment |
| **API Framework** | Express.js | REST API server |
| **Database** | MongoDB | Persistent state storage |
| **Cache/Locks** | Redis | Distributed locking |
| **Container** | Docker | Service isolation |
| **Orchestration** | Docker Compose | Multi-container management |
| **AI** | Google Gemini API | Post-execution analysis |

---

## Monitoring & Debugging

### Viewing Logs

**API Server logs:**
```bash
docker-compose logs -f api
```

**Worker logs:**
```bash
docker-compose logs -f worker
```

**All services:**
```bash
docker-compose logs -f
```

### Database Access

**MongoDB:**
```bash
docker exec -it workflow-engine-mongo mongosh workflow_engine

# Query executions
db.executions.find().pretty()

# Query steps
db.stepexecutions.find({ executionId: "..." }).pretty()
```

**Redis:**
```bash
docker exec -it workflow-engine-redis redis-cli

# View locks
KEYS lock:*

# Check lock TTL
TTL lock:execution:abc123
```

### Key Metrics to Monitor

- **Execution Success Rate:** `SUCCESS / (SUCCESS + FAILED)`
- **Average Execution Duration:** Time from start to completion
- **Step Retry Rate:** Retries / Total attempts
- **Lock Contention:** Failed lock acquisitions
- **Crashed Executions:** Executions recovered on startup


---

## Contributing

We welcome contributions! Please follow these guidelines:

### Adding New Workflows

1. Create step handler files in `src/steps/`
2. Register handlers in `src/workers/stepRegistry.js`
3. Define workflow in MongoDB
4. Document usage in `docs/workflows/`

### Code Standards

- **Linting:** Follow existing ESLint configuration
- **Naming:** Use descriptive class and variable names
- **Error Handling:** Always handle errors explicitly
- **Logging:** Include `executionId` in all logs

### Pull Request Process

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-workflow`
3. Commit changes: `git commit -m 'Add order fulfillment workflow'`
4. Push to branch: `git push origin feature/new-workflow`
5. Open pull request with detailed description

---


## Project Status

- ✅ **Core Engine:** Production-ready
- ✅ **Deterministic Execution:** Fully implemented
- ✅ **Crash Recovery:** Tested and verified
- ✅ **Distributed Locking:** Redis-based, production-tested
- ✅ **AI Observability:** Gemini integration complete
- ✅ **Docker Deployment:** Compose configuration ready

**Ready for production use. Actively maintained.**

---

## Support

- **Documentation:** [docs/](docs/)
- **Issues:** [GitHub Issues](https://github.com/your-username/workflow-engine/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-username/workflow-engine/discussions)

---

**Built with ❤️ for reliable backend orchestration**