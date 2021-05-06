const Discord = require('discord.js')
require('datejs')
const Quote = require('inspirational-quotes')

const embedder = async (msg, str) => {
  const embed = new Discord.MessageEmbed()
    .setColor("#"+Math.floor(Math.random()*16777215).toString(16))
    .setDescription(str===""?'Its empty':str)
  return msg.channel.send(embed)
}

const calculateStreak = async (logs, startDate) => {
  var milli = Date.now() - startDate
  var day = Math.floor(1 + milli / (1000*3600*24))
  str=1
  n=logs.length-1
  if(day!=logs[n].date){
    return 0
  } else {
    while(n--){
      if(day-logs[n].date==1){
        day=logs[n].date
        str++
      } else if(day-logs[n].date!=0)
        break
    }
    return str
  }
}

const maxStreak = async (logs, startDate) =>{
  if(logs.length<1)return 0
  curr=1
  n=logs.length-1
  max = 0
  day = logs[n].date
  while(n--){
    if(day-logs[n].date==1){
      curr++
    } else if(day-logs[n].date!=0){
      if(curr>max)
        max=curr
      curr=1
    }
    day=logs[n].date
  }
  return max>curr?max:curr
}

const totalDays = async (logs, startDate) => {
  var milli = Date.now() - startDate
  return Math.floor(1 + milli / (1000*3600*24))
}

const totalDistinct = async (logs) => {
  n=logs.length-1
  day = logs[n].date
  ans=1
  while(n--){
    if(day-logs[n].date){
      day=logs[n].date
      ans++
    }
  }
  return ans
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
    value: `Days Since Start: \`${await totalDays(logs.info, logs.startDate)}\`
    Total logs \`++add\`ed: \`${logs.info.length}\`
    Logs Privacy: \`${logs.open?'Open':'Hidden'}\``
  },{
    name:'Quote of the Day',
    value: `${quotation.text}\n‎‎‎*-${quotation.author}*`
  })
    

  msg.channel.send(embed)
}

const listAll = async (msg, logs, open)=>{
  n = logs.length
  display = ""
  final=[]
  prev = -1
  count=0
  pageLimit=512
  //=============== to String and pagify if needed ====================
  while(n--){
    if(logs[n].date!=prev){
      prev=logs[n].date;
      str = "**Day#"+logs[n].date+"**"
      if(str.length+display.length>pageLimit){
        console.log(str.length+""+display.length)
        final.push(display)
        display=""
      }
      display+="\n"+str
    }
    str = "- "+logs[n].logged
    if(str.length+display.length>pageLimit){
      // console.log(`lower if`)
      final.push(display)
      display=""
    }
    display+=str+"\n"
  }
  final.push(display)

  //========== now output if more than one pages are needed ============
  if(final.length!=1){
    n=1
    const embed = new Discord.MessageEmbed().setColor(0x344ceb)
    .setFooter(`Page ${n} of ${final.length}`)
    .setDescription(final[n-1])

    msg.channel.send(embed).then(newMsg => {
      newMsg.react('🔼').then(more => {//want more ? XD
        newMsg.react('🔽')
        
        //filters
        const upFilter = (r, u) => r.emoji.name==='🔼' && !u.bot// && u.id===msg.author.id
        const downFilter = (r, u) => r.emoji.name==='🔽' && !u.bot

        const up = newMsg.createReactionCollector(upFilter, {time:open?60000:25000})
        const down = newMsg.createReactionCollector(downFilter, {time:open?60000:25000})

        up.on('collect', (reaction, user) => {
          if(n===1){
            newMsg.reactions.resolve('🔼').users.remove(user.id)
            return
          }
          n--
          embed.setDescription(final[n-1])
          embed.setFooter(`Page ${n} of ${final.length}`)
          newMsg.edit(embed)
          up.empty()
          newMsg.reactions.resolve('🔼').users.remove(user.id)
        })

        down.on('collect', (reaction, user) => {
          if(n===final.length){
            newMsg.reactions.resolve('🔽').users.remove(user.id)
            return
          }
          n++
          embed.setDescription(final[n-1])
          embed.setFooter(`Page ${n} of ${final.length}`)
          newMsg.edit(embed)
          down.empty()
          newMsg.reactions.resolve('🔽').users.remove(user.id)
        })
      })
      if(!open && msg.channel.type!=='dm'){
        msg.delete({timeout:5000})
        newMsg.delete({timeout:30000})
        //.then(console.log)
        //.catch(console.error)
      }
    })
  } else {
    embedder(msg, final[0]).then(newMsg=>{
      if(!open && msg.channel.type!=='dm'){
        msg.delete({timeout:5000})
        newMsg.delete({timeout:25000})
        //.then(console.log)
        //.catch(console.error)
      }
    })
    console.log(final[0].length)
  }
}


module.exports = {
  embedder,
  listAll,
  calculateStreak,
  profile
}