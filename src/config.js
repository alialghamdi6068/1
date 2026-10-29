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
    name: "✦・STUDIO DESK",
    channels: [
      { name: "「📌」・welcome", type: "text", topic: "Welcome to the Studio. Start here and get oriented." },
      { name: "「📣」・announcements", type: "text", topic: "Official Studio news and updates." },
      { name: "「📖」・studio-guide", type: "text", topic: "How the Studio works, expectations, and useful links." },
      { name: "「🎭」・pick-your-role", type: "text", topic: "Choose your creative interests and roles." },
    ],
  },
  {
    name: "✦・THE CREATIVE FLOOR",
    channels: [
      { name: "「💬」・studio-chat", type: "text", topic: "General conversation for the Studio community." },
      { name: "「🖼」・showcase", type: "text", topic: "Share finished artwork, edits, builds, and creative work." },
      { name: "「🧪」・work-in-progress", type: "text", topic: "Post works in progress and get constructive feedback." },
      { name: "「💡」・ideas-board", type: "text", topic: "Pitch concepts, brainstorm, and find inspiration." },
      { name: "「🤝」・collaborations", type: "text", topic: "Find collaborators and build projects together." },
    ],
  },
  {
    name: "✦・PROJECT ROOMS",
    channels: [
      { name: "「🎨」・design", type: "text", topic: "Graphic design, branding, and visual identity." },
      { name: "「🎬」・editing", type: "text", topic: "Video editing, motion, and production." },
      { name: "「💻」・development", type: "text", topic: "Code, tools, technical projects, and experiments." },
      { name: "「📦」・resources", type: "text", topic: "Share useful assets, tools, tutorials, and references." },
    ],
  },
  {
    name: "✦・STUDIO LOUNGE",
    channels: [
      { name: "「🔊」・Studio Lounge", type: "voice" },
      { name: "「🎧」・Focus Room", type: "voice" },
      { name: "「🗣」・Feedback Room", type: "voice" },
    ],
  },
  {
    name: "✦・BACKSTAGE",
    staffOnly: true,
    channels: [
      { name: "「🛡」・staff-room", type: "text", topic: "Private coordination for Studio staff." },
      { name: "「🧾」・staff-logs", type: "text", topic: "Private moderation and setup log channel." },
    ],
  },
];

module.exports = { roles, categories };
