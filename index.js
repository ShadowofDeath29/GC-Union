const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const bot = new Discord.Client();
let cooldown = new Set();
let cdseconds = 86400;

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online!`);
  bot.user.setActivity("%present for Attendance", {type: "WATCHING"});
  
});

bot.on("message", async message => {
if(message.author.bot) return;
if(message.channel.type === "dm") return;
  
let prefix = botconfig.prefix;
  
  if(!message.content.startsWith(prefix)) return;
let messageArray = message.content.split(" ");
let cmd = messageArray[0];
let args =  messageArray.slice(1);
    
 if(cmd === `${prefix}present`){
   
    let gcmemberRole1 = message.guild.roles.find("name", "GC - Member 1.0");
    let gcmemberRole2 = message.guild.roles.find("name", "GC - Member 2.0");
   
   if(message.member.roles.has(gcmemberRole1.id) || message.member.roles.has(gcmemberRole2.id)) {
   if(cooldown.has(message.author.id)){
    message.delete();
  return message.reply("You have to wait 1 day.")
  }
  cooldown.add(message.author.id);
     
  let c_user = message.author   
  let bicon = c_user.displayAvatarURL;   
  let bicon2 = bot.user.displayAvatarURL;   
  let userroles = message.member.roles.filter(g => g.name != "@everyone").map(u=> `<@&${u.id}>`).join(", ");   
     
  let attendanceEmbed = new Discord.RichEmbed()
  .setDescription(`${message.author}`)
  .addField("Username", `${message.author.username}`)
  .addField("Tag", `${message.author.tag}`)
  .addField("ID", `${message.author.id}`)
  .addField("Roles", `${userroles}`)
  .setColor("#15f153")
  .setThumbnail(bicon)
  .addField("Attendance", "Present")
  .setTimestamp()
  .setFooter("UNION GC Attendance",bicon2);
  
  let attendancechannel = message.guild.channels.find(`name`, "gc-attendance");
  if (!attendancechannel) return message.channel.send("Couldn't find attendance channel.");
  
  
  message.delete().catch(O_o=>{});
  attendancechannel.send(attendanceEmbed);
      } else {
     message.reply("You don't have the permission to use this command.");
   }
   setTimeout(() => {
      cooldown.delete(message.author.id)
      }, cdseconds * 1000)

    
  }
  
  if(cmd === `${prefix}botinfo`){
   
  let bicon = bot.user.displayAvatarURL;
  let botembed = new Discord.RichEmbed()
  .setDescription("Bot Information")
  .setColor("#15f153")
  .setThumbnail(bicon)
  .addField("Bot Name", bot.user.username);
   
  return message.channel.send(botembed);
}
    
});

bot.login(process.env.BOT_TOKEN);
