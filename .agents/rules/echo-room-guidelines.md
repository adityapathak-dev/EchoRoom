---
trigger: always_on
---

Project: EchoRoom — a media literacy hackathon demo.
Stack: Vite + React + TypeScript, Tailwind CSS (real config, not inline styles), recharts for charts.
Design tokens:
  background: #12151B, panel: #1A1F27, panel border: #262C36
  text: #D7DAE0, text-dim: #8B93A1
  amber (algorithm/dominant signal): #E8A33D
  teal (break-the-bubble/corrective signal): #3FBFAD
  red (low diversity warning): #D96C4A
  display font: Space Grotesk, mono font: IBM Plex Mono, body font: Inter
Color grammar is meaningful, not decorative: amber = "what the algorithm is feeding you", teal = "what it's hiding". Keep that consistent everywhere.
Never fake the ranking or diversity numbers with animation — every number shown must be computed from real state, because this gets demoed live to judges who will ask "is this actually reacting to me?"
Prefer small, pure, testable functions for ranking/diversity logic, separate from UI components.
Respect prefers-reduced-motion. Keep keyboard focus states visible.