import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { WebSocketServer, WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const server = http.createServer(app);

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      liveModel: "gemini-3.8-live"
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

  // WebSocket Server for Gemini Live API real-time voice conversations
  const wss = new WebSocketServer({ server, path: "/api/live-ws" });

  wss.on("connection", async (clientWs: WebSocket) => {
    console.log("[Live API] Client connected to voice stream");

    let session: any = null;

    try {
      const ai = getAIClient();

      session = await ai.live.connect({
        model: "gemini-3.8-live",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction:
            "You are the MindTrace Voice AI Tutor. You help computer science students master Data Structures, Algorithms, and concept fundamentals through interactive Socratic dialogue. Help them identify the 'gap behind the gap' in their mental models. Keep your spoken responses concise, conversational, engaging, and clear.",
        },
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            try {
              // Extract audio payload
              const audio =
                message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
              if (audio && clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(JSON.stringify({ type: "audio", audio }));
              }

              // Extract text transcription if provided by the model turn
              const textPart =
                message.serverContent?.modelTurn?.parts?.[0]?.text;
              if (textPart && clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(JSON.stringify({ type: "text", text: textPart }));
              }

              // Handle model interruption when student speaks over
              if (message.serverContent?.interrupted && clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(JSON.stringify({ type: "interrupted", interrupted: true }));
              }

              // Turn complete marker
              if (message.serverContent?.turnComplete && clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(JSON.stringify({ type: "turnComplete", turnComplete: true }));
              }
            } catch (err) {
              console.error("[Live API] Error forwarding message to client:", err);
            }
          },
          onclose: () => {
            console.log("[Live API] Gemini session closed");
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ type: "status", status: "session_closed" }));
            }
          },
          onerror: (err: any) => {
            console.error("[Live API] Gemini session error:", err);
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(
                JSON.stringify({
                  type: "error",
                  error: err?.message || "Live API session encountered an error"
                })
              );
            }
          }
        },
      });

      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(
          JSON.stringify({
            type: "status",
            status: "ready",
            model: "gemini-3.8-live"
          })
        );
      }
    } catch (err: any) {
      console.error("[Live API] Failed to connect to Gemini Live:", err);
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(
          JSON.stringify({
            type: "error",
            error:
              err?.message ||
              "Could not initialize gemini-3.8-live session. Please verify your GEMINI_API_KEY."
          })
        );
      }
      return;
    }

    clientWs.on("message", (data: any) => {
      try {
        const payload = JSON.parse(data.toString());
        if (!session) return;

        if (payload.type === "audio" && payload.audio) {
          session.sendRealtimeInput({
            audio: {
              data: payload.audio,
              mimeType: "audio/pcm;rate=16000",
            },
          });
        } else if (payload.type === "text" && payload.text) {
          session.sendRealtimeInput({
            text: payload.text,
          });
        }
      } catch (err) {
        console.error("[Live API] Error processing client message:", err);
      }
    });

    clientWs.on("close", () => {
      console.log("[Live API] Client disconnected, closing session");
      if (session) {
        try {
          session.close();
        } catch (e) {
          // ignore
        }
      }
    });
  });

  // Text-based Socratic AI Tutor fallback API route
  app.post("/api/tutor/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      const ai = getAIClient();

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
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
