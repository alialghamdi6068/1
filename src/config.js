const { PermissionFlagsBits } = require("discord.js");

// Studio is a programming/technology community, not a generic creator/editing server.
const roles = [
  // Leadership and staff
  { name: "𝓞𝔀𝓷𝓮𝓻", color: "#F1C40F", permissions: [PermissionFlagsBits.Administrator], hoist: true },
  { name: "𝓒𝓸-𝓞𝔀𝓷𝓮𝓻", color: "#E67E22", permissions: [PermissionFlagsBits.ManageGuild, PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.KickMembers, PermissionFlagsBits.BanMembers], hoist: true },
  { name: "𝓜𝓪𝓷𝓪𝓰𝓮𝓻", color: "#E74C3C", permissions: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageChannels, PermissionFlagsBits.KickMembers, PermissionFlagsBits.ModerateMembers], hoist: true },
  { name: "𝓓𝓮𝓿𝓮𝓵𝓸𝓹𝓮𝓻", color: "#9B59B6", permissions: [PermissionFlagsBits.ManageMessages], hoist: true },
  { name: "𝓐𝓭𝓶𝓲𝓷", color: "#3498DB", permissions: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ModerateMembers], hoist: true },
  { name: "𝓜𝓸𝓭𝓮𝓻𝓪𝓽𝓸𝓻", color: "#1ABC9C", permissions: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ModerateMembers], hoist: true },
  { name: "𝓗𝓮𝓵𝓹𝓮𝓻", color: "#2ECC71", permissions: [], hoist: true },

  // Product/client and community ranks
  { name: "𝓛𝓾𝓷𝓪𝓻 𝓒𝓵𝓲𝓮𝓷𝓽", color: "#E84393", permissions: [], hoist: true },
  { name: "𝓑𝓪𝓭𝓵𝓲𝓸𝓷 𝓒𝓵𝓲𝓮𝓷𝓽", color: "#00B894", permissions: [], hoist: true },
  { name: "𝓕𝓮𝓪𝓽𝓱𝓮𝓻 𝓒𝓵𝓲𝓮𝓷𝓽", color: "#74B9FF", permissions: [], hoist: true },
  { name: "𝓥𝓘𝓟", color: "#FDCB6E", permissions: [], hoist: true },
  { name: "𝓟𝓻𝓮𝓶𝓲𝓾𝓶", color: "#A29BFE", permissions: [], hoist: true },
  { name: "𝓑𝓸𝓸𝓼𝓽𝓮𝓻", color: "#FF73FA", permissions: [], hoist: true },
  { name: "𝓨𝓸𝓾𝓣𝓾𝓫𝓮𝓻", color: "#FF0000", permissions: [], hoist: true },
  { name: "𝓢𝓽𝓻𝓮𝓪𝓶𝓮𝓻", color: "#9146FF", permissions: [], hoist: true },
  { name: "𝓜𝓮𝓶𝓫𝓮𝓻", color: "#DDE1E6", permissions: [], hoist: false },
];

const categories = [
  {
    name: "✦・𝓢𝓽𝓾𝓭𝓲𝓸 𝓘𝓷𝓯𝓸",
    channels: [
      { name: "📌・𝔀𝓮𝓵𝓬𝓸𝓶𝓮", type: "text", topic: "Welcome to Studio — programming, technology, and Minecraft clients." },
      { name: "📢・𝓪𝓷𝓷𝓸𝓾𝓷𝓬𝓮𝓶𝓮𝓷𝓽𝓼", type: "text", readOnly: true, topic: "Official Studio announcements and project releases." },
      { name: "📜・𝓻𝓾𝓵𝓮𝓼", type: "text", readOnly: true, topic: "Studio community rules." },
      { name: "🗺・𝓼𝓽𝓾𝓭𝓲𝓸-𝓲𝓷𝓯𝓸", type: "text", topic: "Information about Studio, its projects, and services." },
      { name: "🎭・𝓻𝓸𝓵𝓮𝓼", type: "text", topic: "Roles for clients, supporters, and community members." },
    ],
  },
  {
    name: "✦・𝓒𝓸𝓶𝓶𝓾𝓷𝓲𝓽𝔂",
    channels: [
      { name: "💬・𝓬𝓱𝓪𝓽", type: "text", topic: "Community chat." },
      { name: "🤖・𝓫𝓸𝓽-𝓬𝓸𝓶𝓶𝓪𝓷𝓭𝓼", type: "text", topic: "Use bot commands here." },
      { name: "❔・𝓺𝓾𝓮𝓼𝓽𝓲𝓸𝓷𝓼", type: "text", topic: "Ask programming, setup, and technology questions." },
      { name: "💡・𝓼𝓾𝓰𝓰𝓮𝓼𝓽𝓲𝓸𝓷𝓼", type: "text", topic: "Suggest improvements for Studio and its projects." },
      { name: "🖼・𝓼𝓱𝓸𝔀𝓬𝓪𝓼𝓮", type: "text", topic: "Show your code, projects, tools, and creations." },
    ],
  },
  {
    name: "✦・𝓟𝓻𝓸𝓰𝓻𝓪𝓶𝓶𝓲𝓷𝓰",
    channels: [
      { name: "💻・𝓬𝓸𝓭𝓲𝓷𝓰", type: "text", topic: "Programming discussion and help." },
      { name: "🐍・𝓹𝔂𝓽𝓱𝓸𝓷", type: "text", topic: "Python development, libraries, and debugging." },
      { name: "☕・𝓳𝓪𝓿𝓪", type: "text", topic: "Java development, JVM, plugins, and debugging." },
      { name: "🌐・𝔀𝓮𝓫-𝓭𝓮𝓿", type: "text", topic: "Web development, APIs, and databases." },
      { name: "🧰・𝓽𝓸𝓸𝓵𝓼-𝓪𝓷𝓭-𝓻𝓮𝓼𝓸𝓾𝓻𝓬𝓮𝓼", type: "text", topic: "Useful programming tools, libraries, and documentation." },
      { name: "🧠・𝓬𝓸𝓭𝓮-𝓻𝓮𝓿𝓲𝓮𝔀", type: "text", topic: "Ask for code reviews and discuss technical approaches." },
    ],
  },
  {
    name: "✦・𝓜𝓲𝓷𝓮𝓬𝓻𝓪𝓯𝓽 𝓒𝓵𝓲𝓮𝓷𝓽𝓼",
    channels: [
      { name: "🌙・𝓵𝓾𝓷𝓪𝓻-𝓬𝓵𝓲𝓮𝓷𝓽", type: "text", topic: "Lunar Client discussion, support, and setup." },
      { name: "🛡・𝓫𝓪𝓭𝓵𝓲𝓸𝓷-𝓬𝓵𝓲𝓮𝓷𝓽", type: "text", topic: "Badlion Client discussion, support, and setup." },
      { name: "🪶・𝓯𝓮𝓪𝓽𝓱𝓮𝓻-𝓬𝓵𝓲𝓮𝓷𝓽", type: "text", topic: "Feather Client discussion, support, and setup." },
      { name: "⚔・𝓶𝓲𝓷𝓮𝓬𝓻𝓪𝓯𝓽-𝓹𝓿𝓹", type: "text", topic: "Minecraft PvP, performance, and client settings." },
    ],
  },
  {
    name: "✦・𝓢𝓾𝓹𝓹𝓸𝓻𝓽",
    channels: [
      { name: "🎫・𝓬𝓻𝓮𝓪𝓽𝓮-𝓽𝓲𝓬𝓴𝓮𝓽", type: "text", topic: "Open a support ticket for Studio projects and services." },
      { name: "💳・𝓹𝓻𝓮𝓶𝓲𝓾𝓶-𝓼𝓾𝓹𝓹𝓸𝓻𝓽", type: "text", topic: "Support for VIP and Premium members." },
      { name: "📦・𝓬𝓵𝓲𝓮𝓷𝓽-𝓼𝓾𝓹𝓹𝓸𝓻𝓽", type: "text", topic: "Help with Minecraft clients and technical setup." },
      { name: "📚・𝓯𝓪𝓺", type: "text", topic: "Frequently asked questions." },
    ],
  },
  {
    name: "✦・𝓥𝓸𝓲𝓬𝓮",
    channels: [
      { name: "🔊・𝓖𝓮𝓷𝓮𝓻𝓪𝓵", type: "voice" },
      { name: "💻・𝓒𝓸𝓭𝓲𝓷𝓰", type: "voice" },
      { name: "🎮・𝓖𝓪𝓶𝓲𝓷𝓰", type: "voice" },
    ],
  },
  {
    name: "✦・𝓢𝓽𝓪𝓯𝓯 𝓡𝓸𝓸𝓶𝓼",
    staffOnly: true,
    channels: [
      { name: "🛡・𝓼𝓽𝓪𝓯𝓯-𝓬𝓱𝓪𝓽", type: "text", topic: "Private staff coordination." },
      { name: "📋・𝓼𝓽𝓪𝓯𝓯-𝓵𝓸𝓰𝓼", type: "text", topic: "Private staff logs." },
      { name: "🧰・𝓭𝓮𝓿-𝓻𝓸𝓸𝓶", type: "text", topic: "Private project and development coordination." },
    ],
  },
];

module.exports = { roles, categories };
