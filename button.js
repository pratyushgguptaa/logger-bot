const Database = require('@replit/database')
const db = new Database()

const { embedder, profile } = require('./utility')
const { streak } = require('./util-check')
const { listAll } = require('./util-list')

//just checking now
const button = async (but, msg) => {
  const btn1 = new but.MessageButton()
    .setLabel('Streak')
    .setStyle('red')
    .setID('getStreak')
  const btn2 = new but.MessageButton()
    .setLabel('List')
    .setStyle('green')
    .setID('getList')
  const btn3 = new but.MessageButton()
    .setLabel('Profile')
    .setStyle('green')
    .setID('getProfile')
  const btn4 = new but.MessageButton()
    .setLabel('Info')
    .setStyle('blurple')
    .setID('getInfo')
  const btn5 = new but.MessageButton()
    .setLabel('Help')
    .setStyle('blurple')
    .setID('getHelp')
  msg.channel.send(
    'Discord Updates with buttons!\nNow type less *interact* more\nClick on the streak button to check your streak 😃',
    {
      buttons: [btn1, btn2, btn3, btn4, btn5],
    }
  )
}

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
