# MindTrace

MindTrace is an AI-powered Learning Intelligence System that finds the gap behind the gap and builds a shorter path to mastery.

## Run locally

**Prerequisites:** Node.js 20 or newer

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and configure `GEMINI_API_KEY` for AI tutor and live voice features. The voice bridge uses `GEMINI_LIVE_MODEL` and defaults to Google's native-audio Live model.
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000`.

The `file://` URL is not supported because the app uses Vite modules and server-backed API/WebSocket routes.
Live Voice is not available on the static GitHub Pages URL by itself because it requires the Express/WebSocket backend. Use the local server or deploy `server.ts`.
If port 3000 is already in use, start MindTrace on another port:

```powershell
$env:PORT = "3002"
npm run dev
```

## Validation

```bash
npm run lint
npm run build
```
