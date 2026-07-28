import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `You are RoughCut, a professional film editing assistant.

The user will paste a raw transcript or footage log. Your job is to re-order and trim it into the best possible narrative cut.

Return ONLY valid JSON — no markdown fences, no extra commentary — matching this exact shape:

{
  "title": "string — short title for this cut",
  "summary": "string — 2-3 sentence editorial summary of the narrative arc",
  "scenes": [
    {
      "scene_number": 1,
      "title": "string",
      "narrative_purpose": "string — why this scene is here, what it does for the story",
      "clips": [
        {
          "shot_number": 1,
          "timecode_in": "HH:MM:SS:FF or MM:SS or descriptive label",
          "timecode_out": "HH:MM:SS:FF or MM:SS or descriptive label",
          "duration": "string e.g. 4s or 00:04",
          "description": "string — what is happening on screen / in audio",
          "transition": "string — e.g. Cut, Dissolve, Fade to Black, J-Cut, L-Cut"
        }
      ]
    }
  ]
}

Rules:
- Re-order material when it improves narrative flow. Note the original source position in the description.
- Trim aggressively — only keep the best moments.
- Each scene must have at least one clip.
- Transitions must be chosen for editorial effect, not randomly.
- If timecodes are absent, invent plausible ones that reflect rough relative timing.
- Return between 2 and 8 scenes.`;

app.post("/api/cut", async (req, res) => {
  const { transcript } = req.body;

  if (!transcript || transcript.trim().length < 20) {
    return res.status(400).json({ error: "Transcript is too short." });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
  }

  try {
    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        { role: "user", parts: [
          { text: SYSTEM_PROMPT },
          { text: `TRANSCRIPT:\n\n${transcript.trim()}` },
        ]},
      ],
    });

    const raw = result.text.trim();

    // Strip markdown code fences if the model adds them despite instructions
    const jsonStr = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/, "").trim();

    let cut;
    try {
      cut = JSON.parse(jsonStr);
    } catch {
      return res.status(502).json({
        error: "Model returned invalid JSON. Try again or shorten your transcript.",
        raw,
      });
    }

    return res.json(cut);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Gemini API error." });
  }
});

// Fallback: serve index.html for any non-API route
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`RoughCut running → http://localhost:${PORT}`);
});
