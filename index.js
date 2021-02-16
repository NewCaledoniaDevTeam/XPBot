const Discord = require("discord.js");
const bot = new Discord.Client({ disableEveryone: true });
const Client = new Discord.Client({ disableEveryone: true });
const fs = require("fs");
const db = require("quick.db");
const dotenv = require('dotenv');
dotenv.config();
bot.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {

    if (err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if (jsfile.length <= 0) {
        console.log("Couldn't find commands.");
        return;
    }

    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${f} loaded!`);
        bot.commands.set(props.help.name, props);

    });
});

bot.on("ready", async() => {
    console.log(`${bot.user.username} is online on ${bot.guilds.cache.size} servers!`);
    bot.user.setStatus('online');
})

bot.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    let prefix = botconfig.prefix
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if (commandfile) commandfile.run(bot, message, args);
    if (commandfile) db.add(`commandran_${message.guild.id}`, 1);

    db.add(`messages_${message.guild.id}_${message.author.id}`, 1)
    let messagefetch = db.fetch(`messages_${message.guild.id}_${message.author.id}`)

    let messages;

    var i;
    for (i = 0; i < 1000000; i++) {
        if (messagefetch == 25) messages = 25; //Level 1
        else if (messagefetch == [i] * 100) messages = [i] * 100; // Level [i]
    }

    if (!isNaN(messages)) {
        db.add(`level_${message.guild.id}_${message.author.id}`, 1)
        let levelfetch = db.fetch(`level_${message.guild.id}_${message.author.id}`)

        let levelembed = new Discord.MessageEmbed()
            .setDescription(`${message.author}, You have leveled up to level ${levelfetch}`)
        message.channel.send(levelembed)
    }

})


//Custom playing status
const statusList = [
    { msg: "type !help for help", type: "PLAYING" },
    { msg: "Messages in the discord", type: "WATCHING" }
];

setInterval(async() => {
    const index = Math.floor(Math.random() * statusList.length + 1) - 1;
    await bot.user.setActivity(statusList[index].msg, {
        type: statusList[index].type
    });
}, 60000);

bot.login(process.env.DISCORD_TOKEN);