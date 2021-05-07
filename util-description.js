const Discord = require('discord.js')

/**
 * To print the information in an embed with the basic working
 * creating a @constructor MessageEmbed and then all its
 * @functions {setTitle, setColor, setDescription}
 * and at last calling the @function send
 * with the embed object as @argument
 * @param {Message} msg Discord Message with prefix '++info'
 */
const info = async (msg) => {
  const embed = new Discord.MessageEmbed()
    .setTitle('~Info about me~')
    .setColor('0x0000ff')
    .setDescription(
      'Whenever You start your first log, i will capture the time to be your start time. For each 24 days from that time your days will be calculated.\nAs:\nFor 24 hours it will be day 1.\nNext 24 hours will be day 2 (no matter when you log afterwards).\n**There is no option to add in previous day** (and why would you log in previous day anyway).\nYou can also use multiple `++add` to push your current day logs together!\n\nUse `++help` to know more about my functionalities.'
    )

  msg.channel.send(embed)
}

/**
 * To send in an embed all the commands executable on the bot
 * Different fields are added in the @constructor MessageEmbed
 * @function addFields and each argument is a field with
 * @param {name, value} [inline = false] the field details
 * and whether the field will be inline or not
 * @param {Message} msg Discord Message with prefix '++help'
 */
const help = async (msg) => {
  const embed = new Discord.MessageEmbed()
    .setTitle('All commands you can use!')
    .setColor('0x00ff00')
    .setDescription(
      `Log your daily activities with these easy commands!!\n*Remember you cannot edit any logs of previous days. Hence choose wisely!*`
    )
    .addFields(
      {
        name: '`++add {log}`',
        value: 'can add multiple logs for the same day!',
        inline: true,
      },
      //	{ name: '\u200B', value: '\u200B' },
      { name: '`++list`', value: 'to list all the logs', inline: true },
      {
        name: '`++list {userTag}`',
        value:
          'to list the logs of the specified user.(logs will be shown only if the person has privacy turned off.)',
        inline: true,
      },
      {
        name: '`++privacy {on|off|null|userTag}`',
        value:
          'to set your privacy setting on or off. Or null to check your current settings.\n*Also when your privacy is on, the logs you `++add` will automatically be deleted so no need to worry!*\nTag another user to check there privacy!!',
        inline: true,
      },
      {
        name: '`++update {log}`',
        value:
          'to remove all logs of today and set the specified log as the only log.',
        inline: true,
      },
      {
        name: '`++del {day_no}`',
        value:
          'it deletes all the logs for the day specified in the arguments.',
        inline: true,
      },
      {
        name: '`++streak {userTag|null}`',
        value: "To get the current streak for your or someone's DaysOfCode!",
        inline: true,
      },
      {
        name: '`++info`',
        value: 'Show information about I work.',
        inline: true,
      },
      {
        name: '`++profile {null|userTag}`',
        value:
          "Show information about your account or someone else's Logger account.",
        inline: true,
      }
    )
  msg.channel.send(embed)
}

module.exports = {
  info,
  help,
}
