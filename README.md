# Studio Server Setup

A Discord setup bot designed for a creative Studio community — not a generic gaming/community server.

## Features
- Create a Studio-themed channel and category layout
- Create matching roles with restrained, coordinated colors
- Idempotent setup: skips existing categories, channels, and roles
- Preview setup plan before applying changes
- Secure configuration through environment variables

## Requirements
- Node.js 20+
- A Discord bot application with `Manage Channels`, `Manage Roles`, and `View Channels` permissions

## Setup
1. Copy `.env.example` to `.env` and set `DISCORD_TOKEN`, `CLIENT_ID`, and `GUILD_ID`.
2. Run `npm install`.
3. Run `npm run deploy`.
4. Run `npm start`.

Never commit `.env` or share your bot token.
