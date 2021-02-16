const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async(bot, message, args) => {
    if (!message.content.startsWith(process.env.PREFIX)) return;

    const embed = new Discord.MessageEmbed()
        .setDescription(`Level Leaderboard: \`!leaderboard levels\` || Message Leaderboard: \`!leaderboard messages\``)
        .setColor("#FFFFFF")


    if (!args[0]) return message.channel.send(embed)

    if (args[0] == 'levels') {
        let level = db.startsWith(`level_${message.guild.id}`, { sort: '.data' })
        let content = "";

        for (let i = 0; i < level.length; i++) {
            let userID = level[i].ID.split('_')[2]
            let user = "<@" + userID + ">"

            if (level[i].data == 1000000) {
                content += `${i+1}. ${user} - God tier (1,000,000 plus)\n`
            } else {
                content += `${i+1}. ${user} - ${level[i].data}\n`
            }

        }

        const embed1 = new Discord.MessageEmbed()
            .setDescription(`**${message.guild.name}'s Level Leaderboard**\n\n${content}`)
            .setColor("#3d728d")

        message.channel.send(embed1)
    } else if (args[0] == 'messages') {
        let messages = db.startsWith(`messages_${message.guild.id}`, { sort: '.data' })
        let content = "";

        for (let i = 0; i < messages.length; i++) {
            let userID = messages[i].ID.split('_')[2]
            let user = "<@" + userID + ">"


            content += `${i+1}. ${user} ~ ${messages[i].data}\n`
        }

        const embed2 = new Discord.MessageEmbed()
            .setDescription(`**${message.guild.name}'s Messages Leaderboard**\n\n${content}`)
            .setColor("#3d728d")

        message.channel.send(embed2)

    }
}
module.exports.help = {
    name: "leaderboard"
}