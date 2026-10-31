const Database = require("better-sqlite3");
const path = require("node:path");
const fs = require("node:fs");
const { EmbedBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");

const dir = path.join(process.cwd(), "data");
fs.mkdirSync(dir, { recursive: true });
const db = new Database(path.join(dir, "ali-studio.sqlite"));
db.pragma("journal_mode = WAL");
db.exec("CREATE TABLE IF NOT EXISTS welcome_settings (guild_id TEXT PRIMARY KEY, channel_id TEXT, enabled INTEGER NOT NULL DEFAULT 0, title TEXT NOT NULL DEFAULT 'يا مرحبا بـ {user}', message TEXT NOT NULL DEFAULT 'حيّاك الله بين ربعك، عساك تنبسط معنا، وإن احتجت شي، الإدارة ما تقصّر معك.', color TEXT NOT NULL DEFAULT '#6D4AFF', footer TEXT NOT NULL DEFAULT 'Ali Studio', show_member_count INTEGER NOT NULL DEFAULT 1, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)");

const defaults = { title: "يا مرحبا بـ {user}", message: "حيّاك الله بين ربعك، عساك تنبسط معنا، وإن احتجت شي، الإدارة ما تقصّر معك.", color: "#6D4AFF", footer: "Ali Studio", show_member_count: 1, enabled: 0 };
const get = db.prepare("SELECT * FROM welcome_settings WHERE guild_id = ?");
const insert = db.prepare("INSERT OR IGNORE INTO welcome_settings (guild_id,title,message,color,footer,show_member_count,enabled) VALUES (@guild_id,@title,@message,@color,@footer,@show_member_count,@enabled)");
function settings(id) { insert.run({ guild_id: id, ...defaults }); return get.get(id); }
function set(id, key, value) {
  const allowed = ["channel_id","enabled","title","message","color","footer","show_member_count"];
  if (!allowed.includes(key)) throw new Error("Invalid setting");
  db.prepare("UPDATE welcome_settings SET " + key + " = ?, updated_at = CURRENT_TIMESTAMP WHERE guild_id = ?").run(value,id);
}
function render(text, member) {
  return text.replaceAll("{user}",member.toString()).replaceAll("{username}",member.user.username).replaceAll("{server}",member.guild.name).replaceAll("{member_count}",String(member.guild.memberCount));
}
function embed(member, cfg) {
  const e = new EmbedBuilder().setColor(cfg.color).setTitle(render(cfg.title,member).slice(0,256)).setDescription(render(cfg.message,member).slice(0,4096)).setThumbnail(member.user.displayAvatarURL({size:256,extension:"png"})).setFooter({text:cfg.footer.slice(0,2048)}).setTimestamp();
  if (cfg.show_member_count) e.addFields({name:"عدد أعضاء السيرفر",value:String(member.guild.memberCount),inline:true});
  return e;
}
async function sendWelcome(member) {
  const cfg = settings(member.guild.id);
  if (!cfg.enabled || !cfg.channel_id) return;
  const channel = await member.guild.channels.fetch(cfg.channel_id).catch(() => null);
  if (!channel || channel.type !== ChannelType.GuildText || !channel.permissionsFor(member.guild.members.me)?.has(PermissionFlagsBits.SendMessages)) {
    console.warn("[welcome] Welcome channel unavailable or missing Send Messages permission for " + member.guild.id);
    return;
  }
  await channel.send({embeds:[embed(member,cfg)],allowedMentions:{parse:[],users:[member.id]}});
}
async function handle(interaction) {
  const sub = interaction.options.getSubcommand();
  const id = interaction.guildId;
  const cfg = settings(id);
  if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) {
    await interaction.reply({content:"ما عندك صلاحية تعدّل إعدادات الترحيب. تحتاج صلاحية إدارة السيرفر.",ephemeral:true}); return;
  }
  if (sub === "setup" || sub === "channel") {
    const channel = interaction.options.getChannel("channel",true);
    if (channel.type !== ChannelType.GuildText) { await interaction.reply({content:"حدد روم كتابي عشان أرسل فيه الترحيب.",ephemeral:true}); return; }
    set(id,"channel_id",channel.id);
    if (sub === "setup") set(id,"enabled",1);
    await interaction.reply({content:"تم " + (sub === "setup" ? "إعداد الترحيب وتشغيله" : "تغيير روم الترحيب") + " في " + channel + ".",ephemeral:true}); return;
  }
  if (["title","message","footer"].includes(sub)) {
    const value = interaction.options.getString("text",true);
    const max = {title:250,message:4000,footer:2000}[sub];
    if (value.length > max) { await interaction.reply({content:"النص تعدّى الحد المسموح (" + max + " حرف).",ephemeral:true}); return; }
    set(id,sub,value); await interaction.reply({content:"تم تحديث النص وحفظه.",ephemeral:true}); return;
  }
  if (sub === "color") {
    const color = interaction.options.getString("hex",true);
    if (!/^#[0-9a-fA-F]{6}$/.test(color)) { await interaction.reply({content:"صيغة اللون غير صحيحة. مثال: #6D4AFF",ephemeral:true}); return; }
    set(id,"color",color); await interaction.reply({content:"تم تغيير لون الإيمبد.",ephemeral:true}); return;
  }
  if (sub === "count") {
    set(id,"show_member_count",interaction.options.getBoolean("enabled",true) ? 1 : 0);
    await interaction.reply({content:"تم تحديث إظهار عدد الأعضاء.",ephemeral:true}); return;
  }
  if (sub === "enable" || sub === "disable") {
    if (sub === "enable" && !cfg.channel_id) { await interaction.reply({content:"حدد روم الترحيب أولًا باستخدام /welcome setup.",ephemeral:true}); return; }
    set(id,"enabled",sub === "enable" ? 1 : 0);
    await interaction.reply({content:sub === "enable" ? "تم تشغيل الترحيب." : "تم إيقاف الترحيب.",ephemeral:true}); return;
  }
  if (sub === "settings") {
    await interaction.reply({content:["**إعدادات الترحيب**","الروم: " + (cfg.channel_id ? "<#" + cfg.channel_id + ">" : "غير محدد"),"الحالة: " + (cfg.enabled ? "يعمل" : "متوقف"),"اللون: " + cfg.color,"عدد الأعضاء: " + (cfg.show_member_count ? "ظاهر" : "مخفي"),"العنوان: " + cfg.title,"النص: " + cfg.message].join("\n").slice(0,1900),ephemeral:true}); return;
  }
  if (sub === "preview" || sub === "test") {
    const selected = sub === "test" ? interaction.options.getUser("member") : null;
    const member = await interaction.guild.members.fetch(selected?.id || interaction.user.id);
    await interaction.reply({embeds:[embed(member,cfg)],ephemeral:true});
  }
}
module.exports = { sendWelcome, handle };
