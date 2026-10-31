# Ali Studio Discord Bot

A Discord community bot for **Ali Studio** with server setup, welcome messages, private tickets, moderation, logs, suggestions, automatic member roles, and announcements.

## Included systems

- **Server setup:** creates the configured staff/community roles and channel categories. Preview is available before applying; existing channels and roles are not deleted.
- **Welcome:** customizable embed, member avatar, member count, channel selection, preview and test.
- **Tickets:** private ticket channels, owner close, staff reopen/delete, sequential ticket numbers, and transcript export to the configured log channel.
- **Moderation:** ban, kick, timeout, warn, purge, and member case history.
- **Logs:** message edit/delete and member join/leave events, plus moderation case logging.
- **Suggestions:** member submissions, persistent upvote/downvote buttons, and vote totals.
- **Autorole:** automatically assigns one configured role to new human members.
- **Announcements:** staff can publish a formatted embed to a selected text channel.

All persistent bot data is stored in `data/ali-studio.sqlite`. Keep the `data/` directory persistent and include it in your backup routine.

## Slash commands

| Command | Purpose |
|---|---|
| `/setup` | Preview or create the Ali Studio server layout |
| `/ali-studio-status` | Check bot status |
| `/welcome setup` | Set welcome channel and enable welcomes |
| `/welcome channel` | Change welcome channel |
| `/welcome title`, `message`, `color`, `footer` | Customize the welcome embed |
| `/welcome count` | Toggle member count |
| `/welcome preview`, `test`, `settings` | Preview or inspect welcome settings |
| `/welcome enable`, `disable` | Enable or disable welcomes |
| `/ticket setup` | Configure ticket panel, category, and transcript log channel |
| `/mod ban`, `kick`, `timeout`, `warn`, `purge` | Moderation actions |
| `/warnings` | View a member's moderation history |
| `/logs setup` | Configure the server event log channel |
| `/suggest setup` | Set the suggestions channel (staff) |
| `/suggest submit` | Submit a suggestion |
| `/suggest disable` | Disable suggestion submissions (staff) |
| `/autorole set`, `show`, `disable` | Configure automatic member role (staff) |
| `/announce` | Publish an official announcement (staff) |

Suggestion votes are persistent. A member can change their vote by selecting the other button; duplicate votes for the same choice are rejected.

## Requirements

- Node.js 20.11 or newer
- Discord bot application with the `bot` and `applications.commands` scopes
- Persistent writable storage for the SQLite database
- Bot permissions appropriate to the enabled systems: View Channels, Send Messages, Embed Links, Read Message History, Manage Channels, Manage Roles, Manage Messages, Ban Members, Kick Members, Moderate Members, and Attach Files

Place the bot's highest role above every role it needs to assign or moderate. The bot cannot manage roles above its own highest role.

## Discord Developer Portal

Under **Bot → Privileged Gateway Intents**, enable:

- **Server Members Intent** — required for welcome and autorole join events.
- **Message Content Intent** — required to include message text in edit/delete logs.

## Installation

1. Create the bot in the Discord Developer Portal and invite it with the required scopes and permissions.
2. Copy `.env.example` to `.env`.
3. Set `DISCORD_TOKEN`, `CLIENT_ID`, and `GUILD_ID` in `.env`.
4. Install dependencies: `npm install`.
5. Register slash commands: `npm run deploy`.
6. Start the bot: `npm start`.

Run `npm run check` to validate JavaScript syntax.

## Security and operations

- Never commit `.env` or share the bot token.
- Keep `data/ali-studio.sqlite` persistent between restarts.
- Back up the `data/` directory before upgrades or host migrations.
- Use least-privilege Discord permissions and keep staff-only commands restricted to trusted roles.
- CI runs the repository's JavaScript syntax checks on pushes and pull requests.

The repository's automated checks do not replace testing interactions on a real Discord test server.
