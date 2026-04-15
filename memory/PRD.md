# RDSL Pickup Comparison Player - PRD

## Original Problem Statement
Build a web widget hosting audio tracks with synced playhead, dark boutique aesthetic. Evolved into a professional guitar pickup comparison tool with accordion layout for Shopify embedding.

## Architecture
- Pure frontend React app (no backend needed)
- JSON-based tracksets loaded from /public/tracksets/
- URL parameter driven (?set=name)
- Shadcn UI components (Accordion)

## User Personas
- **Admin (RDSL)**: Manages tracksets via JSON files, embeds on Shopify
- **Viewer (Customer)**: Compares pickup tones using A/B switching

## Core Requirements
- Synced playhead across all position/pickup switches
- Grouped accordion layout (pickup → Neck/Middle/Bridge)
- Strict palette: White, Black, Red (#d62028)
- RDSL branding with Shopify CDN logo + SVG fallback
- Keyboard shortcuts for pro workflow
- Volume control for level matching
- Loop mode for repetitive comparison
- Reset to defaults

## What's Been Implemented (April 2026)
- [x] Accordion layout with collapsible pickup groups
- [x] Neck/Middle/Bridge position buttons with red glow
- [x] Synced playhead preservation across all switches
- [x] RDSL logo from Shopify CDN with inline SVG fallback
- [x] Transport controls (play/pause, loop, reset)
- [x] Progress bar with seeking
- [x] Volume control slider
- [x] Keyboard shortcuts (Space, N/M/B, Up/Down, L/R, 1-9)
- [x] Default "Coming Soon" screen
- [x] Error handling for missing tracksets
- [x] Configurable via /public/config.json
- [x] Two example tracksets (red-house, modern-series)
- [x] 100% test pass rate

## Prioritized Backlog
- P1: Real audio samples (replace placeholder SoundHelix tracks)
- P2: Waveform visualization
- P3: A-B section looping (loop specific time range)

## Next Tasks
- Upload real guitar pickup audio samples
- Create production trackset JSONs
- Deploy and embed in Shopify product pages
