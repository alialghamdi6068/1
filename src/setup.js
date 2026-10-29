const {
  ChannelType,
  PermissionFlagsBits,
} = require("discord.js");
const { roles, categories } = require("./config");

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function previewSetup(guild) {
  const lines = ["**Studio setup preview**", "", "**Roles**", ...roles.map((r) => `• ${r.name}`), "", "**Categories and channels**"];
  for (const category of categories) {
    lines.push(`**${category.name}**${category.staffOnly ? " *(staff only)*" : ""}`);
    for (const channel of category.channels) {
      lines.push(`• ${channel.type === "voice" ? "🔊" : "#"} ${channel.name}${channel.readOnly ? " *(read-only)*" : ""}`);
    }
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
      role = await guild.roles.create({
        name: spec.name,
        color: spec.color,
        permissions: spec.permissions,
        hoist: spec.hoist,
        mentionable: false,
        reason: "Studio server initial setup",
      });
      results.rolesCreated++;
      await wait(350);
    } else {
      results.skipped++;
    }
    roleMap.set(spec.name, role);
  }

  const everyone = guild.roles.everyone;
  const staffRoleNames = ["𝓞𝔀𝓷𝓮𝓻", "𝓢𝓽𝓾𝓭𝓲𝓸 𝓛𝓮𝓪𝓭", "𝓐𝓻𝓽 𝓓𝓲𝓻𝓮𝓬𝓽𝓸𝓻"];
  const staffRoles = staffRoleNames.map((name) => roleMap.get(name)).filter(Boolean);

  for (const categorySpec of categories) {
    let category = guild.channels.cache.find(
      (channel) => channel.type === ChannelType.GuildCategory && channel.name === categorySpec.name,
    );

    const permissionOverwrites = categorySpec.staffOnly
      ? [
          { id: everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
          ...staffRoles.map((role) => ({
            id: role.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
          })),
        ]
      : [];

    if (!category) {
      category = await guild.channels.create({
        name: categorySpec.name,
        type: ChannelType.GuildCategory,
        permissionOverwrites,
        reason: "Studio server initial setup",
      });
      results.categoriesCreated++;
      await wait(350);
    } else {
      results.skipped++;
    }

    for (const channelSpec of categorySpec.channels) {
      const type = channelSpec.type === "voice" ? ChannelType.GuildVoice : ChannelType.GuildText;
      const existing = guild.channels.cache.find(
        (channel) => channel.parentId === category.id && channel.name === channelSpec.name && channel.type === type,
      );
      if (existing) {
        results.skipped++;
        continue;
      }

      const channelOverwrites = categorySpec.staffOnly
        ? permissionOverwrites
        : channelSpec.readOnly
          ? [
              { id: everyone.id, deny: [PermissionFlagsBits.SendMessages] },
              ...staffRoles.map((role) => ({ id: role.id, allow: [PermissionFlagsBits.SendMessages] })),
            ]
          : [];

      await guild.channels.create({
        name: channelSpec.name,
        type,
        parent: category.id,
        ...(channelSpec.topic && type === ChannelType.GuildText ? { topic: channelSpec.topic } : {}),
        ...(channelOverwrites.length ? { permissionOverwrites: channelOverwrites } : {}),
        reason: "Studio server initial setup",
      });
      results.channelsCreated++;
      await wait(350);
    }
  }

  return results;
}

module.exports = { previewSetup, applySetup };
