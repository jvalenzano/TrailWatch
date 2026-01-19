# Concepts

Technology primers for TrailWatch developers. Each document explains a key technology or framework: what it is, why TrailWatch needs it, and how we use it.

## Guidelines

- Keep documents under 500 words
- Focus on why it matters to TrailWatch, not exhaustive documentation
- Include practical examples relevant to our codebase
- Link to official docs for deep dives
- Reference related ADRs and project specs where applicable

## Contents

| Document | Description |
|----------|-------------|
| [postgis.md](postgis.md) | Spatial database extension for GPS validation against USFS trail geometry |
| [tracs-overview.md](tracs-overview.md) | USFS trail assessment framework our output schemas align to |
| [vertex-ai-agents.md](vertex-ai-agents.md) | Google ADK framework powering our AI agents |

## Adding New Concepts

When introducing a technology that teammates may not know, add a primer here. Good candidates:

- Technologies central to our architecture
- Domain-specific frameworks (government, GIS, forestry)
- Tools that require context to use effectively

Use the existing documents as templates. Start with "what it does," explain "why TrailWatch needs it," then cover practical usage and key gotchas.
