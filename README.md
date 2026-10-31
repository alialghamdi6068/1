# Ali Studio Discord Setup Bot

A tailored setup bot for **Ali Studio**, a programming and technology community. This is not a generic gaming server or an editing/creator template.

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
- **Ali Studio Info** — welcome, announcements, rules, information, roles
- **Community** — chat, bot commands, questions, suggestions, showcase
- **Programming** — coding, Python, Java, web development, tools, code review
- **Minecraft Clients** — Lunar Client, Badlion Client, Feather Client, PvP
- **Support** — tickets, Premium support, client support, FAQ
- **Voice** — general, coding, gaming
- **Staff Rooms** — private staff chat, logs, development room

## Welcome system\n\nThe `/welcome` command group configures a per-server welcome embed. Settings are stored in SQLite at `data/ali-studio.sqlite` and survive restarts. The embed uses the joining member's own avatar and live server member count.\n\nAvailable commands: `/welcome setup`, `/welcome channel`, `/welcome title`, `/welcome message`, `/welcome color`, `/welcome footer`, `/welcome count`, `/welcome preview`, `/welcome test`, `/welcome settings`, `/welcome enable`, and `/welcome disable`. Text supports `{user}`, `{username}`, `{server}`, and `{member_count}`.\n\nEnable the **Server Members Intent** in the Discord Developer Portal (Bot → Privileged Gateway Intents) so join events are delivered. Keep the `data/` directory persistent when hosting and back it up with the bot.\n\n## Requirements
- Node.js 20.11 or newer
- Discord bot with Manage Roles, Manage Channels, View Channels, and Send Messages permissions
- Place the bot's highest role above the roles it creates

## Setup
1. Create a bot in the Discord Developer Portal and invite it with the `bot` and `applications.commands` scopes.
2. Copy `.env.example` to `.env` and set `DISCORD_TOKEN`, `CLIENT_ID`, and `GUILD_ID`.
3. Run `npm install`.
4. Run `npm run deploy`.
5. Run `npm start`.
6. Run `/setup` with **Preview only** before choosing **Create Ali Studio layout**.

## Commands
- `/setup` — preview or create the configured roles and channels.
- `/ali-studio-status` — check the bot status.\n- `/welcome ...` — configure the welcome embed.

The setup skips matching existing items and does not delete channels or roles. It does not assign paid/community roles to members automatically. Never commit `.env` or share the bot token.
