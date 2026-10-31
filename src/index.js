require("dotenv").config();
const { Client, GatewayIntentBits, Events, PermissionFlagsBits } = require("discord.js");
const { previewSetup, applySetup } = require("./setup");

const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error("Missing DISCORD_TOKEN. Copy .env.example to .env and configure it.");
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ali Studio online as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ali-studio-status") {
    await interaction.reply({
      content: `Ali Studio is online. Connected to **${interaction.guild.name}**.`,
      ephemeral: true,
    });
    return;
  }

  if (interaction.commandName !== "setup") return;
  if (!interaction.inGuild() || !interaction.guild) {
    await interaction.reply({ content: "Use this command inside your Ali Ali Studio server.", ephemeral: true });
    return;
  }
  if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
    await interaction.reply({ content: "Administrator permission is required.", ephemeral: true });
    return;
  }

  const mode = interaction.options.getString("mode", true);
  if (mode === "preview") {
    await interaction.reply({ content: await previewSetup(interaction.guild), ephemeral: true });
    return;
  }

  await interaction.deferReply({ ephemeral: true });
  try {
    const result = await applySetup(interaction.guild);
    await interaction.editReply([
      "**Ali Studio layout created.**",
      `• Roles created: ${result.rolesCreated}`,
      `• Categories created: ${result.categoriesCreated}`,
      `• Channels created: ${result.channelsCreated}`,
      `• Existing items skipped: ${result.skipped}`,
      "",
      "Existing categories and channels were not renamed or deleted.",
    ].join("\n"));
  } catch (error) {
    console.error("Ali Studio setup failed:", error);
    await interaction.editReply("Setup stopped because Discord returned an error. Check the bot logs and confirm it has Manage Roles and Manage Channels, and that its role is above the roles it creates.");
  }
});

client.login(token).catch((error) => {
  console.error("Unable to log in. Check DISCORD_TOKEN.", error);
  process.exit(1);
});
