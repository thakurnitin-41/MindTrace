# MindTrace

MindTrace is an AI-powered Learning Intelligence System that finds the gap behind the gap and builds a shorter path to mastery.

## Run locally

**Prerequisites:** Node.js 20 or newer

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and configure `GEMINI_API_KEY` for AI tutor and live voice features.
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000`.

The `file://` URL is not supported because the app uses Vite modules and server-backed API/WebSocket routes.

## Validation

```bash
npm run lint
npm run build
```
