slug: discord
title: Live Translator for Discord
summary: Real-time translation built natively for Discord voice calls.
links:
  live: https://livecalltranslator.netlify.app
  contact: mailto:isiah.udofia@yale.edu
tags: [Discord API, Deepgram STT, WebSocket]
tone: navy
layout:
  hero: title + one-liner + buttons; chips under title optional
  body: left accordion (Problem, Constraints, Architecture, Reliability, Privacy & UI, Status/Next), right stack (tags/quick facts)
requirements:
- Accordion only one open at a time (vanilla JS).
- Reveal-on-scroll for cards/sections.
- Keep copy concise and professional; no fake stats. Use the live link.

Copy (sections):
Problem:
Cross-language voice chats stall when translation lags or sits outside Discord.

Constraints:
Low-latency, Discord-native, simple to read in chat, minimal cognitive overhead.

Architecture:
Discord voice → streaming STT (Deepgram) → translation → inline bot messages; optional captions overlay.

Reliability:
Graceful handling when voice streams drop; small retry/backoff on text events.

Privacy & UI:
No persistent storage of transcripts; clear inline messages; status indicator when bot is listening.

Status/Next:
Working demo with voice-to-text-to-translation loop; next steps: richer language coverage, latency profiling, and UX for per-channel opt-in.
