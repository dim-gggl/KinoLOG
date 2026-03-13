# KinoLOG

> Analyze video content. Build generation prompts.

A Gemini-powered terminal-aesthetic tool for video intelligence. Two modes:
- **Ingest** — analyze a video and extract structured metadata (description, themes, mood, visual language)
- **Build** — use that metadata to craft a precise prompt for video/image generation

Export as JSON, Markdown, or plain text.

## Features

- 📥 Ingest mode: video content analysis via Gemini
- 🔨 Build mode: structured prompt builder from video metadata
- 💾 Export to JSON / Markdown / text
- 🖤 Dark terminal UI

## Stack

React · TypeScript · Vite · Gemini API

## Run locally

**Prerequisites:** Node.js, a Gemini API key

```bash
npm install
cp .env.local.example .env.local  # add your GEMINI_API_KEY
npm run dev
```

## Live demo

[Open in AI Studio](https://ai.studio/apps/2b6e85e6-22e4-483f-845e-c353355bb2e5)
