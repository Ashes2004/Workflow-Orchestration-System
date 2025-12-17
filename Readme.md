# Deterministic Workflow Orchestration Engine (Backend)

This project is a **backend-only workflow orchestration system** designed to execute multi-step tasks in a **deterministic, reliable, and crash-safe** manner.

The system focuses on **execution control**, **state tracking**, and **failure recovery**, while keeping business logic decoupled from orchestration logic.

AI is used **only for observability and analysis**, never for execution control.

---

## Why This Project Exists

In real backend systems, many operations are not single actions.  
Examples include:
- Media upload and processing
- Payment handling
- Email delivery pipelines
- Data processing jobs

These operations involve **multiple steps**, where:
- some steps may fail,
- retries must be handled safely,
- completed steps must not run again,
- execution must survive crashes or restarts.

This project addresses those problems by providing a **deterministic workflow engine** that tracks execution state persistently and enforces strict step order.

---

## Core Goals

- Execute workflows step-by-step in strict order
- Persist execution state to survive crashes
- Prevent duplicate execution using distributed locks
- Support safe retries with clear failure boundaries
- Keep execution logic deterministic and predictable
- Use AI only to analyze execution results and logs (read-only)

---

## Key Design Principles

- **Separation of Concerns**  
  Orchestration logic is separated from business logic.

- **Determinism First**  
  Execution decisions are based entirely on stored state.

- **Infrastructure Stability**  
  Workers and engine logic remain generic and reusable.

- **Pluggable Business Logic**  
  Service-specific logic is implemented as steps (handlers).

- **Safe AI Usage**  
  AI never influences execution flow or decisions.

---

## Core Concepts

- **Workflow**  
  A blueprint that defines ordered steps and configuration.

- **Execution**  
  One run of a workflow.

- **StepExecution**  
  Tracks state, retries, and errors for each step.

- **Engine**  
  Decides which step can run next based on state.

- **Worker**  
  Executes steps and updates execution state.

- **Steps (Handlers)**  
  Encapsulate service-specific logic.

---

## Tech Stack

- Node.js + Express
- MongoDB (source of truth)
- Redis (distributed locks and retry safety)
- Docker + Docker Compose
- JavaScript (no TypeScript)

---

## AI Usage

AI is used **only after execution completes** to:
- analyze logs and execution metadata,
- explain failures or performance issues,
- provide human-readable insights.

AI has **no control over execution**, retries, or state changes.

---

## Current Scope

- Backend-only system
- Single demo workflow for file processing
- Focus on correctness, reliability, and clarity
- Designed to be extended with additional workflows later

---

## Future Improvements (Planned)

- Workflow versioning
- Manual execution recovery tools
- Better observability dashboards
- More real-world service integrations

---

## Status

🚧 **Work in progress**  
This project is actively being built and refined.

More details, diagrams, and examples will be added as development progresses.
