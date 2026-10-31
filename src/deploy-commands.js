require("dotenv").config();
const { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

const commands = [
  new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Preview or create the tailored Ali Studio server layout")
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
