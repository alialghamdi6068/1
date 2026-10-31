const { ChannelType, PermissionFlagsBits } = require("discord.js");
const { roles, categories } = require("./config");
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function previewSetup(guild) {
  const lines = ["**Ali Studio setup preview**", "", "**Roles**", ...roles.map((r) => `• ${r.name}`), "", "**Categories and channels**"];
  for (const category of categories) {
    lines.push(`**${category.name}**${category.staffOnly ? " *(staff only)*" : ""}`);
    for (const channel of category.channels) lines.push(`• ${channel.type === "voice" ? "🔊" : "#"} ${channel.name}${channel.readOnly ? " *(read-only)*" : ""}`);
  }
  lines.push("", "Preview only: nothing has been created or changed.");
  return lines.join("\n").slice(0, 3900);
}

async function applySetup(guild) {
  const results = { rolesCreated: 0, categoriesCreated: 0, channelsCreated: 0, skipped: 0 };
  await guild.roles.fetch();
  await guild.channels.fetch();
  const roleMap = new Map();
  for (const spec of roles) {
    let role = guild.roles.cache.find((item) => item.name === spec.name);
    if (!role) {
      role = await guild.roles.create({ name: spec.name, color: spec.color, permissions: spec.permissions, hoist: spec.hoist, mentionable: false, reason: "Ali Studio programming server setup" });
      results.rolesCreated++;
      await wait(350);
    } else results.skipped++;
    roleMap.set(spec.name, role);
  }

  const everyone = guild.roles.everyone;
  const staffNames = ["𝓞𝔀𝓷𝓮𝓻", "𝓒𝓸-𝓞𝔀𝓷𝓮𝓻", "𝓜𝓪𝓷𝓪𝓰𝓮𝓻", "𝓓𝓮𝓿𝓮𝓵𝓸𝓹𝓮𝓻", "𝓐𝓭𝓶𝓲𝓷", "𝓜𝓸𝓭𝓮𝓻𝓪𝓽𝓸𝓻", "𝓗𝓮𝓵𝓹𝓮𝓻"];
  const staffRoles = staffNames.map((name) => roleMap.get(name)).filter(Boolean);
  for (const spec of categories) {
    let category = guild.channels.cache.find((ch) => ch.type === ChannelType.GuildCategory && ch.name === spec.name);
    const staffOverwrites = [{ id: everyone.id, deny: [PermissionFlagsBits.ViewChannel] }, ...staffRoles.map((role) => ({ id: role.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] }))];
    if (!category) {
      category = await guild.channels.create({ name: spec.name, type: ChannelType.GuildCategory, permissionOverwrites: spec.staffOnly ? staffOverwrites : [], reason: "Ali Studio programming server setup" });
      results.categoriesCreated++;
      await wait(350);
    } else results.skipped++;
    for (const channelSpec of spec.channels) {
      const type = channelSpec.type === "voice" ? ChannelType.GuildVoice : ChannelType.GuildText;
      const existing = guild.channels.cache.find((ch) => ch.parentId === category.id && ch.name === channelSpec.name && ch.type === type);
      if (existing) { results.skipped++; continue; }
      const overwrites = spec.staffOnly ? staffOverwrites : channelSpec.readOnly ? [{ id: everyone.id, deny: [PermissionFlagsBits.SendMessages] }, ...staffRoles.map((role) => ({ id: role.id, allow: [PermissionFlagsBits.SendMessages] }))] : [];
      await guild.channels.create({ name: channelSpec.name, type, parent: category.id, ...(channelSpec.topic && type === ChannelType.GuildText ? { topic: channelSpec.topic } : {}), ...(overwrites.length ? { permissionOverwrites: overwrites } : {}), reason: "Ali Studio programming server setup" });
      results.channelsCreated++;
      await wait(350);
    }
  }
  return results;
}
module.exports = { previewSetup, applySetup };
