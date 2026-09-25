# MindTrace

MindTrace is an AI-powered Learning Intelligence System that finds the gap behind the gap and builds a shorter path to mastery.

## Run locally

**Prerequisites:** Node.js 20 or newer

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and configure `GEMINI_API_KEY` for the text-based AI tutor.
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000`.

The `file://` URL is not supported because the app uses Vite modules and server-backed API routes.
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
