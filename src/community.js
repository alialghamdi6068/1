const Database = require("better-sqlite3");
const path = require("node:path");
const fs = require("node:fs");
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require("discord.js");

const dataDir = path.join(process.cwd(), "data");
fs.mkdirSync(dataDir, { recursive: true });
const db = new Database(path.join(dataDir, "ali-studio.sqlite"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
db.exec(`
  CREATE TABLE IF NOT EXISTS community_settings (
    guild_id TEXT PRIMARY KEY,
    suggestion_channel_id TEXT,
    autorole_id TEXT
  );
  CREATE TABLE IF NOT EXISTS suggestions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT NOT NULL,
    channel_id TEXT NOT NULL,
    message_id TEXT,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    upvotes INTEGER NOT NULL DEFAULT 0,
    downvotes INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(guild_id, message_id)
  );
  CREATE TABLE IF NOT EXISTS suggestion_votes (
    suggestion_id INTEGER NOT NULL REFERENCES suggestions(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    vote INTEGER NOT NULL CHECK(vote IN (-1, 1)),
    PRIMARY KEY(suggestion_id, user_id)
  );
`);

const setting = db.prepare("SELECT * FROM community_settings WHERE guild_id = ?");
function getSettings(guildId) {
  db.prepare("INSERT OR IGNORE INTO community_settings(guild_id) VALUES(?)").run(guildId);
  return setting.get(guildId);
}
function updateSetting(guildId, column, value) {
  if (!["suggestion_channel_id", "autorole_id"].includes(column)) throw new Error("Invalid setting");
  db.prepare("INSERT OR IGNORE INTO community_settings(guild_id) VALUES(?)").run(guildId);
  db.prepare("UPDATE community_settings SET " + column + " = ? WHERE guild_id = ?").run(value, guildId);
}
function canManage(interaction) {
  return interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild);
}
async function replyError(interaction, message) {
  const payload = { content: message, ephemeral: true };
  if (interaction.replied || interaction.deferred) return interaction.followUp(payload);
  return interaction.reply(payload);
}

async function suggestions(interaction) {
  const sub = interaction.options.getSubcommand();
  if (sub === "setup") {
    if (!canManage(interaction)) return replyError(interaction, "تحتاج صلاحية إدارة السيرفر.");
    const channel = interaction.options.getChannel("channel", true);
    if (channel.type !== ChannelType.GuildText) return replyError(interaction, "حدد رومًا كتابيًا للاقتراحات.");
    updateSetting(interaction.guildId, "suggestion_channel_id", channel.id);
    return interaction.reply({ content: "تم تحديد روم الاقتراحات: " + channel, ephemeral: true });
  }
  if (sub === "disable") {
    if (!canManage(interaction)) return replyError(interaction, "تحتاج صلاحية إدارة السيرفر.");
    updateSetting(interaction.guildId, "suggestion_channel_id", null);
    return interaction.reply({ content: "تم إيقاف استقبال الاقتراحات.", ephemeral: true });
  }
  const content = interaction.options.getString("text", true).trim();
  if (content.length < 10 || content.length > 1800) return replyError(interaction, "الاقتراح لازم يكون بين 10 و1800 حرف.");
  const cfg = getSettings(interaction.guildId);
  if (!cfg.suggestion_channel_id) return replyError(interaction, "نظام الاقتراحات غير مضبوط. اطلب من الإدارة استخدام /suggest setup.");
  const channel = await interaction.guild.channels.fetch(cfg.suggestion_channel_id).catch(() => null);
  if (!channel || channel.type !== ChannelType.GuildText) return replyError(interaction, "روم الاقتراحات المحفوظ غير موجود. أعد ضبطه باستخدام /suggest setup.");
  await interaction.deferReply({ ephemeral: true });
  const result = db.prepare("INSERT INTO suggestions(guild_id, channel_id, user_id, content) VALUES(?,?,?,?)")
    .run(interaction.guildId, channel.id, interaction.user.id, content);
  const id = Number(result.lastInsertRowid);
  const embed = new EmbedBuilder()
    .setColor("#6D4AFF")
    .setTitle("Suggestion #" + id)
    .setDescription(content)
    .addFields({ name: "Submitted by", value: interaction.user.toString(), inline: true }, { name: "Status", value: "Pending", inline: true }, { name: "Votes", value: "👍 0  •  👎 0", inline: true })
    .setFooter({ text: "Ali Studio • Suggestions" })
    .setTimestamp();
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("ali_suggest_up:" + id).setLabel("Upvote").setEmoji("👍").setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId("ali_suggest_down:" + id).setLabel("Downvote").setEmoji("👎").setStyle(ButtonStyle.Danger),
  );
  try {
    const message = await channel.send({ embeds: [embed], components: [row], allowedMentions: { parse: [] } });
    db.prepare("UPDATE suggestions SET message_id = ? WHERE id = ?").run(message.id, id);
    await interaction.editReply("تم إرسال اقتراحك بنجاح. رقم الاقتراح: #" + id);
  } catch (error) {
    db.prepare("DELETE FROM suggestions WHERE id = ?").run(id);
    throw error;
  }
}

async function handleSuggestionVote(interaction) {
  if (!interaction.isButton() || !interaction.customId.startsWith("ali_suggest_")) return false;
  const parts = interaction.customId.split(":");
  const direction = parts[0] === "ali_suggest_up" ? 1 : -1;
  const id = Number(parts[1]);
  if (!Number.isSafeInteger(id) || id < 1) {
    await replyError(interaction, "معرّف الاقتراح غير صالح.");
    return true;
  }
  const row = db.prepare("SELECT * FROM suggestions WHERE id = ? AND guild_id = ?").get(id, interaction.guildId);
  if (!row || row.status !== "pending") {
    await replyError(interaction, "هذا الاقتراح غير موجود أو تم إغلاق التصويت عليه.");
    return true;
  }
  const existing = db.prepare("SELECT vote FROM suggestion_votes WHERE suggestion_id = ? AND user_id = ?").get(id, interaction.user.id);
  if (existing?.vote === direction) {
    await replyError(interaction, "سبق وصوّت بنفس الخيار. تقدر تغيّر تصويتك بالضغط على الخيار الثاني.");
    return true;
  }
  const transaction = db.transaction(() => {
    if (existing) db.prepare("UPDATE suggestion_votes SET vote = ? WHERE suggestion_id = ? AND user_id = ?").run(direction, id, interaction.user.id);
    else db.prepare("INSERT INTO suggestion_votes(suggestion_id,user_id,vote) VALUES(?,?,?)").run(id, interaction.user.id, direction);
    const counts = db.prepare("SELECT SUM(CASE WHEN vote=1 THEN 1 ELSE 0 END) AS up, SUM(CASE WHEN vote=-1 THEN 1 ELSE 0 END) AS down FROM suggestion_votes WHERE suggestion_id = ?").get(id);
    db.prepare("UPDATE suggestions SET upvotes = ?, downvotes = ? WHERE id = ?").run(counts.up || 0, counts.down || 0, id);
    return counts;
  });
  const counts = transaction();
  const channel = await interaction.guild.channels.fetch(row.channel_id).catch(() => null);
  const message = channel?.messages ? await channel.messages.fetch(row.message_id).catch(() => null) : null;
  if (message) {
    const old = message.embeds[0];
    if (old) {
      const embed = EmbedBuilder.from(old).spliceFields(2, 1, { name: "Votes", value: "👍 " + (counts.up || 0) + "  •  👎 " + (counts.down || 0), inline: true });
      await message.edit({ embeds: [embed] }).catch(() => null);
    }
  }
  await interaction.reply({ content: direction === 1 ? "تم تسجيل تصويتك الإيجابي." : "تم تسجيل تصويتك السلبي.", ephemeral: true });
  return true;
}

async function autorole(interaction) {
  const sub = interaction.options.getSubcommand();
  if (!canManage(interaction)) return replyError(interaction, "تحتاج صلاحية إدارة السيرفر.");
  if (sub === "disable") {
    updateSetting(interaction.guildId, "autorole_id", null);
    return interaction.reply({ content: "تم إيقاف الرتبة التلقائية.", ephemeral: true });
  }
  if (sub === "show") {
    const cfg = getSettings(interaction.guildId);
    return interaction.reply({ content: "الرتبة التلقائية: " + (cfg.autorole_id ? "<@&" + cfg.autorole_id + ">" : "غير مفعّلة"), ephemeral: true });
  }
  const role = interaction.options.getRole("role", true);
  if (role.id === interaction.guild.id || role.managed || role.permissions.has(PermissionFlagsBits.Administrator)) {
    return replyError(interaction, "ما أقدر أعيّن رتبة @everyone أو رتبة مُدارة أو رتبة Administrator تلقائيًا.");
  }
  const botMember = interaction.guild.members.me;
  if (!botMember?.permissions.has(PermissionFlagsBits.ManageRoles) || botMember.roles.highest.position <= role.position) {
    return replyError(interaction, "ارفع رتبة البوت فوق الرتبة المطلوبة وفعّل له Manage Roles.");
  }
  updateSetting(interaction.guildId, "autorole_id", role.id);
  return interaction.reply({ content: "تم تعيين الرتبة التلقائية: " + role, ephemeral: true });
}

async function assignAutorole(member) {
  const cfg = getSettings(member.guild.id);
  if (!cfg.autorole_id || member.user.bot) return;
  const role = await member.guild.roles.fetch(cfg.autorole_id).catch(() => null);
  const botMember = member.guild.members.me;
  if (!role || !botMember?.permissions.has(PermissionFlagsBits.ManageRoles) || botMember.roles.highest.position <= role.position) {
    console.warn("[autorole] Configured role is missing or above the bot in guild " + member.guild.id);
    return;
  }
  await member.roles.add(role, "Ali Studio automatic member role").catch(error => console.error("[autorole] Failed:", error.message));
}

async function announce(interaction) {
  if (!canManage(interaction)) return replyError(interaction, "تحتاج صلاحية إدارة السيرفر.");
  const channel = interaction.options.getChannel("channel", true);
  if (channel.type !== ChannelType.GuildText) return replyError(interaction, "حدد رومًا كتابيًا للإعلان.");
  const title = interaction.options.getString("title", true).trim();
  const message = interaction.options.getString("message", true).trim();
  const color = interaction.options.getString("color") || "#6D4AFF";
  if (!/^#[0-9a-fA-F]{6}$/.test(color)) return replyError(interaction, "اللون غير صالح. استخدم صيغة مثل #6D4AFF.");
  if (!title || title.length > 256 || !message || message.length > 4000) return replyError(interaction, "العنوان أو نص الإعلان فارغ أو أطول من الحد المسموح.");
  const embed = new EmbedBuilder().setColor(color).setTitle(title).setDescription(message).setFooter({ text: "Ali Studio • Official Announcement" }).setTimestamp();
  await channel.send({ embeds: [embed], allowedMentions: { parse: [] } });
  await interaction.reply({ content: "تم نشر الإعلان في " + channel + ".", ephemeral: true });
}

module.exports = { suggestions, handleSuggestionVote, autorole, assignAutorole, announce };
