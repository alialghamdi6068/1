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

const commands = [
  welcomeCommand.toJSON(),

  new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Preview or create the tailored Ali Ali Studio server layout")
    .addStringOption((option) =>
      option.setName("mode")
        .setDescription("Preview the plan first, or apply it to the server")
        .setRequired(true)
        .addChoices(
          { name: "Preview only", value: "preview" },
          { name: "Create Ali Studio layout", value: "apply" },
        ),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  new SlashCommandBuilder()
    .setName("ali-studio-status")
    .setDescription("Show the Ali Studio setup bot status")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
].map((command) => command.toJSON());

async function main() {
  const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;
  if (!DISCORD_TOKEN || !CLIENT_ID || !GUILD_ID) {
    throw new Error("Missing DISCORD_TOKEN, CLIENT_ID, or GUILD_ID in .env");
  }
  const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);
  await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
  console.log("Ali Studio slash commands registered.");
}

main().catch((error) => {
  console.error("Failed to register commands:", error);
  process.exitCode = 1;
});
