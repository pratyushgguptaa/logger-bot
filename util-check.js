const Database = require('@replit/database')
const db = new Database()

const utility = require('./utility')
const { calculateStreak } = require('./util-functions')
const { listAll } = require('./util-list')

const streak = async (msg, user, logs, startDate) => {
  str = await calculateStreak(logs, startDate)
  if (str)
    utility.embedder(msg, `Current streak for **${user.username}** is ${str}`)
  else
    utility.embedder(msg, `Hey mate you must add something to today's log, or else your streak will become \`0\` !!`)
}

const utilStreak = async (msg) => {
  if (msg.mentions.users.first() === undefined)
    db.get(msg.author.id + "").then(logs => {
      if (logs != null && typeof logs.info !== 'undefined' && logs.info.length > 0)
        streak(msg, msg.author, logs.info, logs.startDate)
      else
        utility.embedder(msg, `Sorry, **${msg.author.tag}**, you dont have any current logs. Use \`++add {log}\` to start logging.`)
    }).catch(() =>
      utility.embedder(msg, `${msg.author.tag}, how can i show your streaks when you didnt start any logging.`)
    )
  else {
      user = msg.mentions.users.first()
      db.get(user.id + "").then(logs => {
        if (logs != null && typeof logs.info !== 'undefined' && logs.info.length > 0)
          streak(msg, user, logs.info, logs.startDate)
        else
          utility.embedder(msg, `${user.username} has no active logs, cannot calculate streak!`)
      }).catch(() =>
        utility.embedder(msg, `how can i show *${user.username}*'s streaks when they didnt start any logging.`)
      )
    }
}

const utilProfile = async (msg) => {
  if (msg.mentions.users.first() === undefined)
    db.get(msg.author.id).then(logs => {
      if(logs && typeof logs.info !== 'undefined' && logs.info.length > 0)
        utility.profile(msg, msg.author, logs)
      else
        msg.reply(`You don't have any logs currently. Start logging with us to check out your profile.`)
    })
  else {
    user = msg.mentions.users.first()
    db.get(user.id + "").then(logs => {
      if(logs && typeof logs.info !== 'undefined' && logs.info.length > 0)
        utility.profile(msg, user, logs)
      else
        utility.embedder(msg, `how can i show *${user.username}*'s profile when they didnt start any logging.`)
    })
  }
}

const utilList = async (msg) => {
  if (msg.mentions.users.first() === undefined) {
      console.log(`Listing for ${msg.author.tag}`)
      db.get(msg.author.id + "").then(logs => {
        if (logs != null && typeof logs.info !== 'undefined' && logs.info.length > 0)
          listAll(msg, logs.info, logs.open)
        else
          utility.embedder(msg, `Bro khali h ${msg.author}`)
      })
    } else {
      user = msg.mentions.users.first()
      console.log(`Listing for ${user.tag}`)
      db.get(user.id + "").then(logs => {
        if (logs != null && typeof logs.info !== 'undefined' && logs.info.length > 0)
          if (logs.open)
            listAll(msg, logs.info, logs.open)
          else
            msg.channel.send(`Sorry bro, ${user.username} is hidden.`)
        else
          utility.embedder(msg, `Bro khali h ${user.username}`)
      })
    }
}

module.exports = {
  utilProfile,
  utilStreak,
  utilList
}