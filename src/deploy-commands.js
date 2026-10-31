require("dotenv").config();
const { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

const welcomeCommand = new SlashCommandBuilder()
  .setName("welcome")
  .setDescription("إعداد رسائل الترحيب في Ali Studio")
  .addSubcommand(s => s.setName("setup").setDescription("تحديد روم الترحيب وتشغيله").addChannelOption(o => o.setName("channel").setDescription("روم الترحيب").addChannelTypes(0).setRequired(true)))
  .addSubcommand(s => s.setName("channel").setDescription("تغيير روم الترحيب").addChannelOption(o => o.setName("channel").setDescription("الروم الجديد").addChannelTypes(0).setRequired(true)))
  .addSubcommand(s => s.setName("title").setDescription("تعديل عنوان الإيمبد").addStringOption(o => o.setName("text").setDescription("العنوان، يدعم {user}").setRequired(true)))
  .addSubcommand(s => s.setName("message").setDescription("تعديل نص الترحيب").addStringOption(o => o.setName("text").setDescription("النص، يدعم {user} و{username} و{server}").setRequired(true)))
  .addSubcommand(s => s.setName("color").setDescription("تغيير لون الإيمبد").addStringOption(o => o.setName("hex").setDescription("مثال #6D4AFF").setRequired(true)))
  .addSubcommand(s => s.setName("footer").setDescription("تعديل تذييل الإيمبد").addStringOption(o => o.setName("text").setDescription("نص التذييل").setRequired(true)))
  .addSubcommand(s => s.setName("count").setDescription("إظهار أو إخفاء عدد الأعضاء").addBooleanOption(o => o.setName("enabled").setDescription("إظهار العدد").setRequired(true)))
  .addSubcommand(s => s.setName("preview").setDescription("معاينة الإيمبد"))
  .addSubcommand(s => s.setName("test").setDescription("معاينة الترحيب لك بشكل خاص").addUserOption(o => o.setName("member").setDescription("عضو للمعاينة").setRequired(false)))
  .addSubcommand(s => s.setName("settings").setDescription("عرض إعدادات الترحيب"))
  .addSubcommand(s => s.setName("enable").setDescription("تشغيل الترحيب"))
  .addSubcommand(s => s.setName("disable").setDescription("إيقاف الترحيب"))
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

const ticketCommand = new SlashCommandBuilder()
 .setName("ticket").setDescription("إدارة نظام التذاكر")
 .addSubcommand(s=>s.setName("setup").setDescription("إعداد لوحة التذاكر والتصنيف والسجلات")
  .addChannelOption(o=>o.setName("panel").setDescription("روم لوحة فتح التذاكر").addChannelTypes(0).setRequired(true))
  .addChannelOption(o=>o.setName("category").setDescription("تصنيف قنوات التذاكر").addChannelTypes(4).setRequired(true))
  .addChannelOption(o=>o.setName("logs").setDescription("روم سجلات التذاكر").addChannelTypes(0).setRequired(true)))
 .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

const adminCommands = [
 new SlashCommandBuilder().setName("mod").setDescription("أوامر إدارة الأعضاء")
  .addSubcommand(s=>s.setName("ban").setDescription("حظر عضو").addUserOption(o=>o.setName("user").setDescription("العضو").setRequired(true)).addStringOption(o=>o.setName("reason").setDescription("السبب").setRequired(false)))
  .addSubcommand(s=>s.setName("kick").setDescription("طرد عضو").addUserOption(o=>o.setName("user").setDescription("العضو").setRequired(true)).addStringOption(o=>o.setName("reason").setDescription("السبب").setRequired(false)))
  .addSubcommand(s=>s.setName("timeout").setDescription("إسكات عضو مؤقتًا").addUserOption(o=>o.setName("user").setDescription("العضو").setRequired(true)).addIntegerOption(o=>o.setName("minutes").setDescription("المدة بالدقائق").setMinValue(1).setMaxValue(40320).setRequired(true)).addStringOption(o=>o.setName("reason").setDescription("السبب").setRequired(false)))
  .addSubcommand(s=>s.setName("warn").setDescription("تسجيل تحذير").addUserOption(o=>o.setName("user").setDescription("العضو").setRequired(true)).addStringOption(o=>o.setName("reason").setDescription("السبب").setRequired(true)))
  .addSubcommand(s=>s.setName("purge").setDescription("حذف رسائل من الروم").addIntegerOption(o=>o.setName("amount").setDescription("عدد الرسائل").setMinValue(1).setMaxValue(100).setRequired(true)))
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
 new SlashCommandBuilder().setName("warnings").setDescription("عرض سجل إجراءات عضو").addUserOption(o=>o.setName("user").setDescription("العضو").setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
 new SlashCommandBuilder().setName("logs").setDescription("إعداد سجلات السيرفر").addSubcommand(s=>s.setName("setup").setDescription("تحديد روم السجلات").addChannelOption(o=>o.setName("channel").setDescription("روم السجلات").addChannelTypes(0).setRequired(true))).setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
];

const communityCommands = [
  new SlashCommandBuilder().setName("suggest").setDescription("إرسال اقتراح للمجتمع")
    .addSubcommand(s => s.setName("submit").setDescription("إرسال اقتراح جديد").addStringOption(o => o.setName("text").setDescription("اكتب اقتراحك").setMinLength(10).setMaxLength(1800).setRequired(true)))
    .addSubcommand(s => s.setName("setup").setDescription("تحديد روم الاقتراحات").addChannelOption(o => o.setName("channel").setDescription("روم الاقتراحات").addChannelTypes(0).setRequired(true)))
    .addSubcommand(s => s.setName("disable").setDescription("إيقاف نظام الاقتراحات"))
    .setDefaultMemberPermissions(null),
  new SlashCommandBuilder().setName("autorole").setDescription("إدارة الرتبة التلقائية")
    .addSubcommand(s => s.setName("set").setDescription("تحديد رتبة للأعضاء الجدد").addRoleOption(o => o.setName("role").setDescription("الرتبة").setRequired(true)))
    .addSubcommand(s => s.setName("disable").setDescription("إيقاف الرتبة التلقائية"))
    .addSubcommand(s => s.setName("show").setDescription("عرض الرتبة التلقائية"))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  new SlashCommandBuilder().setName("announce").setDescription("نشر إعلان رسمي")
    .addChannelOption(o => o.setName("channel").setDescription("روم الإعلان").addChannelTypes(0).setRequired(true))
    .addStringOption(o => o.setName("title").setDescription("عنوان الإعلان").setMaxLength(256).setRequired(true))
    .addStringOption(o => o.setName("message").setDescription("نص الإعلان").setMaxLength(4000).setRequired(true))
    .addStringOption(o => o.setName("color").setDescription("لون HEX مثل #6D4AFF").setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
];

const engagementCommands = [
  new SlashCommandBuilder().setName("rank").setDescription("عرض مستواك أو مستوى عضو")
    .addUserOption(o => o.setName("user").setDescription("العضو").setRequired(false)),
  new SlashCommandBuilder().setName("leaderboard").setDescription("أفضل 10 أعضاء حسب XP"),
  new SlashCommandBuilder().setName("levels").setDescription("إعداد نظام المستويات")
    .addStringOption(o => o.setName("mode").setDescription("الإجراء").setRequired(true)
      .addChoices({name:"Enable",value:"enable"},{name:"Disable",value:"disable"},{name:"Announcement channel",value:"channel"}))
    .addChannelOption(o => o.setName("channel").setDescription("روم إعلان الترقية").addChannelTypes(0).setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  new SlashCommandBuilder().setName("afk").setDescription("تفعيل حالة AFK")
    .addStringOption(o => o.setName("reason").setDescription("سبب الغياب").setMaxLength(200).setRequired(false)),
];

const extraCommands = [
 new SlashCommandBuilder().setName("poll").setDescription("Create a community poll").addStringOption(o=>o.setName("question").setDescription("Poll question").setMaxLength(200).setRequired(true)).addStringOption(o=>o.setName("options").setDescription("Options separated by |").setMaxLength(400).setRequired(true)),
 new SlashCommandBuilder().setName("poll-end").setDescription("Close a poll").addIntegerOption(o=>o.setName("id").setDescription("Poll ID").setMinValue(1).setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
];

const commands = [
  ...extraCommands,
  ...engagementCommands,
  ...adminCommands,
  ...communityCommands,
  ticketCommand,
  welcomeCommand,
  new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Preview or create the tailored Ali Studio server layout")
    .addStringOption(option => option.setName("mode").setDescription("Preview the plan first, or apply it to the server").setRequired(true)
      .addChoices({ name: "Preview only", value: "preview" }, { name: "Create Ali Studio layout", value: "apply" }))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  new SlashCommandBuilder().setName("ali-studio-status").setDescription("Show the Ali Studio setup bot status").setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
].map(command => command.toJSON());

async function main() {
  const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;
  if (!DISCORD_TOKEN || !CLIENT_ID || !GUILD_ID) throw new Error("Missing DISCORD_TOKEN, CLIENT_ID, or GUILD_ID in .env");
  const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);
  await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
  console.log("Ali Studio slash commands registered.");
}
main().catch(error => { console.error("Failed to register commands:", error); process.exitCode = 1; });
