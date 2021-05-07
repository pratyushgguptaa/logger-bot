/**
 * This module is for checking
 * That is to route for any @mentions in the Message
 */

const Database = require('@replit/database')
const db = new Database()

const { embedder, profile } = require('./utility')
const { calculateStreak } = require('./util-functions')
const { listAll } = require('./util-list')

/**
 *
 * @param {Message} msg the discord message read
 * @param {User} user the user for which streak is to be calculated
 * @param {array} logs the array of logged messages
 * @param {number} startDate the time in milliseconds of first log
 */
const streak = async (msg, user, logs, startDate) => {
  /**
   * str is the number of current streak
   * if zero means not logged for today
   * else the streak till the current day
   * @type {number}
   */
  str = await calculateStreak(logs, startDate)
  if (str) embedder(msg, `Current streak for **${user.username}** is ${str}`)
  else
    embedder(
      msg,
      `Hey mate you must add something to today's log, or else your streak will become \`0\` !!`
    )
}

/**
 * utility message to be called to route and check for @mentions
 * and call the streak method accordingly
 * @param {Message} msg the discord message with prefix '++streak'
 */
const utilStreak = async (msg) => {
  //check if any @mentions are present
  if (msg.mentions.users.first() === undefined)
    //no @mentions, call the streak method with the msg author
    db.get(msg.author.id + '').then((logs) => {
      if (logs != null && typeof logs.info !== 'undefined')
        streak(msg, msg.author, logs.info, logs.startDate)
      else
        embedder(
          msg,
          `**${msg.author.tag}**, you do not have any current logs. Use \`++add {log}\` to start logging.`
        )
    })
  else {
    //@mentioned, call the streak method with the mentioned user
    user = msg.mentions.users.first()
    db.get(user.id + '').then((logs) => {
      if (
        logs != null &&
        typeof logs.info !== 'undefined' &&
        logs.info.length > 0
      )
        streak(msg, user, logs.info, logs.startDate)
      else
        embedder(
          msg,
          `${user.username} has no active logs, cannot calculate streak!`
        )
    })
  }
}

/**
 * routes to the profile function according to the @mentions in the
 * provided message
 * @param {Message} msg Discord Message with prefix '++profile'
 */
const utilProfile = async (msg) => {
  //check if and @mentions are present
  if (msg.mentions.users.first() === undefined)
    //if not, then call the profile with the author of the message
    db.get(msg.author.id).then((logs) => {
      if (logs && typeof logs.info !== 'undefined')
        profile(msg, msg.author, logs)
      else
        msg.reply(
          `You don't have any logs currently. Start logging with us to check out your profile.`
        )
    })
  else {
    //if @mentioned, then call the profile for the first user mention
    user = msg.mentions.users.first()
    db.get(user.id + '').then((logs) => {
      if (logs && typeof logs.info !== 'undefined') profile(msg, user, logs)
      else
        embedder(
          msg,
          `The user, ${user.username}, has not started logging yet.`
        )
    })
  }
}

/**
 * roputes according to the @mentions present in the message
 * to print the complete list of logs by the @function listAll
 * @param {Message} msg Discord Message with prefix '++list'
 */
const utilList = async (msg) => {
  //chcek if any @mentions are present
  if (msg.mentions.users.first() === undefined) {
    //call the @function listAll for the author of the message
    db.get(msg.author.id + '').then((logs) => {
      if (
        logs != null &&
        typeof logs.info !== 'undefined' &&
        logs.info.length > 0
      )
        listAll(msg, logs.info, logs.open)
      else
        embedder(
          msg,
          `You do not have any logs ${msg.author}. Start logging with \`++add {log}\` to check out your logs.`
        )
    })
  } else {
    //if @mention found, call listAll for the specified user
    user = msg.mentions.users.first()
    db.get(user.id + '').then((logs) => {
      if (
        logs != null &&
        typeof logs.info !== 'undefined' &&
        logs.info.length > 0
      )
        if (logs.open) listAll(msg, logs.info, logs.open)
        else
          msg.channel.send(`The user, ${user.username}'s account is private.`)
      else embedder(msg, `${user.username} has not started any logging yet.`)
    })
  }
}

module.exports = {
  utilProfile,
  utilStreak,
  utilList,
}
