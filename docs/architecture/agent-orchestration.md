# Agent Architecture (ADK)

The TrailWatch platform uses the Google Agent Development Kit (ADK) for agent orchestration, avoiding LangChain in favor of explicit definitions.

## Orchestrator Pattern

```mermaid
flowchart TD
    Orchestrator[TrailWatch Orchestrator Agent]
    
    subgraph Agents
        Intake[Intake Agent<br/>• Text extraction<br/>• TRACS mapping]
        Hazard[Hazard Classifier<br/>• Vision analysis<br/>• Confidence adjustment]
        Priority[Priority Agent<br/>• Ranking<br/>• Routing<br/>• Closure recommend]
    end

    subgraph Tools["Tools (Model Context Protocol - MCP)"]
        LookUp[mcp_trail_lookup<br/>Query Overpass/OSM]
        Snap[mcp_snap_engine<br/>PostGIS topology snapping]
        Classify[mcp_tracs_classifier<br/>Local Llama/Mistral]
        Weather[mcp_weather<br/>NOAA lookups]
    end

    Orchestrator --> Intake
    Orchestrator --> Hazard
    Orchestrator --> Priority

    Intake --> LookUp
    Intake --> Snap
    Hazard --> Classify
    Priority --> Weather
```

## Tool Definitions

- **mcp_trail_lookup**: Query Overpass/OSM for trailheads
- **mcp_snap_engine**: PostGIS topology snapping
- **mcp_tracs_classifier**: Local Llama/Mistral classification
- **mcp_weather**: NOAA weather lookups
