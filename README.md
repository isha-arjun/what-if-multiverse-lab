# WHAT IF? — Multiverse Lab

A fan-made alternate-reality sandbox where **every character can be paired with every event** in the current library.

## How the experiment engine works
1. Choose any character from the character library.
2. Choose any event from the full event library. Character selection does not restrict the event list.
3. Each event has its own dedicated decision options. Some important combinations also have custom overrides—for example, Iron Man + The Snap and Captain America + The Sokovia Accords.
4. The simulator calculates a hypothetical branch, causal chain and timeline telemetry.

Examples:
- **Iron Man + The Snap:** engineering-focused decisions about designing a safer reversal, attempting a rapid reversal, or asking the team to challenge the plan.
- **Captain America + The Sokovia Accords:** choices about independent oversight, refusing external control, or negotiating a rights-based compromise.
- **Deadpool + any event:** Deadpool can now be placed into any event in the library, not only Deadpool-focused scenarios.

## Features
- All characters × all events are selectable
- Dedicated event-specific decision sets across the full event library
- Special character/event decision overrides
- Rules-based consequence engine: stability, threat, alliance cohesion and technology
- Searchable character, event and location index
- Timeline comparison and saved experiments
- Responsive interface; no build tools, backend, API key or external dependency

## Run it
Open `index.html` in a modern browser. To publish with GitHub Pages, open the repository's **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/(root)`, then save.

## Fan-work notice
This is an unofficial, non-commercial fan-made project and is not affiliated with, endorsed by, or sponsored by Marvel or Disney. Character and franchise names belong to their respective rights holders. Scenario descriptions and simulation logic are original. The project does not reproduce official scripts, dialogue or story text.

## Intelligence Studio

The project now includes a persistent, AI-inspired simulation layer in `intelligence.js`.

### What it adds
- **Relationship intelligence:** estimates character compatibility using known relationship patterns and shared character traits.
- **Free-text decisions:** enter a decision in your own words. A transparent intent parser classifies broad strategies such as rescue, negotiation, research, engineering, confrontation, deception and containment.
- **Causal state:** decisions update timeline stability, threat, alliance trust, resources and knowledge.
- **Persistent memory:** the active timeline and its decision history are saved in browser local storage.
- **Branching realities:** save named snapshots, load them later and continue from their saved world state.
- **Timeline analysis:** ask questions about motivations, relationships and current consequences; compare alternative strategies from the same current state.

### Important distinction: AI-inspired vs. a real language model
The current project remains a static, dependency-free website. Its Intelligence Studio uses deterministic rules and procedural narrative logic; it does **not** call a machine-learning model or an external LLM. This keeps the app free to run and avoids exposing API keys in browser code.

A real generative-AI connection should be added through a secure server-side endpoint (for example, a small backend that keeps provider credentials private). The model should narrate and explain possibilities, while the deterministic simulation remains authoritative for world state and consequences.
