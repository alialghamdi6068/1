require("dotenv").config();
const { Client, GatewayIntentBits, Events, PermissionFlagsBits } = require("discord.js");
const { previewSetup, applySetup } = require("./setup");
const { sendWelcome, handle: handleWelcome } = require("./welcome");
const { setup: setupTickets, component: handleTicketComponent } = require("./tickets");
const { configureLogs, moderate, warnings, logEvents } = require("./admin");

const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error("Missing DISCORD_TOKEN. Copy .env.example to .env and configure it.");
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

logEvents(client);

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ali Studio online as ${readyClient.user.tag}`);
});

client.on(Events.GuildMemberAdd, (member) => { sendWelcome(member).catch((error) => console.error("[welcome] Failed:", error)); });

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isButton()) {
    try { await handleTicketComponent(interaction); }
    catch (error) { console.error("[tickets] Component failed:", error); const payload={content:"تعذر تنفيذ العملية. راجع سجل البوت وصلاحياته.",ephemeral:true}; if(interaction.replied||interaction.deferred) await interaction.followUp(payload).catch(()=>{}); else await interaction.reply(payload).catch(()=>{}); }
    return;
  }
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "logs") { try { await configureLogs(interaction); } catch(e) { console.error("[logs]",e); await interaction.reply({content:"فشل إعداد السجلات.",ephemeral:true}).catch(()=>{}); } return; }
  if (interaction.commandName === "mod") { if (!interaction.memberPermissions?.has(PermissionFlagsBits.ModerateMembers) && !interaction.memberPermissions?.has(PermissionFlagsBits.BanMembers) && !interaction.memberPermissions?.has(PermissionFlagsBits.ManageMessages)) { await interaction.reply({content:"ما عندك صلاحية تنفيذ أوامر الإدارة.",ephemeral:true}); return; } try { await moderate(interaction); } catch(e) { console.error("[moderation]",e); const p={content:"صار خطأ أثناء تنفيذ الأمر.",ephemeral:true}; if(interaction.replied||interaction.deferred) await interaction.followUp(p).catch(()=>{}); else await interaction.reply(p).catch(()=>{}); } return; }
  if (interaction.commandName === "warnings") { try { await warnings(interaction); } catch(e) { console.error("[warnings]",e); await interaction.reply({content:"تعذر عرض السجل.",ephemeral:true}).catch(()=>{}); } return; }
  if (interaction.commandName === "ticket") {
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) { await interaction.reply({content:"تحتاج صلاحية إدارة السيرفر.",ephemeral:true}); return; }
    try { await setupTickets(interaction); } catch(error) { console.error("[tickets] Setup failed:",error); const p={content:"فشل إعداد نظام التذاكر. تأكد من صلاحيات البوت.",ephemeral:true}; if(interaction.replied||interaction.deferred) await interaction.followUp(p).catch(()=>{}); else await interaction.reply(p).catch(()=>{}); }
    return;
  }
  if (interaction.commandName === "welcome") {
    try { await handleWelcome(interaction); }
    catch (error) { console.error("[welcome] Command failed:", error); const reply = { content: "صار خطأ أثناء تنفيذ أمر الترحيب. راجع سجل البوت.", ephemeral: true }; if (interaction.replied || interaction.deferred) await interaction.followUp(reply).catch(() => {}); else await interaction.reply(reply).catch(() => {}); }
    return;
  }

  if (interaction.commandName === "ali-studio-status") {
    await interaction.reply({
      content: `Ali Studio is online. Connected to **${interaction.guild.name}**.`,
      ephemeral: true,
    });
    return;
  }

  if (interaction.commandName !== "setup") return;
  if (!interaction.inGuild() || !interaction.guild) {
    await interaction.reply({ content: "Use this command inside your Ali Studio server.", ephemeral: true });
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
