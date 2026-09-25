import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const configuredPort = Number(process.env.PORT || 3000);
  if (!Number.isInteger(configuredPort) || configuredPort < 1 || configuredPort > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
  }
  const PORT = configuredPort;
  const server = http.createServer(app);

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      textModel: process.env.GEMINI_TEXT_MODEL || "gemini-2.5-flash"
    });
  });

  // Lazy Gemini AI instance getter
  const getAIClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in environment variables.");
    }
    return new GoogleGenAI({ apiKey });
  };

  // Text-based Socratic AI Tutor fallback API route
  app.post("/api/tutor/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      const ai = getAIClient();

      const response = await ai.models.generateContent({
        model: process.env.GEMINI_TEXT_MODEL || "gemini-2.5-flash",
        contents: [
          ...(Array.isArray(history) ? history : []),
          { role: "user", parts: [{ text: message }] }
        ],
        config: {
          systemInstruction:
            "You are MindTrace's Socratic AI Tutor. When answering questions, guide the learner to uncover foundational misconceptions rather than giving flat answers.",
        }
      });

      res.json({ reply: response.text || "I am ready to help you trace your learning gap." });
    } catch (err: any) {
      console.error("Error in /api/tutor/chat:", err);
      res.status(500).json({ error: err?.message || "Failed to generate tutor response." });
    }
  });

  // Vite middleware in development vs static serving in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`MindTrace server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
