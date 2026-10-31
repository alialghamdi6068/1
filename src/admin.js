const Database=require("better-sqlite3");
const path=require("node:path"),fs=require("node:fs");
const {EmbedBuilder,PermissionFlagsBits,ChannelType}=require("discord.js");
const dir=path.join(process.cwd(),"data");fs.mkdirSync(dir,{recursive:true});
const db=new Database(path.join(dir,"ali-studio.sqlite"));db.pragma("journal_mode=WAL");
db.exec("CREATE TABLE IF NOT EXISTS guild_settings (guild_id TEXT PRIMARY KEY, log_channel_id TEXT); CREATE TABLE IF NOT EXISTS moderation_cases (id INTEGER PRIMARY KEY AUTOINCREMENT,guild_id TEXT NOT NULL,user_id TEXT NOT NULL,moderator_id TEXT NOT NULL,action TEXT NOT NULL,reason TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)");
const logGet=db.prepare("SELECT log_channel_id FROM guild_settings WHERE guild_id=?");
const caseAdd=db.prepare("INSERT INTO moderation_cases (guild_id,user_id,moderator_id,action,reason) VALUES (?,?,?,?,?)");
async function sendLog(guild,embed){const row=logGet.get(guild.id);if(!row||!row.log_channel_id)return;const ch=await guild.channels.fetch(row.log_channel_id).catch(()=>null);if(ch&&ch.type===ChannelType.GuildText)await ch.send({embeds:[embed]}).catch(e=>console.error("[logs]",e.message));}
async function configureLogs(i){const ch=i.options.getChannel("channel",true);if(ch.type!==ChannelType.GuildText){await i.reply({content:"حدد رومًا كتابيًا للسجلات.",ephemeral:true});return;}db.prepare("INSERT INTO guild_settings(guild_id,log_channel_id) VALUES(?,?) ON CONFLICT(guild_id) DO UPDATE SET log_channel_id=excluded.log_channel_id").run(i.guildId,ch.id);await i.reply({content:"تم تعيين روم السجلات: "+ch,ephemeral:true});}
async function moderate(i){
 const action=i.options.getSubcommand(),target=i.options.getMember("user"),user=i.options.getUser("user"),reason=i.options.getString("reason")||"لم يتم تحديد سبب";
 if(action==="purge"){const amount=i.options.getInteger("amount",true);const deleted=await i.channel.bulkDelete(amount,true);await i.reply({content:"تم حذف "+deleted.size+" رسالة.",ephemeral:true});return;}
 if(!user){await i.reply({content:"ما قدرت ألقى العضو المحدد داخل السيرفر.",ephemeral:true});return;}
 if(user.id===i.user.id||user.id===i.client.user.id){await i.reply({content:"ما تقدر تطبق الإجراء على نفسك أو البوت.",ephemeral:true});return;}
 if(target&&i.guild.ownerId!==i.user.id&&target.roles.highest.position>=i.member.roles.highest.position){await i.reply({content:"رتبة العضو مساوية لرتبتك أو أعلى.",ephemeral:true});return;}
 if(target&&i.guild.members.me.roles.highest.position<=target.roles.highest.position&&action!=="warn"){await i.reply({content:"ارفع رتبة البوت فوق رتبة العضو المستهدف.",ephemeral:true});return;}
 await i.deferReply({ephemeral:true});
 try{
  if(action==="ban")await i.guild.members.ban(user.id,{reason:reason+" | By "+i.user.tag});
  else if(action==="kick"){if(!target)throw new Error("العضو غير موجود.");await target.kick(reason);}
  else if(action==="timeout"){if(!target)throw new Error("العضو غير موجود.");await target.timeout(i.options.getInteger("minutes",true)*60000,reason);}
  caseAdd.run(i.guildId,user.id,i.user.id,action,reason);
  await i.editReply("تم تنفيذ "+action+" على <@"+user.id+">. السبب: "+reason);
  const e=new EmbedBuilder().setColor("#D9534F").setTitle("Moderation • "+action.toUpperCase()).addFields({name:"العضو",value:"<@"+user.id+">",inline:true},{name:"بواسطة",value:i.user.toString(),inline:true},{name:"السبب",value:reason.slice(0,1024)}).setTimestamp();await sendLog(i.guild,e);
 }catch(e){console.error("[moderation]",e);await i.editReply("ما قدرت أنفذ الإجراء: "+e.message.slice(0,400));}
}
async function warnings(i){const user=i.options.getUser("user",true);const rows=db.prepare("SELECT action,reason,moderator_id,created_at FROM moderation_cases WHERE guild_id=? AND user_id=? ORDER BY id DESC LIMIT 15").all(i.guildId,user.id);if(!rows.length){await i.reply({content:"ما فيه سجل إجراءات لهذا العضو.",ephemeral:true});return;}const body=rows.map((r,n)=>(n+1)+". "+r.action+" — "+(r.reason||"بدون سبب")+" | بواسطة <@"+r.moderator_id+"> | "+r.created_at).join("\n");await i.reply({content:("سجل <@"+user.id+">\n"+body).slice(0,1900),ephemeral:true});}
function logEvents(client){
 client.on("messageDelete",async m=>{if(!m.guild||m.author&&m.author.bot)return;const e=new EmbedBuilder().setColor("#D9534F").setTitle("Message deleted").addFields({name:"Channel",value:"<#"+m.channelId+">",inline:true},{name:"Author",value:m.author?m.author.tag:"Unknown",inline:true},{name:"Content",value:(m.content||"No text content").slice(0,1024)}).setTimestamp();await sendLog(m.guild,e);});
 client.on("messageUpdate",async(a,b)=>{if(!b.guild||b.author&&b.author.bot||a.content===b.content)return;const e=new EmbedBuilder().setColor("#E0A526").setTitle("Message edited").addFields({name:"Channel",value:"<#"+b.channelId+">",inline:true},{name:"Author",value:b.author?b.author.tag:"Unknown",inline:true},{name:"Before",value:(a.content||"Unavailable").slice(0,900)},{name:"After",value:(b.content||"Unavailable").slice(0,900)}).setTimestamp();await sendLog(b.guild,e);});
 client.on("guildMemberRemove",async m=>{const e=new EmbedBuilder().setColor("#D9534F").setTitle("Member left").setDescription(m.user.tag+" ("+m.id+")").setTimestamp();await sendLog(m.guild,e);});
 client.on("guildMemberAdd",async m=>{const e=new EmbedBuilder().setColor("#36B37E").setTitle("Member joined").setDescription(m.user.tag+" ("+m.id+")").setTimestamp();await sendLog(m.guild,e);});
}
module.exports={configureLogs,moderate,warnings,logEvents};
