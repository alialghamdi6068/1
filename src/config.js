const { PermissionFlagsBits } = require("discord.js");

const roles = [
  { name: "𝓞𝔀𝓷𝓮𝓻", color: "#E5B94B", permissions: [PermissionFlagsBits.Administrator], hoist: true },
  { name: "𝓢𝓽𝓾𝓭𝓲𝓸 𝓛𝓮𝓪𝓭", color: "#B78CFF", permissions: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageThreads], hoist: true },
  { name: "𝓐𝓻𝓽 𝓓𝓲𝓻𝓮𝓬𝓽𝓸𝓻", color: "#E78AC3", permissions: [PermissionFlagsBits.ManageMessages], hoist: true },
  { name: "𝓓𝓮𝓼𝓲𝓰𝓷𝓮𝓻", color: "#62C7D9", permissions: [], hoist: true },
  { name: "𝓔𝓭𝓲𝓽𝓸𝓻", color: "#7EA7FF", permissions: [], hoist: true },
  { name: "𝓓𝓮𝓿𝓮𝓵𝓸𝓹𝓮𝓻", color: "#8D9BFF", permissions: [], hoist: true },
  { name: "𝓒𝓻𝓮𝓪𝓽𝓸𝓻", color: "#8FD6A8", permissions: [], hoist: true },
  { name: "𝓜𝓮𝓶𝓫𝓮𝓻", color: "#C5CAD3", permissions: [], hoist: false },
];

const categories = [
  {
    name: "✦・𝓢𝓽𝓾𝓭𝓲𝓸 𝓓𝓮𝓼𝓴",
    channels: [
      { name: "📌・𝔀𝓮𝓵𝓬𝓸𝓶𝓮", type: "text", topic: "Welcome to the Studio. Start here and get oriented." },
      { name: "📣・𝓪𝓷𝓷𝓸𝓾𝓷𝓬𝓮𝓶𝓮𝓷𝓽𝓼", type: "text", readOnly: true, topic: "Official Studio news and updates." },
      { name: "📖・𝓼𝓽𝓾𝓭𝓲𝓸-𝓰𝓾𝓲𝓭𝓮", type: "text", topic: "How the Studio works, expectations, and useful links." },
      { name: "🎭・𝓹𝓲𝓬𝓴-𝔂𝓸𝓾𝓻-𝓻𝓸𝓵𝓮", type: "text", topic: "Choose your creative interests and roles." },
    ],
  },
  {
    name: "✦・𝓣𝓱𝓮 𝓒𝓻𝓮𝓪𝓽𝓲𝓿𝓮 𝓕𝓵𝓸𝓸𝓻",
    channels: [
      { name: "💬・𝓼𝓽𝓾𝓭𝓲𝓸-𝓬𝓱𝓪𝓽", type: "text", topic: "General conversation for the Studio community." },
      { name: "🖼・𝓼𝓱𝓸𝔀𝓬𝓪𝓼𝓮", type: "text", topic: "Share finished artwork, edits, builds, and creative work." },
      { name: "🧪・𝔀𝓸𝓻𝓴-𝓲𝓷-𝓹𝓻𝓸𝓰𝓻𝓮𝓼𝓼", type: "text", topic: "Post works in progress and get constructive feedback." },
      { name: "💡・𝓲𝓭𝓮𝓪𝓼-𝓫𝓸𝓪𝓻𝓭", type: "text", topic: "Pitch concepts, brainstorm, and find inspiration." },
      { name: "🤝・𝓬𝓸𝓵𝓵𝓪𝓫𝓸𝓻𝓪𝓽𝓲𝓸𝓷𝓼", type: "text", topic: "Find collaborators and build projects together." },
    ],
  },
  {
    name: "✦・𝓟𝓻𝓸𝓳𝓮𝓬𝓽 𝓡𝓸𝓸𝓶𝓼",
    channels: [
      { name: "🎨・𝓭𝓮𝓼𝓲𝓰𝓷", type: "text", topic: "Graphic design, branding, and visual identity." },
      { name: "🎬・𝓮𝓭𝓲𝓽𝓲𝓷𝓰", type: "text", topic: "Video editing, motion, and production." },
      { name: "💻・𝓭𝓮𝓿𝓮𝓵𝓸𝓹𝓶𝓮𝓷𝓽", type: "text", topic: "Code, tools, technical projects, and experiments." },
      { name: "📦・𝓻𝓮𝓼𝓸𝓾𝓻𝓬𝓮𝓼", type: "text", topic: "Share useful assets, tools, tutorials, and references." },
    ],
  },
  {
    name: "✦・𝓢𝓽𝓾𝓭𝓲𝓸 𝓛𝓸𝓾𝓷𝓰𝓮",
    channels: [
      { name: "🔊・𝓼𝓽𝓾𝓭𝓲𝓸-𝓵𝓸𝓾𝓷𝓰𝓮", type: "voice" },
      { name: "🎧・𝓯𝓸𝓬𝓾𝓼-𝓻𝓸𝓸𝓶", type: "voice" },
      { name: "🗣・𝓯𝓮𝓮𝓭𝓫𝓪𝓬𝓴-𝓻𝓸𝓸𝓶", type: "voice" },
    ],
  },
  {
    name: "✦・𝓑𝓪𝓬𝓴𝓼𝓽𝓪𝓰𝓮",
    staffOnly: true,
    channels: [
      { name: "🛡・𝓼𝓽𝓪𝓯𝓯-𝓻𝓸𝓸𝓶", type: "text", topic: "Private coordination for Studio staff." },
      { name: "🧾・𝓼𝓽𝓪𝓯𝓯-𝓵𝓸𝓰𝓼", type: "text", topic: "Private moderation and setup log channel." },
    ],
  },
];

module.exports = { roles, categories };
