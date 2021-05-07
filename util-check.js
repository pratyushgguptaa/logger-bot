const Database = require('@replit/database')
const db = new Database()

const {embedder, profile} = require('./utility')
const { calculateStreak } = require('./util-functions')
const { listAll } = require('./util-list')

const streak = async (msg, user, logs, startDate) => {
  str = await calculateStreak(logs, startDate)
  if (str)
    embedder(msg, `Current streak for **${user.username}** is ${str}`)
  else
    embedder(msg, `Hey mate you must add something to today's log, or else your streak will become \`0\` !!`)
}

const utilStreak = async (msg) => {
  if (msg.mentions.users.first() === undefined)
    db.get(msg.author.id + "").then(logs => {
      if (logs != null && typeof logs.info !== 'undefined')
        streak(msg, msg.author, logs.info, logs.startDate)
      else
        embedder(msg, `**${msg.author.tag}**, you do not have any current logs. Use \`++add {log}\` to start logging.`)
    })
  else {
      user = msg.mentions.users.first()
      db.get(user.id + "").then(logs => {
        if (logs != null && typeof logs.info !== 'undefined' && logs.info.length > 0)
          streak(msg, user, logs.info, logs.startDate)
        else
          embedder(msg, `${user.username} has no active logs, cannot calculate streak!`)
      })
    }
}

const utilProfile = async (msg) => {
  if (msg.mentions.users.first() === undefined)
    db.get(msg.author.id).then(logs => {
      if(logs && typeof logs.info !== 'undefined')
        profile(msg, msg.author, logs)
      else
        msg.reply(`You don't have any logs currently. Start logging with us to check out your profile.`)
    })
  else {
    user = msg.mentions.users.first()
    db.get(user.id + "").then(logs => {
      if(logs && typeof logs.info !== 'undefined')
        profile(msg, user, logs)
      else
        embedder(msg, `The user, ${user.username}, has not started logging yet.`)
    })
  }
}

const utilList = async (msg) => {
  if (msg.mentions.users.first() === undefined) {
      db.get(msg.author.id + "").then(logs => {
        if (logs != null && typeof logs.info !== 'undefined' && logs.info.length > 0)
          listAll(msg, logs.info, logs.open)
        else
          embedder(msg,  `You do not have any logs ${msg.author}. Start logging with \`++add {log}\` to check out your logs.`)
      })
    } else {
      user = msg.mentions.users.first()
      db.get(user.id + "").then(logs => {
        if (logs != null && typeof logs.info !== 'undefined' && logs.info.length > 0)
          if (logs.open)
            listAll(msg, logs.info, logs.open)
          else
            msg.channel.send(`The user, ${user.username}'s account is private.`)
        else
          embedder(msg, `${user.username} has not started any logging yet.`)
      })
    }
}

module.exports = {
  utilProfile,
  utilStreak,
  utilList
}