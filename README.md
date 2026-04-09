# yt-karaoke-client

React + Vite frontend for the karaoke app.

## Requirements

- Node.js 20+
- npm
- The API server running from the `yt-karaoke-server` repo

## Install dependencies

```bash
npm install
```

## Environment variables

Create a `.env` file in the root of this repo:

```env
VITE_API_URL=http://localhost:3002/api
VITE_WEBHOOK_URL=http://localhost:3002
VITE_SITE_NAME=YT Karaoke
VITE_QOTD=Pick your first song
```

### Variable reference

- `VITE_API_URL`: Base URL for the server's REST API. Include the `/api` suffix.
- `VITE_WEBHOOK_URL`: Base URL for the Socket.IO server. Do not include `/api`.
- `VITE_SITE_NAME`: App title shown in the UI.
- `VITE_QOTD`: Subtitle / message shown in the UI.

## Run the app

Start the development server:

```bash
npm run dev
```

Vite runs with `--host`, so the app is available on your local network as well as on localhost.

## Other scripts

```bash
npm run build
npm run preview
npm run lint
```

## Typical local setup

1. Start the server from `yt-karaoke-server`.
2. Set `VITE_API_URL` to `http://localhost:3002/api`.
3. Set `VITE_WEBHOOK_URL` to `http://localhost:3002`.
4. Run `npm run dev`.
