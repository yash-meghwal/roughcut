# RoughCut — Project Context & Session Log

> **IMPORTANT FOR BOB:** Read this file at the START of every session. Update the "Current State", "Last Session", and "Roadmap" sections at the END of every session before closing. This saves the user coins by avoiding full project re-reads.

---

## What is RoughCut?

**RoughCut** is an AI film editing assistant web app built for [Agentic Cinema 2025](https://agentic-cinema.devpost.com). The user pastes a raw transcript or footage log, and the app uses Google Gemini to return a structured narrative cut sheet with scenes, timecodes, shot descriptions, and transitions.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Server | Node.js + Express (ESM, `"type": "module"`) |
| LLM | Google Gemini 2.0 Flash via `@google/genai` (official Google Cloud SDK) |
| Frontend | Vanilla HTML/CSS/JS — single file at `public/index.html` |
| Config | `dotenv` — `GEMINI_API_KEY` in `.env` |

---

## Project Structure

```
roughcut/
  server.js           ← Express API (/api/cut) + static file serving
  public/
    index.html        ← Full UI: input, rendering, export (dark theme)
  .env                ← GEMINI_API_KEY (not committed)
  .env.example        ← Template
  package.json        ← scripts: start, dev
  README.md           ← Full documentation
  CONTEXT.md          ← THIS FILE — Bob's memory across sessions
```

---

## Key Design Decisions

- **Single-file frontend** — all CSS and JS inline in `public/index.html`. No build step, no framework.
- **Dark cinema theme** — `#0d0d0f` bg, amber accent `#e8a020`, monospace timecodes.
- **Gemini prompt returns strict JSON** — server strips markdown fences defensively, parses, then forwards to client.
- **SDK**: Uses `@google/genai` v2 (`GoogleGenAI` class, `genAI.models.generateContent()`) — this is the accepted Google Cloud SDK for the hackathon.
- **Model**: `gemini-2.0-flash`
- **JSON shape** the model must return:
  ```json
  {
    "title": "string",
    "summary": "string",
    "scenes": [{
      "scene_number": 1,
      "title": "string",
      "narrative_purpose": "string",
      "clips": [{
        "shot_number": 1,
        "timecode_in": "string",
        "timecode_out": "string",
        "duration": "string",
        "description": "string",
        "transition": "string"
      }]
    }]
  }
  ```
- **Export** — JSON download and Markdown table download both implemented.
- **Sample footage log** — built-in "The Last Signal" arctic documentary sample.

---

## API

**`POST /api/cut`**
- Body: `{ "transcript": "..." }`
- Returns: the JSON cut sheet above
- Errors: 400 (too short), 500 (no API key / Gemini error), 502 (invalid JSON from model)

---

## Current State

- ✅ Full working app — server + UI complete
- ✅ Gemini 2.0 Flash integration via `@google/genai` SDK (hackathon-compliant)
- ✅ Scene cards with shot tables rendered in UI
- ✅ Export JSON + Export Markdown
- ✅ Sample footage log ("The Last Signal")
- ✅ Error handling (loading state, error box, disabled button)
- ✅ README.md complete
- ✅ Apache 2.0 LICENSE file added
- ✅ Pushed to GitHub: https://github.com/yash-meghwal/roughcut
- ✅ `node_modules` installed
- ❌ Not yet deployed (no live URL)
- ❌ No demo video yet

---

## Roadmap / Ideas (not yet built)

- [ ] Multiple cut style presets (e.g. "documentary", "thriller", "music video")
- [ ] History — save and reload previous cuts in localStorage
- [ ] Print / PDF export
- [ ] Timecode validation / calculator
- [ ] Drag-and-drop scene reordering in the UI
- [ ] Dark/light theme toggle
- [ ] Token/cost estimate display

---

## Session Log

### Session 1 — Initial build
- Created full project from scratch: `server.js`, `public/index.html`, `package.json`, `.env.example`, `README.md`
- Gemini 1.5 Flash integration with structured editorial prompt
- Dark cinema UI with scene cards, shot tables, transitions, export buttons
- Built-in sample footage log

### Session 2 — Context setup
- User noted coin cost of re-reading project each session
- Created `CONTEXT.md` (this file) as persistent memory for Bob
- Established convention: Bob reads this at session start, updates it at session end

### Session 3 — GitHub + Hackathon compliance
- Initialized git repo, created `.gitignore`, made initial commit
- Force-pushed to GitHub: https://github.com/yash-meghwal/roughcut
- Read full hackathon rules (Google Cloud Agentic Cinema Hackathon — IBM track)
- Contest period: July 27 – September 7, 2026. We started July 28 ✅
- Added Apache 2.0 `LICENSE` file (required for open source repo detection)
- Upgraded Gemini SDK from `@google/generative-ai` to `@google/genai` v2 (hackathon-accepted SDK)
- Upgraded model from `gemini-1.5-flash` to `gemini-2.0-flash`
- Pushed all changes to GitHub

---

## How to Run

```bash
cp .env.example .env   # add GEMINI_API_KEY
npm install
npm start              # → http://localhost:3000
```

---

## Hackathon Requirements Checklist (IBM Track)

| Requirement | Status |
|---|---|
| Built using IBM Bob | ✅ |
| Powered by Gemini (`@google/genai`) | ✅ |
| Public repo with open source license (Apache 2.0) | ✅ |
| Google Cloud SDK used at runtime | ✅ (`@google/genai`) |
| Newly created during contest period (July 27+) | ✅ (July 28) |
| Live hosted URL | ❌ TODO |
| Demo video (max 3 min, YouTube/Vimeo) | ❌ TODO |
| Devpost submission | ❌ TODO |

## Notes / Constraints

- `package.json` uses `"type": "module"` — all imports are ESM
- Node.js version: no specific requirement, but needs ESM support (Node 14+)
- Gemini model: `gemini-2.0-flash` via `@google/genai` v2 SDK
- API call: `genAI.models.generateContent({ model, contents })` → `result.text`
- `express.json` limit is `1mb` — sufficient for large transcripts
- Frontend uses `innerHTML` with an `esc()` sanitizer for XSS safety
- GitHub repo: https://github.com/yash-meghwal/roughcut
