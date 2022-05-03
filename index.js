const {Discord, MessageEmbed,  Collection} = require('discord.js');
const Canvas = require('canvas')
const   { Client, Intents, MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js'),
        client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES ] }),
        fs = require('fs');
const moment = require("moment");
const prefix = "!";
const dev = "Dev </> Team";
const db = require('quick.db');
const usersMap = new Map();
const botname = "esm bot";
const inviteLink = "";
require("moment-duration-format");
const cooldown = new Set();
const cdtime = 5;


client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");
["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});


client.on("ready", () => {

    client.user.setPresence({
      status: 'idle',
      activity: {
          name: `ElecTroN404`,
          type: 'PLAYING',
      }
  })

console.log("Bot is online")
})

//===========================SERVER INFO============================================

client.on("message", async (message)=>{

	if (message.content.startsWith(`${prefix}serverinfo`)){
	  const embed = new MessageEmbed()
	  .setTitle(`${message.guild.name} Info`)

	  .setColor(`#fffff`)
	  .addField(`👑 Server Owner`, `**${message.guild.owner}**`)
	  .addField(`👒 MemberCount`, `**${message.guild.memberCount}**`)
	  .addField(`✅ Online Members`, `**${message.guild.members.cache.filter(member => member.presence.status !== "offline").size}**`)
	  .addField(`🎈 Offline Members`, `**${message.guild.members.cache.filter(member => member.presence.status == "offline").size}**`)
	  .addField(`🧸 Emojis Count`, `**${message.guild.emojis.cache.size}**`)
	  .addField(`🎐 Role Count`, `**${message.guild.roles.cache.size}**`)
	  .addField(`Server Id`,`${message.guild.id}`)
	  .addField(`Region of Server`,`${message.guild.region}`)
	  .addField(`Level Of Server Boost`,`${message.guild.premiumTier}`)
	  .addField(`Number Of Server Boost`,`${message.guild.premiumSubscriptionCount}`)
	  .addField(`Verification Level Of Server`,`${message.guild.verificationLevel}`)
	  .addField(`Vanity Code`,`${message.guild.vanityURLCode}`)
	  .addField(`Server Description`,`${message.guild.description}`)
	  message.channel.send(embed)
	}
})


//=============================BOT INFO============================================
client.on("message", async (message) =>{
	if(message.content === prefix + "botinfo"){
       const embed = new MessageEmbed()
	   .setColor("#fffff")
	   .setAuthor(client.user.tag)
	   .setURL(client.user.displayAvatarURL())
	   .addField(`> 📂Memory Usage: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB
	   > 🏘Servers Count:${client.guilds.cache.size}
	   > 👥Users Count:${client.users.cache.size}
	   > Channels Count:${client.channels.cache.size}
	   > 🛠 Developers of This Bot : ${dev}`)
    message.channel.send(embed)
	}
});



//===================================USER INFO==================================
client.on("message", async (message)=> {
	if(message.content.startsWith(`${prefix}userinfo`)){
    let userArray = message.content.split(" ");
    let userArgs = userArray.slice(1);
    let member = message.mentions.members.first() || message.guild.members.cache.get(userArgs[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === userArgs.slice(0).join(" ") || x.user.username === userArgs[0]) || message.member;

    if (member.presence.status === 'dnd') member.presence.status = 'Do Not Disturb ⛔';
    if (member.presence.status === 'online') member.presence.status = 'Online 🟢';
    if (member.presence.status === 'idle') member.presence.status = 'Idle 🌙';
    if (member.presence.status === 'offline') member.presence.status = 'offline ⚫';

    let x = Date.now() - member.createdAt;
    let y = Date.now() - message.guild.members.cache.get(member.id).joinedAt;
    const joined = Math.floor(y / 86400000);
    
    const joineddate = moment.utc(member.joinedAt).format("dddd, MMMM Do YYYY, HH:mm:ss");
    let status = member.presence.status;

    const embed = new MessageEmbed()
    .setAuthor(member.user.tag, member.user.displayAvatarURL())
    .setTimestamp()
    .setColor('WHITE')
    .setImage(member.user.displayAvatarURL())
    .addField(`Status of User ` , `${status} `)
    .addField("Member ID", member.id)
    .addField('Roles', `<@&${member._roles.join('> <@&')}>`)
    .addField("Account Created On:", ` ${moment.utc(member.user.createdAt).format("dddd, MMMM Do YYYY")}`, true) 
    .addField('Joined the server At', `${joineddate} \n> ${joined} day(S) Ago`)

    message.channel.send(embed);
}}
)



//=============================BAN===================================


client.on('message', message => {
	if (!message.guild) return;
  
	if (message.content.startsWith(`${prefix}ban`)) {
	
	  const user = message.mentions.users.first();

	  if (user) {
		const member = message.guild.members.resolve(user);
		if (member) {
		  member
			.ban({
			  reason: 'They were bad!',
			})
			.then(() => {
			
			  message.channel.send(`Successfully banned ${user.tag}`);
			})
			.catch(e => {
    const errormsg = new MessageEmbed()
    .setColor('RANDOM')
    .setTitle('ERROR :x:')
    .addField(`I was unable Ban member !`)
    .setTimestamp()
    .setDescription('```js\n' + e + '\n```')
    message.channel.send(errormsg);
  });
		} else {
		
		  message.channel.send("That user isn't in this guild!");
		}
	  } else {
		message.channel.send("You didn't mention the user to ban!");
	  }
	}
  });
  
  //===========================KICK=================================
client.on('message', message => {
	if (!message.guild) return;
  
	if (message.content.startsWith(`${prefix}kick`)) {
	
	  const user = message.mentions.users.first();

	  if (user) {
		const member = message.guild.members.resolve(user);
		if (member) {
		  member
			.kick({
			  reason: 'They were bad!',
			})
			.then(() => {
			
			  message.channel.send(`Successfully kicked ${user.tag}`);
			})
			.catch(e => {
    const errormsg = new MessageEmbed()
    .setColor('RANDOM')
    .setTitle('ERROR :x:')
      .setTimestamp()
    .addField(`I was unable to kick the member`)
    .setDescription('```js\n' + e + '\n```')
    message.channel.send(errormsg);
  });
		} else {
		
		  message.channel.send("That user isn't in this guild!");
		}
	  } else {
		message.channel.send("You didn't mention the user to kick!");
	  }
	}
  });
  
  //============================UNBAN====================================

client.on('message', message => {
  
	if (message.content === prefix + "unban") {
	if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
		const banembed = new MessageEmbed()
			.setDescription("*I don't have permission to use this command*")
			.setFooter(`${dev} | Prefix: ${prefix} `)
			.setColor("#fffff")
			.setTimestamp(Date.now());
		message.channel.send(banembed);
	}
	if (!message.member.hasPermission("BAN_MEMBERS")) {
		const banembed = new MessageEmbed()
			.setDescription("*You don't have permission to use this command*")
			.setFooter(`${dev} | Prefix: ${prefix} `)
			.setColor("#fffff")
			.setTimestamp(Date.now());
		message.channel.send(banembed);
	} else {
		var testCont = message.content.split(" ");
		var content = message.content.split(" ").slice(2).join(' ');
		var args1 = message.content.split(" ").slice(1);
		var unbanned = args1[0];
		if (testCont.length <= 1) {
			const banembed = new MessageEmbed()
				.setDescription("*Please provide an ID of the user to unban!*")
				.setFooter(`${dev}| Prefix: ${prefix} `)
				.setColor("#fffff")
				.setTimestamp(Date.now());
			message.channel.send(banembed);
		} else if (testCont.length <= 2) {
			const banembed = new MessageEmbed()
				.setDescription("*Please provide a reason for the unban.*")
				.setFooter(`${dev} | Prefix: ${prefix} `)
				.setColor("#fffff")
				.setTimestamp(Date.now());
			message.channel.send(banembed);
		} else {
			message.guild.members.unban(unbanned).then(() => {
				const unbanembed = new MessageEmbed()
					.setTitle("Unbanned !")
					.setDescription(`Unbanned ${unbanned} [ID].`)
					.setAuthor(message.author.username + "#" + message.author.discriminator, `${message.author.avatarURL({ dynamic: true })}`)
					.addField("Moderator",
						`Unban administered by ${message.author.username}#${message.author.discriminator}`)
					.addField("Reason",
						`${content}`)
					.setColor("#fffff")
					.setTimestamp(Date.now());
				message.channel.send(unbanembed);
			})
				.catch(e => {
    const errormsg = new MessageEmbed()
    .setColor('RANDOM')
    .setTitle('ERROR :x:')
      .setTimestamp()
    .addField('The ID is invalid. | Not in the Server.')
    .setDescription('```js\n' + e + '\n```')
    message.channel.send(errormsg);
  });
		
		}
	}}
})

//===============================================================
client.login(process.env.token)
