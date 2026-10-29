# Studio Discord Setup Bot

A tailored setup bot for **Studio**, a programming and technology community. This is not a generic gaming server or an editing/creator studio template.

## Role groups

### Staff
- 𝓞𝔀𝓷𝓮𝓻
- 𝓒𝓸-𝓞𝔀𝓷𝓮𝓻
- 𝓜𝓪𝓷𝓪𝓰𝓮𝓻
- 𝓓𝓮𝓿𝓮𝓵𝓸𝓹𝓮𝓻
- 𝓐𝓭𝓶𝓲𝓷
- 𝓜𝓸𝓭𝓮𝓻𝓪𝓽𝓸𝓻
- 𝓗𝓮𝓵𝓹𝓮𝓻

### Minecraft clients and community
- 𝓛𝓾𝓷𝓪𝓻 𝓒𝓵𝓲𝓮𝓷𝓽
- 𝓑𝓪𝓭𝓵𝓲𝓸𝓷 𝓒𝓵𝓲𝓮𝓷𝓽
- 𝓕𝓮𝓪𝓽𝓱𝓮𝓻 𝓒𝓵𝓲𝓮𝓷𝓽
- 𝓥𝓘𝓟
- 𝓟𝓻𝓮𝓶𝓲𝓾𝓶
- 𝓑𝓸𝓸𝓼𝓽𝓮𝓻
- 𝓨𝓸𝓾𝓣𝓾𝓫𝓮𝓻
- 𝓢𝓽𝓻𝓮𝓪𝓶𝓮𝓻
- 𝓜𝓮𝓶𝓫𝓮𝓻

## Categories
- **Studio Info** — welcome, announcements, rules, information, roles
- **Community** — chat, bot commands, questions, suggestions, showcase
- **Programming** — coding, Python, Java, web development, tools, code review
- **Minecraft Clients** — Lunar Client, Badlion Client, Feather Client, PvP
- **Support** — tickets, Premium support, client support, FAQ
- **Voice** — general, coding, gaming
- **Staff Rooms** — private staff chat, logs, development room

## Requirements
- Node.js 20.11 or newer
- Discord bot with Manage Roles, Manage Channels, View Channels, and Send Messages permissions
- Place the bot's highest role above the roles it creates

## Setup
1. Create a bot in the Discord Developer Portal and invite it with the `bot` and `applications.commands` scopes.
2. Copy `.env.example` to `.env` and set `DISCORD_TOKEN`, `CLIENT_ID`, and `GUILD_ID`.
3. Run `npm install`.
4. Run `npm run deploy`.
5. Run `npm start`.
6. Run `/setup` with **Preview only** before choosing **Create Studio layout**.

## Commands
- `/setup` — preview or create the configured roles and channels.
- `/studio-status` — check the bot status.

The setup skips matching existing items and does not delete channels or roles. It does not assign paid/community roles to members automatically. Never commit `.env` or share the bot token.
