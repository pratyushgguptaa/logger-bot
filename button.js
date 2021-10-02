//require database and instantiating db object
const Database = require('@replit/database')
const db = new Database()

//requiring all other utility functions
const { embedder, profile } = require('./utility')
const { streak } = require('./util-check')
const { listAll } = require('./util-list')

/**
 * Creates a messageButton, sets its label, style and id from the given parameters and returns the button
 * 
 * @param {Button Label} label the Label of the newly created button
 * @param {Button Style} style the Style of the newly created button
 * @param {Button ID} id the ID of the newly created button
 * @returns {MessageButton} messageButton the newly created button 
 */
function createMessageButton(label, style, id) {
  const messageButton = new but.MessageButton()
    .setLabel(label)
    .setStyle(style)
    .setID(id)

  return messageButton;
}

/**
 * Creates a list of buttons for all the basic uses
 * And send it to the msg.channel
 * The buttons are shown:
 * 1. Streak to show current streak
 * 2. List to list all Logs
 * 3. Profile to show profile
 * 4. Info to show information about the bot
 * 5. Help to show all the commands the bot can listen to
 *
 * @param {Discord-buttons(client)} but the object required from discord-buttons.js with the discord.js client
 * @param {Message} msg the message with ++buttons prefix
 */
const button = async (but, msg) => {
  const btn1 = createMessageButton('Streak', 'red', 'getStreak')
  const btn2 = createMessageButton('List', 'green', 'getList')
  const btn3 = createMessageButton('Profile', 'green', 'getProfile')
  const btn4 = createMessageButton('Info', 'blurple', 'getInfo')
  const btn5 = createMessageButton('Help', 'blurple', 'getHelp')

  msg.channel.send(
    'Discord Updates with buttons!\nNow type less *interact* more\nClick on the streak button to check your streak 😃',
    {
      buttons: [btn1, btn2, btn3, btn4, btn5],
    }
  )
}

/**
 * To show the current streak for the user who clicked the button and send message accordingly.
 *
 * @param {MessageButton} button the button which listened to onclick event for streak button
 */
const getStreak = async (button) => {
  db.get(button.clicker.user.id + '').then((logs) => {
    if (logs != null && typeof logs.info !== 'undefined')
      streak(button, button.clicker.user, logs.info, logs.startDate)
    else
      embedder(
        button,
        `**${button.clicker.user.username}**, you do not have any current logs. Use \`++add {log}\` to start logging.`
      )
  })
}

/**
 * To show the in embed the profile of the user
 * who clicked the button and call utility function
 * profile to do so.
 *
 * @param {MessageButton} button which listened to the onclick event for profile button
 */
const getProfile = async (button) => {
  db.get(button.clicker.user.id).then((logs) => {
    if (logs != null && typeof logs.info !== 'undefined')
      profile(button, button.clicker.user, logs)
    else
      msg.reply(
        `*${button.clicker.user.username}*, You don't have any logs currently. Start logging with us to check out your profile.`
      )
  })
}

/**
 *
 * @param {MessageButton} button which listened to onclick for the button List and call accordingly the listAll utility function
 */
const getList = async (button) => {
  db.get(button.clicker.user.id + '').then((logs) => {
    if (
      logs != null &&
      typeof logs.info !== 'undefined' &&
      logs.info.length > 0
    )
      listAll(button, logs.info, logs.open)
    else
      embedder(
        msg,
        `You do not have any logs ${button.clicker.user.username}. Start logging with \`++add {log}\` to check out your logs.`
      )
  })
}

module.exports = {
  button,
  getStreak,
  getProfile,
  getList,
}
