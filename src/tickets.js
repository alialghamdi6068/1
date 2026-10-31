const Database = require("better-sqlite3");
const path = require("node:path");
const fs = require("node:fs");
const {
  ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder,
  ChannelType, PermissionFlagsBits, AttachmentBuilder,
} = require("discord.js");

const dataDir = path.join(process.cwd(), "data");
fs.mkdirSync(dataDir, { recursive: true });
const db = new Database(path.join(dataDir, "ali-studio.sqlite"));
db.pragma("journal_mode = WAL");
db.exec(`
CREATE TABLE IF NOT EXISTS ticket_config (
 guild_id TEXT PRIMARY KEY, category_id TEXT, log_channel_id TEXT, panel_channel_id TEXT
);
CREATE TABLE IF NOT EXISTS ticket_counters (
 guild_id TEXT PRIMARY KEY, last_number INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS tickets (
 channel_id TEXT PRIMARY KEY, guild_id TEXT NOT NULL, ticket_number INTEGER NOT NULL,
 owner_id TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'open',
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, closed_at TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS one_open_ticket_per_user
ON tickets(guild_id, owner_id) WHERE status = 'open';
`);
const configGet = db.prepare("SELECT * FROM ticket_config WHERE guild_id = ?");
const configUpsert = db.prepare("INSERT INTO ticket_config (guild_id,category_id,log_channel_id,panel_channel_id) VALUES (@guild_id,@category_id,@log_channel_id,@panel_channel_id) ON CONFLICT(guild_id) DO UPDATE SET category_id=excluded.category_id,log_channel_id=excluded.log_channel_id,panel_channel_id=excluded.panel_channel_id");
const openTicket = db.prepare("SELECT * FROM tickets WHERE guild_id=? AND owner_id=? AND status='open'");
const createTicket = db.prepare("INSERT INTO tickets (channel_id,guild_id,ticket_number,owner_id,status) VALUES (?,?,?,?,'open')");
const nextNumber = db.prepare("INSERT INTO ticket_counters (guild_id,last_number) VALUES (?,1) ON CONFLICT(guild_id) DO UPDATE SET last_number=last_number+1 RETURNING last_number");

function ticketPanel() {
 const embed = new EmbedBuilder().setColor("#6D4AFF").setTitle("مركز المساعدة — Ali Studio").setDescription("إذا واجهتك مشكلة أو عندك استفسار، افتح تذكرة وبيجيك أحد من الإدارة.").setFooter({text:"Ali Studio • Support"});
 const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("ali_ticket:create").setLabel("فتح تذكرة").setStyle(ButtonStyle.Primary).setEmoji("🎫"));
 return {embeds:[embed],components:[row]};
}
function ticketControls() {
 return new ActionRowBuilder().addComponents(
  new ButtonBuilder().setCustomId("ali_ticket:close").setLabel("إغلاق التذكرة").setStyle(ButtonStyle.Danger).setEmoji("🔒"),
  new ButtonBuilder().setCustomId("ali_ticket:reopen").setLabel("إعادة فتح").setStyle(ButtonStyle.Success).setEmoji("🔓"),
  new ButtonBuilder().setCustomId("ali_ticket:delete").setLabel("حذف التذكرة").setStyle(ButtonStyle.Secondary).setEmoji("🗑️")
 );
}
async function setup(interaction) {
 const panel=interaction.options.getChannel("panel",true);
 const category=interaction.options.getChannel("category",true);
 const logs=interaction.options.getChannel("logs",true);
 if(panel.type!==ChannelType.GuildText || logs.type!==ChannelType.GuildText || category.type!==ChannelType.GuildCategory) {
  await interaction.reply({content:"حدد رومًا كتابيًا للوحة والسجلات، وتصنيفًا للتذاكر.",ephemeral:true}); return;
 }
 configUpsert.run({guild_id:interaction.guildId,category_id:category.id,log_channel_id:logs.id,panel_channel_id:panel.id});
 const sent=await panel.send(ticketPanel());
 await interaction.reply({content:"تم نشر لوحة التذاكر في "+panel+" وحفظ الإعدادات.",ephemeral:true});
 return sent;
}
async function create(interaction) {
 const guild=interaction.guild, user=interaction.user, cfg=configGet.get(guild.id);
 if(!cfg?.category_id) { await interaction.reply({content:"نظام التذاكر ما تجهّز للحين. تواصل مع الإدارة.",ephemeral:true}); return; }
 const existing=openTicket.get(guild.id,user.id);
 if(existing) { await interaction.reply({content:"عندك تذكرة مفتوحة بالفعل: <#"+existing.channel_id+">",ephemeral:true}); return; }
 const category=await guild.channels.fetch(cfg.category_id).catch(()=>null);
 if(!category || category.type!==ChannelType.GuildCategory) { await interaction.reply({content:"تصنيف التذاكر غير موجود. خل الإدارة تعيد إعداد النظام.",ephemeral:true}); return; }
 const number=nextNumber.get(guild.id).last_number;
 const channel=await guild.channels.create({
  name:"ticket-"+String(number).padStart(4,"0"),
  type:ChannelType.GuildText,
  parent:category.id,
  topic:"Ali Studio ticket #"+number+" • Owner ID: "+user.id,
  permissionOverwrites:[
   {id:guild.roles.everyone.id,deny:[PermissionFlagsBits.ViewChannel]},
   ...guild.roles.cache.filter(role => role.id !== guild.roles.everyone.id && (role.permissions.has(PermissionFlagsBits.Administrator) || role.permissions.has(PermissionFlagsBits.ManageChannels) || role.permissions.has(PermissionFlagsBits.ManageMessages) || role.permissions.has(PermissionFlagsBits.ModerateMembers))).map(role => ({id:role.id,allow:[PermissionFlagsBits.ViewChannel,PermissionFlagsBits.SendMessages,PermissionFlagsBits.ReadMessageHistory]})),
   {id:user.id,allow:[PermissionFlagsBits.ViewChannel,PermissionFlagsBits.SendMessages,PermissionFlagsBits.ReadMessageHistory,PermissionFlagsBits.AttachFiles,PermissionFlagsBits.EmbedLinks]},
   {id:guild.members.me.id,allow:[PermissionFlagsBits.ViewChannel,PermissionFlagsBits.SendMessages,PermissionFlagsBits.ReadMessageHistory,PermissionFlagsBits.ManageChannels,PermissionFlagsBits.ManageMessages]},
  ],
 });
 try {
  createTicket.run(channel.id,guild.id,number,user.id);
  const embed=new EmbedBuilder().setColor("#6D4AFF").setTitle("تذكرة دعم #"+number).setDescription("هلا "+user+"، اكتب تفاصيل طلبك هنا وبيساعدك أحد من الإدارة.").setFooter({text:"Ali Studio Support"});
  await channel.send({content:user.toString(),embeds:[embed],components:[ticketControls()],allowedMentions:{users:[user.id]}});
  await interaction.reply({content:"تم فتح تذكرتك: "+channel,ephemeral:true});
 } catch(error) {
  await channel.delete("Ticket setup failed").catch(()=>{});
  throw error;
 }
}
async function transcript(channel) {
 const messages=[];
 let before;
 for(let page=0;page<10;page++){
  const batch=await channel.messages.fetch({limit:100,before}).catch(()=>null);
  if(!batch?.size) break;
  messages.push(...batch.values());
  before=batch.last().id;
  if(batch.size<100) break;
 }
 messages.sort((a,b)=>a.createdTimestamp-b.createdTimestamp);
 const lines=messages.map(m=>{
  const body=m.content.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/&/g,"&amp;");
  const files=[...m.attachments.values()].map(a=>a.url).join(" ");
  return "["+new Date(m.createdTimestamp).toISOString()+"] "+m.author.tag+": "+body+(files?" [Files: "+files+"]":"");
 });
 return Buffer.from(lines.join("\n")||"No messages.","utf8");
}
async function component(interaction) {
 const [scope,action]=interaction.customId.split(":");
 if(scope!=="ali_ticket") return false;
 if(action==="create") { await create(interaction); return true; }
 const row=db.prepare("SELECT * FROM tickets WHERE channel_id=? AND guild_id=?").get(interaction.channelId,interaction.guildId);
 if(!row) { await interaction.reply({content:"هذي القناة مو مسجلة كتذكرة.",ephemeral:true}); return true; }
 const manager=interaction.memberPermissions?.has(PermissionFlagsBits.ManageChannels) || interaction.memberPermissions?.has(PermissionFlagsBits.Administrator);
 if(action==="close") {
  if(row.owner_id!==interaction.user.id && !manager) { await interaction.reply({content:"إغلاق التذكرة لصاحبها أو للإدارة.",ephemeral:true}); return true; }
  if(row.status!=="open") { await interaction.reply({content:"التذكرة مقفلة من قبل.",ephemeral:true}); return true; }
  db.prepare("UPDATE tickets SET status='closed',closed_at=CURRENT_TIMESTAMP WHERE channel_id=?").run(row.channel_id);
  await interaction.channel.permissionOverwrites.edit(row.owner_id,{SendMessages:false});
  await interaction.reply({content:"تم إغلاق التذكرة. تقدر الإدارة تعيد فتحها أو تحذفها."});
  return true;
 }
 if(action==="reopen") {
  if(!manager) { await interaction.reply({content:"إعادة فتح التذاكر من صلاحية الإدارة فقط.",ephemeral:true}); return true; }
  if(row.status==="open") { await interaction.reply({content:"التذكرة مفتوحة بالفعل.",ephemeral:true}); return true; }
  db.prepare("UPDATE tickets SET status='open',closed_at=NULL WHERE channel_id=?").run(row.channel_id);
  await interaction.channel.permissionOverwrites.edit(row.owner_id,{ViewChannel:true,SendMessages:true,ReadMessageHistory:true,AttachFiles:true,EmbedLinks:true});
  await interaction.reply({content:"تمت إعادة فتح التذكرة."}); return true;
 }
 if(action==="delete") {
  if(!manager) { await interaction.reply({content:"حذف التذكرة من صلاحية الإدارة فقط.",ephemeral:true}); return true; }
  await interaction.deferReply({ephemeral:true});
  const cfg=configGet.get(interaction.guildId);
  const logChannel=cfg?.log_channel_id ? await interaction.guild.channels.fetch(cfg.log_channel_id).catch(()=>null) : null;
  const file=new AttachmentBuilder(await transcript(interaction.channel),{name:"ticket-"+row.ticket_number+"-transcript.txt"});
  if(logChannel?.isTextBased()) await logChannel.send({content:"سجل التذكرة #"+row.ticket_number+" • صاحب التذكرة: <@"+row.owner_id+">",files:[file],allowedMentions:{parse:[]}});
  db.prepare("UPDATE tickets SET status='deleted',closed_at=CURRENT_TIMESTAMP WHERE channel_id=?").run(row.channel_id);
  await interaction.editReply("تم حفظ سجل التذكرة، وسيتم حذف القناة.");
  await interaction.channel.delete("Ticket deleted by "+interaction.user.tag);
  return true;
 }
 return false;
}
module.exports={setup,component};
