require("dotenv").config();
const { Client, GatewayIntentBits, Events, PermissionFlagsBits } = require("discord.js");
const { previewSetup, applySetup } = require("./setup");
const { sendWelcome, handle: handleWelcome } = require("./welcome");
const { setup: setupTickets, component: handleTicketComponent } = require("./tickets");
const { configureLogs, moderate, warnings, logEvents } = require("./admin");
const { suggestions, handleSuggestionVote, autorole, assignAutorole, announce } = require("./community");
const { handleMessage, rank, leaderboard, levelSettings, setAfk } = require("./engagement");
const extra = require("./extra");
const polls = require("./polls");

const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error("Missing DISCORD_TOKEN. Copy .env.example to .env and configure it.");
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
logEvents(client);
client.on(Events.MessageCreate, message => { handleMessage(message).catch(error => console.error("[engagement] Failed:", error)); extra.messageHandler(message).catch(console.error); });
extra.start(client);
client.on(Events.GuildMemberAdd, member => extra.memberJoin(member).catch(console.error));
client.on(Events.MessageReactionAdd, (reaction, user) => extra.starboard(reaction, user).catch(console.error));

client.once(Events.ClientReady, readyClient => console.log("Ali Studio online as " + readyClient.user.tag));
client.on(Events.GuildMemberAdd, member => {
  sendWelcome(member).catch(error => console.error("[welcome] Failed:", error));
  assignAutorole(member).catch(error => console.error("[autorole] Failed:", error));
});

client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isButton()) {
    try {
      if (await handleSuggestionVote(interaction)) return;
      if (await extra.handleButton(interaction)) return;
      if (await polls.button(interaction)) return;
      await handleTicketComponent(interaction);
    } catch (error) {
      console.error("[components] Failed:", error);
      const payload = { content: "تعذر تنفيذ العملية. راجع سجل البوت وصلاحياته.", ephemeral: true };
      if (interaction.replied || interaction.deferred) await interaction.followUp(payload).catch(() => {});
      else await interaction.reply(payload).catch(() => {});
    }
    return;
  }
  if (!interaction.isChatInputCommand()) return;
  try {
    if (interaction.commandName === "logs") return await configureLogs(interaction);
    if (interaction.commandName === "mod") {
      if (!interaction.memberPermissions?.has(PermissionFlagsBits.ModerateMembers) && !interaction.memberPermissions?.has(PermissionFlagsBits.BanMembers) && !interaction.memberPermissions?.has(PermissionFlagsBits.ManageMessages)) return interaction.reply({ content: "ما عندك صلاحية تنفيذ أوامر الإدارة.", ephemeral: true });
      return await moderate(interaction);
    }
    if (interaction.commandName === "warnings") return await warnings(interaction);
    if (interaction.commandName === "ticket") {
      if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) return interaction.reply({ content: "تحتاج صلاحية إدارة السيرفر.", ephemeral: true });
      return await setupTickets(interaction);
    }
    if (interaction.commandName === "welcome") return await handleWelcome(interaction);
    if (interaction.commandName === "suggest") return await suggestions(interaction);
    if (interaction.commandName === "autorole") return await autorole(interaction);
    if (interaction.commandName === "announce") return await announce(interaction);
    if (interaction.commandName === "rank") return await rank(interaction);
    if (interaction.commandName === "leaderboard") return await leaderboard(interaction);
    if (interaction.commandName === "levels") return await levelSettings(interaction);
    if (interaction.commandName === "afk") return await setAfk(interaction);
    if (interaction.commandName === "poll") return await polls.create(interaction);
    if (interaction.commandName === "poll-end") return await polls.end(interaction);
    if (interaction.commandName === "giveaway") return await extra.giveaway(interaction);
    if (interaction.commandName === "remind") return await extra.reminder(interaction);
    if (interaction.commandName === "info") return await extra.info(interaction);
    if (interaction.commandName === "role") return await extra.roleManage(interaction);
    if (interaction.commandName === "backup") return await extra.backup(interaction);
    if (interaction.commandName === "ali-config") return await extra.configure(interaction);
    if (interaction.commandName === "ali-studio-status") return await interaction.reply({ content: "Ali Studio is online. Connected to **" + interaction.guild.name + "**.", ephemeral: true });
    if (interaction.commandName !== "setup") return;
    if (!interaction.inGuild() || !interaction.guild) return interaction.reply({ content: "Use this command inside your Ali Studio server.", ephemeral: true });
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: "Administrator permission is required.", ephemeral: true });
    if (interaction.options.getString("mode", true) === "preview") return interaction.reply({ content: await previewSetup(interaction.guild), ephemeral: true });
    await interaction.deferReply({ ephemeral: true });
    const result = await applySetup(interaction.guild);
    await interaction.editReply(["**Ali Studio layout created.**", "• Roles created: " + result.rolesCreated, "• Categories created: " + result.categoriesCreated, "• Channels created: " + result.channelsCreated, "• Existing items skipped: " + result.skipped, "", "Existing categories and channels were not renamed or deleted."].join("\n"));
  } catch (error) {
    console.error("[commands] " + interaction.commandName + " failed:", error);
    const payload = { content: "صار خطأ أثناء تنفيذ الأمر. تأكد من صلاحيات البوت وراجع سجل التشغيل.", ephemeral: true };
    if (interaction.replied || interaction.deferred) await interaction.followUp(payload).catch(() => {});
    else await interaction.reply(payload).catch(() => {});
  }
});

client.login(token).catch(error => {
  console.error("Unable to log in. Check DISCORD_TOKEN.", error);
  process.exit(1);
});
