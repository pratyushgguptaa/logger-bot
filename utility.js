/**
 * This module contains the @function embedder which is used by all other modules
 * to show the result in an embed form
 * the other @function profile show the complete information of a user with all the streaks
 */

const Discord = require('discord.js')
//DateJS npm package extends the built-in JavaScript Date object to add much better parsing
require('datejs')

//A simple NPM Package which returns random Inspirational Quotes.
const Quote = require('inspirational-quotes')
//the required functions to calculate streaks
const {
  calculateStreak,
  maxStreak,
  totalDays,
  totalDistinct,
} = require('./util-functions')

/**
 * To create an Embed with the given string as description
 * send it to the same channel as msg
 * @param {Message} msg Discord message which created the event 'message'
 * @param {String} str the string to be inserted into the embed
 * @returns {Promise<Message|Message[]>}
 */
const embedder = async (msg, str) => {
  const embed = new Discord.MessageEmbed()
    .setColor('#' + Math.floor(Math.random() * 16777215).toString(16))
    .setDescription(str === '' ? 'Its empty' : str)
  return msg.channel.send(embed)
}

/**
 * To send all the details of the specified user in an embed with all the streaks,
 * The number of days, privacy settings, target Days of Code and
 * one inspirational quote.
 * @param {Message} msg Discord Message which created the event 'message'
 * @param {User} user Discord User to show profile of
 * @param {record} logs record from the key value in the replit/database of the user
 */
const profile = async (msg, user, logs) => {
  quotation = Quote.getQuote()
  /**
   * To get the startDate converted to IST (GMT +5:30)
   * @var {Date} d
   */
  var d = new Date(logs.startDate + 19800000)
  /**
   * @var {number} total number of distinct days since startDate
   */
  loggedDays = await totalDistinct(logs.info)

  /**
   * Setting the next target according to the current number of logged days
   * divided in three categories {30|100|365} number of days
   * @var {number} maxDays
   */
  maxDays = loggedDays <= 30 ? 30 : loggedDays <= 100 ? 100 : 365

  /**
   * Here i am creating a progress bar and its pretty simple actually
   * I first calculate how much part is the loggedDays of the maxDays
   * which will be in the range [0, 1] included, now multiply by a fixed number
   * This fixed number is the number of parts to divide the progress bar into
   * Now taking an empty string adding filled squares in it for front and
   * empty squares for back.
   *
   * While this is only a string and will be shown in white.
   * We use markdown to convert it into a link to change its color to blue.
   * The markdown (Text to show)[linked url/html]
   * @var {number} front the number of front squares
   * @var {number} back the number of back squares left to be filled
   * @var {string} progress the progress bar which will be shown
   */
  front = Math.floor((loggedDays * 20) / maxDays)
  back = 20 - front
  progress = '['
  for (i = 0; i < front; i++) {
    progress += '■'
  }
  for (i = 0; i < back; i++) {
    progress += '□'
  }
  progress += '](https://replit.com/@pratyushgguptaa/Logger-BOT)'
  /**
   * Creating the @object {MessageEMbed} embed with all the required details
   * Adding random color
   * Setting the author to the specified user
   * And adding all the required fields.
   * 1. FIrst Log at @type {Date}
   * 2. Days Logged @type {number}
   * 3. Target (that will be categorized by the maxDays)
   * 4. Streak (which will be calculated)
   * -- Current streak @type {number}
   * -- Longest streak @type {number}
   * 5. Miscellaneous info of the user such as
   * -- Number of days passed since start @type {Date}
   * -- Total number of logs that have been recorded @type {Number}
   * -- Current privacy settings of the user @type {open|hidden}
   * 6. A random Quote of the day @type {Quote}
   */
  const embed = new Discord.MessageEmbed()
    .setColor('#' + Math.floor(Math.random() * 16777215).toString(16))
    .setAuthor(`${user.username}'s profile`, user.displayAvatarURL())
    .setDescription('Coder')
    .setFooter('++help for more', msg.client.user.avatarURL())
    .addFields(
      {
        name: 'First Log At',
        value: `\`${d.toString('d/M/yyyy h:mm:ss tt')} (IST)\`\n\n`,
      },
      {
        name: 'Days logged',
        value: `\`${loggedDays}\`\n${progress}`,
        inline: true,
      },
      {
        name: `Target`,
        value: `${
          loggedDays == 30 || loggedDays == 100 || loggedDays >= 365
            ? ``
            : `\`${maxDays} Days of Code\``
        }
            ${loggedDays >= 365 ? `Acquired: \`365 Days of Code\`` : ``}
            ${loggedDays >= 100 ? `Acquired: \`100 Days of Code\`` : ``}
            ${loggedDays >= 30 ? `Acquired: \`30 Days of COde\`` : ``}`,
        inline: true,
      },
      {
        name: 'Streaks',
        value: `**Current:**  \`${await calculateStreak(
          logs.info,
          logs.startDate
        )}\`
    **Longest:**  \`${await maxStreak(logs.info, logs.startDate)}\``,
        inline: true,
      },
      {
        name: 'Info',
        value: `Days Since Start: \`${await totalDays(logs.startDate)}\`
    Total logs \`++add\`ed: \`${logs.info.length}\`
    Logs Privacy: \`${logs.open ? 'Open' : 'Hidden'}\``,
      },
      {
        name: 'Quote of the Day',
        value: `${quotation.text}\n‎‎‎*-${quotation.author}*`,
      }
    )

  msg.channel.send(embed)
}

module.exports = {
  embedder,
  profile,
}
