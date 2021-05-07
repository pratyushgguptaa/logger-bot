const Discord = require('discord.js')
require('datejs')
const Quote = require('inspirational-quotes')
const { calculateStreak, maxStreak, totalDays, totalDistinct} = require('./util-functions')

const embedder = async (msg, str) => {
  const embed = new Discord.MessageEmbed()
    .setColor("#"+Math.floor(Math.random()*16777215).toString(16))
    .setDescription(str===""?'Its empty':str)
  return msg.channel.send(embed)
}

const profile = async (msg, user, logs) => {
  quotation = Quote.getQuote()
  var d = new Date(logs.startDate+19800000)
  loggedDays = await totalDistinct(logs.info)
  maxDays = loggedDays<=30?30:loggedDays<=100?100:365
  
  front = Math.floor(loggedDays * 20 / maxDays)
  back = 20 - front
  progress="["
  for(i=0;i<front;i++){
    progress+='■'
  }
  for(i=0;i<back;i++){
    progress+='□'
  }
  progress+="](https://replit.com/@pratyushgguptaa/Logger-BOT)"
  const embed = new Discord.MessageEmbed()
  .setColor("#"+Math.floor(Math.random()*16777215).toString(16))
  .setAuthor(
    `${user.username}'s profile`,
    user.displayAvatarURL()
  )
  .setDescription('Coder')
  .setFooter('++help for more', msg.client.user.avatarURL())
  .addFields({
    name:'First Log At',
    value:`\`${d.toString("d/M/yyyy h:mm:ss tt")} (IST)\`\n\n`
  },{
    name: 'Days logged',
    value: `\`${loggedDays}\`\n${progress}`,
    inline:true
  },{
    name: `Target`,
    value: `${loggedDays==30||loggedDays==100||loggedDays>=365?``:`\`${maxDays} Days of Code\``}
            ${loggedDays>=365?`Acquired: \`365 Days of Code\``:``}
            ${loggedDays>=100?`Acquired: \`100 Days of Code\``:``}
            ${loggedDays>=30?`Acquired: \`30 Days of COde\``:``}`,
    inline:true
  },{
    name:'Streaks',
    value:`**Current:**  \`${await calculateStreak(logs.info, logs.startDate)}\`
    **Longest:**  \`${await maxStreak(logs.info, logs.startDate)}\``,
    inline:true 
  },{
    name:'Info',
    value: `Days Since Start: \`${await totalDays(logs.startDate)}\`
    Total logs \`++add\`ed: \`${logs.info.length}\`
    Logs Privacy: \`${logs.open?'Open':'Hidden'}\``
  },{
    name:'Quote of the Day',
    value: `${quotation.text}\n‎‎‎*-${quotation.author}*`
  })
  
  msg.channel.send(embed)
}

module.exports = {
  embedder,
  profile
}