# RoughCut 🎬

**AI Film Editing Assistant** — paste a raw transcript or footage log, get back a structured narrative cut sheet with scenes, timecodes, shot descriptions, and transitions.

Built for [Agentic Cinema 2025](https://agentic-cinema.devpost.com) using Google Gemini.

---

## Quick Start

```bash
# 1. Clone / enter the project
cd roughcut

# 2. Install dependencies
npm install

# 3. Set your Gemini API key
cp .env.example .env
# edit .env and add your GEMINI_API_KEY

# 4. Run
npm start
# → http://localhost:3000
```

## How it works

1. Paste a raw transcript, shot log, or scene notes into the text area
2. Click **Generate Cut Sheet**
3. The server sends your transcript to Gemini with a structured editorial prompt
4. Gemini re-orders and trims the material into the best narrative cut, returning JSON
5. The UI renders a **scene overview** + **shot-by-shot table** with timecodes and transitions
6. Export as **JSON** or **Markdown**

## Tech Stack

| Layer | Technology |
|---|---|
| Server | Node.js + Express |
| LLM | Google Gemini 1.5 Flash (`@google/generative-ai`) |
| Frontend | Vanilla HTML/CSS/JS (no framework) |
| Config | `dotenv` |

## Project Structure

```
roughcut/
  server.js          ← Express API (/api/cut) + static file serving
  public/
    index.html       ← Full UI: input, rendering, export
  .env               ← GEMINI_API_KEY (not committed)
  .env.example       ← Template
  package.json
  README.md
```

## API

**`POST /api/cut`**

Request body:
```json
{ "transcript": "your raw transcript text here" }
```

Response:
```json
{
  "title": "The Last Signal",
  "summary": "A 2-3 sentence editorial summary...",
  "scenes": [
    {
      "scene_number": 1,
      "title": "Isolation",
      "narrative_purpose": "Establishes the lone figure and remote setting...",
      "clips": [
        {
          "shot_number": 1,
          "timecode_in": "00:00:04:00",
          "timecode_out": "00:00:17:00",
          "duration": "13s",
          "description": "Aerial drone over arctic tundra at sunrise — establishes scale and isolation",
          "transition": "Dissolve"
        }
      ]
    }
  ]
}
```
