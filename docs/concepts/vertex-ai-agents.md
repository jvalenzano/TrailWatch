# Vertex AI Agents (Google ADK)

Google's Agent Development Kit (ADK) is the framework we use to build AI agents on Vertex AI. It provides the orchestration layer for agents that can reason, use tools, and maintain conversation state.

## What It Does

ADK handles the infrastructure complexity of building agentic systems: prompt management, tool calling, conversation memory, and execution orchestration. You define your agent's capabilities (tools, instructions, model configuration), and ADK manages the reasoning loop that decides when to call tools, how to interpret results, and when to respond to the user.

## Why TrailWatch Uses It

We evaluated LangChain, LlamaIndex, and direct API calls before selecting ADK. The decision came down to:

1. **GCP-native**: No impedance mismatch with our Cloud Run, Cloud SQL, and Vertex AI stack. Authentication, logging, and monitoring work out of the box.

2. **Production-ready**: ADK is designed for deployed agents, not notebook experiments. It handles retries, timeouts, and error propagation cleanly.

3. **Tool-first design**: Our agents are primarily tool orchestrators (geocoding, trail lookup, hazard classification). ADK's tool calling is robust and well-documented.

4. **Gemini optimization**: ADK is tuned for Gemini models, which we're standardized on.

## Core Concepts

**Agent**: The top-level construct. Combines a model, system instructions, and tools into an executable unit. In TrailWatch, the Intake Agent is one agent; future phases may add Triage Agent, Dispatch Agent, etc.

**Tool**: A function the agent can call. Tools have schemas (input/output types) and implementations. Examples: `validate_gps_coordinates`, `lookup_trail_by_name`, `classify_hazard_type`.

**Session**: Maintains conversation state across multiple turns. Stores message history and any context the agent accumulates. Sessions can be persisted to Cloud SQL for multi-session continuity.

**Runner**: Executes the agent. Handles the model invocation, tool dispatch, and response assembly. You typically don't interact with it directly.

## Basic Agent Structure

```python
from google.adk import Agent, Tool

# Define a tool
@Tool
def validate_coordinates(lat: float, lon: float) -> dict:
    """Check if coordinates fall within USFS land boundaries."""
    # Implementation here
    return {"valid": True, "forest": "Shasta-Trinity"}

# Define the agent
intake_agent = Agent(
    model="gemini-2.0-flash",
    system_instruction="""You are the TrailWatch Intake Agent. 
    Your job is to collect trail condition reports from citizens 
    and structure them for ranger review.""",
    tools=[validate_coordinates],
)

# Run the agent
response = intake_agent.send_message(
    "There's a huge tree down on the Pacific Crest Trail near Etna Summit"
)
```

## TrailWatch Agent Architecture

```
┌─────────────────────────────────────────────────┐
│                  Intake Agent                    │
│  ┌───────────────────────────────────────────┐  │
│  │           System Instructions              │  │
│  │  - Collect report details                  │  │
│  │  - Validate location                       │  │
│  │  - Classify hazard type                    │  │
│  │  - Output TRACS-aligned structure          │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  ┌─────────────┐ ┌─────────────┐ ┌───────────┐  │
│  │ GPS         │ │ Trail       │ │ Hazard    │  │
│  │ Validator   │ │ Lookup      │ │ Classifier│  │
│  └─────────────┘ └─────────────┘ └───────────┘  │
│         │               │              │         │
└─────────┼───────────────┼──────────────┼─────────┘
          │               │              │
          ▼               ▼              ▼
    ┌──────────┐   ┌───────────┐  ┌───────────┐
    │ PostGIS  │   │ USFS      │  │ Gemini    │
    │ (Cloud   │   │ Geodata   │  │ (Vertex   │
    │  SQL)    │   │ Cache     │  │  AI)      │
    └──────────┘   └───────────┘  └───────────┘
```

## Tool Design Principles

1. **Single responsibility**: Each tool does one thing. `validate_coordinates` doesn't also look up trail names.

2. **Typed schemas**: Use Python type hints. ADK generates the schema the model sees from your function signature.

3. **Idempotent**: Tools should be safe to retry. The agent may call the same tool multiple times during reasoning.

4. **Informative errors**: Return structured error information the agent can reason about, not just exceptions.

## Session Persistence

For multi-turn conversations (citizen provides info over several messages), ADK sessions need persistence:

```python
from google.adk.sessions import CloudSQLSessionStore

session_store = CloudSQLSessionStore(
    connection_string="postgresql://...",
    table_name="agent_sessions"
)

# Sessions auto-persist after each turn
```

## Deployment on Cloud Run

ADK agents deploy as standard Cloud Run services. The agent handles HTTP requests, maintains sessions, and scales automatically:

```yaml
# service.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: intake-agent
spec:
  template:
    spec:
      containers:
        - image: gcr.io/trailwatch/intake-agent
          env:
            - name: GOOGLE_CLOUD_PROJECT
              value: trailwatch-prod
```

## Related Resources

- [Google ADK Documentation](https://cloud.google.com/vertex-ai/docs/generative-ai/agent-builder/adk)
- [Vertex AI Agent Builder](https://cloud.google.com/vertex-ai/docs/generative-ai/agent-builder/overview)
- GEMINI.md: Agent specifications and tool schemas

## TrailWatch Context

The Intake Agent is our first ADK agent, handling Phase 1 citizen report intake. Future agents (Triage, Dispatch, Verification) will follow the same patterns. See GEMINI.md for the Intake Agent's complete specification.
