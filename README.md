# Studio Server Setup

A Discord setup bot for a **creative Studio** — designed around a studio workspace, portfolio/showcase, collaboration, project rooms, and a private backstage area. It is intentionally **not** a generic gaming server template.

## What it creates

### Roles
- 𝓞𝔀𝓷𝓮𝓻
- 𝓢𝓽𝓾𝓭𝓲𝓸 𝓛𝓮𝓪𝓭
- 𝓐𝓻𝓽 𝓓𝓲𝓻𝓮𝓬𝓽𝓸𝓻
- 𝓓𝓮𝓼𝓲𝓰𝓷𝓮𝓻
- 𝓔𝓭𝓲𝓽𝓸𝓻
- 𝓓𝓮𝓿𝓮𝓵𝓸𝓹𝓮𝓻
- 𝓒𝓻𝓮𝓪𝓽𝓸𝓻
- 𝓜𝓮𝓶𝓫𝓮𝓻

### Categories and channels
- **STUDIO DESK** — welcome, announcements, studio guide, role selection
- **THE CREATIVE FLOOR** — studio chat, showcase, work in progress, ideas, collaborations
- **PROJECT ROOMS** — design, editing, development, resources
- **STUDIO LOUNGE** — Studio Lounge, Focus Room, Feedback Room voice channels
- **BACKSTAGE** — private staff room and staff logs

The setup command is safe to rerun: existing matching roles, categories, and channels are skipped. It does not delete or rename existing items. Review `/setup mode: Preview only` before applying.

## Requirements
- Node.js 20.11+
- A Discord application and bot
- Bot permissions: Manage Roles, Manage Channels, View Channels, Send Messages, Read Message History
- The bot's highest role must be above the roles it needs to manage.

## Configure and run
1. In the Discord Developer Portal, create a bot and copy its token.
2. Invite it to your Studio server with the permissions listed above and the `applications.commands` OAuth2 scope.
3. Copy `.env.example` to `.env`.
4. Fill in `DISCORD_TOKEN`, `CLIENT_ID`, and `GUILD_ID`.
5. Run `npm install`.
6. Run `npm run deploy` to register the slash commands.
7. Run `npm start`.
8. In Discord, run `/setup` with **Preview only** first. When the preview looks right, run it again with **Create Studio layout**.

## Commands
- `/setup mode: Preview only` — preview the layout without making changes.
- `/setup mode: Create Studio layout` — create missing Studio roles, categories, and channels.
- `/studio-status` — check that the bot is online.

## Security
- Never commit `.env` or share the bot token.
- The bot does not assign roles to members or grant the Owner role to anyone automatically.
- Existing category permissions are not overwritten.
