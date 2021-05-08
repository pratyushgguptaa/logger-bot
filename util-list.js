const Discord = require('discord.js')
const { embedder } = require('./utility')

/**
 * To show on the channel a list of all the logs by either in a single page
 * if character size exceeds @var {pageLimit} then it creates different pages of the list
 * to show different pages in embed, two reaction buttons are added to switch pages
 * @param {Message} msg Discord Message send by utilList which created the event 'message'
 * @param {info[]} logs info.logs array of all the logs to be shown
 * @param {boolean} open if the privacy is on or off and delete the message accordingly
 */
const listAll = async (msg, logs, open) => {
  n = logs.length
  display = ''
  final = []
  prev = -1
  count = 0
  pageLimit = 512
  //=============== to String and pagify if needed ====================
  while (n--) {
    if (logs[n].date != prev) {
      //if new day number is to be prefixed
      prev = logs[n].date
      str = '**Day#' + logs[n].date + '**'
      if (str.length + display.length > pageLimit) {
        //checking if new data will cross the pageLimit
        //pushing in to create different element in the array
        console.log(str.length + '' + display.length)
        final.push(display)
        display = '' //reset the display string
      }
      display += '\n' + str
    }
    //for each new log
    str = '- ' + logs[n].logged
    //checking if it would cross the pageLimit and push accordingly
    if (str.length + display.length > pageLimit) {
      // console.log(`lower if`)
      final.push(display)
      display = ''
    }
    display += str + '\n'
  }
  //atLast pushing the last available string in the final list
  final.push(display)

  //========== now output if more than one pages are needed ============
  if (final.length != 1) {
    n = 1
    //going from right to left i.e., most recent log first
    const embed = new Discord.MessageEmbed()
      .setColor(0x344ceb)
      .setFooter(`Page ${n} of ${final.length}`)
      .setDescription(final[n - 1])
    msg.channel.send(embed).then((newMsg) => {
      //reacting with the navigation buttons
      newMsg.react('🔼').then((more) => {
        //want more ? XD
        newMsg.react('🔽')

        //to dont let the bot or any other emoji interfere
        const upFilter = (r, u) => r.emoji.name === '🔼' && !u.bot //here i am letting any one to navigate not only the author
        const downFilter = (r, u) => r.emoji.name === '🔽' && !u.bot

        //these are the reaction collector with collects reaction
        //by frist filtering them and upto a given time
        const up = newMsg.createReactionCollector(upFilter, {
          time: open ? 60000 : 25000, //up button reaction collection
        })
        const down = newMsg.createReactionCollector(downFilter, {
          time: open ? 60000 : 25000, //down button reaction collection
        })

        up.on('collect', (reaction, user) => {
          //for each up emoji reacted
          newMsg.reactions.resolve('🔼').users.remove(user.id)
          if (n === 1)
            //cannot go up from the first page
            return
          n-- //going up if not the first page
          embed.setDescription(final[n - 1])
          embed.setFooter(`Page ${n} of ${final.length}`)
          newMsg.edit(embed) //editing with the new details
          up.empty() //clear the reaction collector for new reactions
        })

        down.on('collect', (reaction, user) => {
          newMsg.reactions.resolve('🔽').users.remove(user.id)
          if (n === final.length)
            //cannot go down from the last page
            return
          n++ //going down if not the last page
          embed.setDescription(final[n - 1])
          embed.setFooter(`Page ${n} of ${final.length}`)
          newMsg.edit(embed) //editing with the new details
          down.empty() //clear the reaction collector for new reactions
        })
      })
      //delete the list if account is private and not in DMchannel
      if (!open && msg.channel.type !== 'dm') {
        msg.delete({ timeout: 5000 })
        newMsg.delete({ timeout: 30000 })
      }
    })
  } else {
    //when only single page is required we just embed and send out
    embedder(msg, final[0]).then((newMsg) => {
      //timer if private and not DMchannel
      if (!open && msg.channel.type !== 'dm') {
        msg.delete({ timeout: 5000 })
        newMsg.delete({ timeout: 25000 })
      }
    })
  }
}

module.exports = {
  listAll,
}
