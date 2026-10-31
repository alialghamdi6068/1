const Database = require("better-sqlite3");
const path = require("node:path");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");
const db = new Database(path.join(process.cwd(), "data", "ali-studio.sqlite"));
db.pragma("journal_mode=WAL");
db.exec("CREATE TABLE IF NOT EXISTS polls(id INTEGER PRIMARY KEY AUTOINCREMENT,guild_id TEXT NOT NULL,channel_id TEXT NOT NULL,message_id TEXT NOT NULL,question TEXT NOT NULL,options TEXT NOT NULL,closed INTEGER NOT NULL DEFAULT 0); CREATE TABLE IF NOT EXISTS poll_votes(poll_id INTEGER NOT NULL,user_id TEXT NOT NULL,option_index INTEGER NOT NULL,PRIMARY KEY(poll_id,user_id));");
const q = sql => db.prepare(sql);
async function reply(i, content) { const p={content,ephemeral:true}; return i.replied||i.deferred ? i.followUp(p) : i.reply(p); }
function embed(p, closed=false) { const options=JSON.parse(p.options); const rows=q("SELECT option_index,COUNT(*) AS total FROM poll_votes WHERE poll_id=? GROUP BY option_index").all(p.id); const counts=options.map((_,n)=>rows.find(x=>x.option_index===n)?.total||0); return new EmbedBuilder().setColor(closed?"#808080":"#6D4AFF").setTitle(closed?"Poll Ended":"Poll").setDescription("**"+p.question+"**\n"+options.map((x,n)=>(n+1)+". "+x+" — "+counts[n]+" votes").join("\n")); }
async function create(i) {
 const question=i.options.getString("question",true), options=i.options.getString("options",true).split("|").map(x=>x.trim()).filter(Boolean);
 if(options.length<2||options.length>5||options.some(x=>x.length>80)) return reply(i,"اكتب من خيارين إلى خمسة خيارات، وافصل بينها بعلامة |.");
 await i.deferReply({ephemeral:true});
 const msg=await i.channel.send({embeds:[new EmbedBuilder().setColor("#6D4AFF").setTitle("Poll").setDescription("**"+question+"**\n"+options.map((x,n)=>(n+1)+". "+x).join("\n"))]});
 const r=q("INSERT INTO polls(guild_id,channel_id,message_id,question,options) VALUES(?,?,?,?,?)").run(i.guildId,i.channelId,msg.id,question,JSON.stringify(options));
 const id=r.lastInsertRowid, row=new ActionRowBuilder().addComponents(options.map((x,n)=>new ButtonBuilder().setCustomId("ali_poll:"+id+":"+n).setLabel(String(n+1)+". "+x.slice(0,70)).setStyle(ButtonStyle.Primary)));
 await msg.edit({components:[row]}); return i.editReply("تم نشر التصويت رقم #"+id+".");
}
async function button(i) {
 if(!i.customId.startsWith("ali_poll:")) return false;
 const parts=i.customId.split(":"),id=Number(parts[1]),index=Number(parts[2]),p=q("SELECT * FROM polls WHERE id=? AND guild_id=? AND closed=0").get(id,i.guildId);
 if(!p) return reply(i,"التصويت مغلق أو غير متاح.");
 const options=JSON.parse(p.options); if(!Number.isInteger(index)||index<0||index>=options.length) return reply(i,"الخيار غير صالح.");
 q("INSERT INTO poll_votes(poll_id,user_id,option_index) VALUES(?,?,?) ON CONFLICT(poll_id,user_id) DO UPDATE SET option_index=excluded.option_index").run(id,i.user.id,index);
 const ch=await i.guild.channels.fetch(p.channel_id).catch(()=>null),msg=ch?.isTextBased()?await ch.messages.fetch(p.message_id).catch(()=>null):null;
 if(msg) await msg.edit({embeds:[embed(p)]}); return reply(i,"تم تسجيل تصويتك، وتقدر تغيّر اختيارك.");
}
async function end(i) {
 if(!i.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) return reply(i,"تحتاج Manage Server.");
 const id=i.options.getInteger("id",true),p=q("SELECT * FROM polls WHERE id=? AND guild_id=? AND closed=0").get(id,i.guildId); if(!p) return reply(i,"التصويت غير موجود أو منتهي.");
 q("UPDATE polls SET closed=1 WHERE id=?").run(id); const ch=await i.guild.channels.fetch(p.channel_id).catch(()=>null),msg=ch?.isTextBased()?await ch.messages.fetch(p.message_id).catch(()=>null):null;
 if(msg) await msg.edit({embeds:[embed(p,true)],components:[]}); return reply(i,"تم إغلاق التصويت.");
}
module.exports={create,button,end};