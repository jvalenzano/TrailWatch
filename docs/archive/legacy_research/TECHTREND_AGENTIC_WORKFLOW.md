# The TechTrend Agentic Workflow

## The Mandate

**AI is an Amplifier, Not an Answer.**

DORA 2025 research shows AI magnifies the strengths of high-performing organizations and the dysfunctions of struggling ones. We must treat AI adoption as a systems transformation.

### A Paradigm Shift: From Coder to Coach

We are moving from manually writing code to architecting solutions and delegating implementation tasks to AI agents.

### Strategic Directive: Lean into Google Cloud

Leadership has mandated a strategic focus on GCP to build a differentiated AI practice and strengthen our Google Cloud Partnership.

### The Competitive Opportunity

We can differentiate in the federal market by demonstrating agents that take action, not just answer questions, and by offering clear pathways to production.

---

## The Context (GEMINI.md)

**GEMINI.md: The Agent's "Long-Term Memory"**

A persistent, version-controlled file in every project's root directory that provides project memory and shapes every agent interaction.

### Step 1: Define Architecture and Tech Stack
Specify key components, data flow, languages (Python 3.11), and required GCP services like Cloud Run and Vertex AI.

### Step 2: Set Coding Standards and Conventions
Document rules for style (PEP 8), naming conventions, and project structure to ensure consistent AI-generated code.

### Step 3: Establish Constraints and Anti-Patterns
Provide explicit "Do Not" instructions, like avoiding PII, hardcoded secrets, or bypassing authentication, to guide safe agent behavior.

---

## The Flow (Conductor)

**The Philosophy: "Measure twice, code once."**

Conductor is a Gemini CLI extension that enforces a structured workflow, preventing a dive into coding without clear direction.

### Phase 1: Context (Gather and Define)
Use `/conductor:setup` to gather project requirements and define user needs in persistent `product.md` and `tech_stack.md` files.

### Phase 2: Spec and Plan (Architect and Plan)
Use `/conductor:newTrack` to generate detailed specifications (`spec.md`) and an actionable, phased implementation plan (`plan.md`) for AI to follow.

### Phase 3: Implement (Build and Verify)
Use `/conductor:implement` to have the AI agent execute the plan, write code, run tests, and pause for human verification at key phase boundaries.

---

## The Build (ADK)

**ADK: The Framework for Production Agents.**

The Agent Development Kit (ADK) is our standard for building customer-facing, production-ready AI agents on Google Cloud.

### ADK for Production, Gemini CLI for Development

| Use Case | Tool |
|----------|------|
| Scalable, observable customer deployments | ADK |
| Internal, interactive development and prototyping | Gemini CLI |

### Code-First and GCP Native

ADK allows defining agent logic, tools, and orchestration in code (Python) with direct deployment to Cloud Run and native Vertex AI integration.

### Enables Multi-Agent Systems

Build complex workflows using hierarchical patterns where a primary agent orchestrates specialized sub-agents.

---

## The Metric (DORA)

**The DORA Warning: AI Increases Instability.**

AI adoption increases development speed (throughput) but also risks system instability. We must measure and manage both.

### Throughput Metrics (How Fast We Go)
We track Lead Time for Changes and Deployment Frequency to measure velocity from concept to prototype.

### Stability Metrics (How Reliable We Are)
We track Change Failure Rate and Failed Deployment Recovery Time to ensure speed doesn't compromise quality.

### Goal: Harmonious High-Achiever

DORA research shows 20% of teams achieve high speed AND high stability. This sustainable, low-burnout model is our target.

---

*Source: TechTrend AI Factory Team, January 2026*