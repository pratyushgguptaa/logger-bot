//strict mode is not for me right now 😬

//requiring modules
const Discord = require('discord.js')

//server module which will be pinged to keep the server ON
const stayOn = require('./server')

//chalk to for colorful output and discord-buttons for...
const disbut = require('discord-buttons')(client)
const chalk = require('chalk')

//these are all the utility functions
//for all the required stuff have been divided
//(took even more time than actual coding)
const { add, update } = require('./util-add')
const { del, reset } = require('./util-del')
const { privacy } = require('./util-privacy')
const { info, help } = require('./util-description')
const { utilProfile, utilStreak, utilList } = require('./util-check')
const { button, getStreak, getProfile, getList } = require('./button')

//instantiating the discord bot to get started
const client = new Discord.Client()

// each value element present in the database
// key is the id of user and value is as shown
// {
//   userName,
//   info: [
//     {
//       logged: "logg",
//       date: 1
//     }
//   ],
//   startDate: Date.now()
//   open:true
// }

//============= bot online listener ==============
client.on('ready', () => {
  console.log(`The Bot is online as ${client.user.tag}!`)
  client.user
    .setPresence({
      status: 'online',
      activity: {
        name: '++buttons with discord-buttons.js',
        type: 'LISTENING',
        url: 'https://discord.com/api/oauth2/authorize?client_id=838101838845706300&permissions=2148002880&scope=bot',
      },
    })
    .then((bot) => {
      console.log(bot)
      console.log(chalk.green(`Logged in as ${client.user.tag}!`))
      console.log(chalk.yellow(`Servers! ["${client.guilds.cache.size}"]`))
      console.log(
        chalk.cyan(
          `User Count! ["${client.guilds.cache.reduce(
            (a, v) => a + v.memberCount,
            0
          )}"]`
        )
      )
    })
    .catch(console.error)
})

//============== message listener ====================
client.on('message', (msg) => {
  if (msg.author.bot || !msg.content.startsWith('++')) return

  if (msg.content.startsWith('++add')) add(msg)

  if (msg.content.startsWith('++update')) update(msg)

  if (msg.content.startsWith('++del')) del(msg)

  if (msg.content.startsWith('++reset')) reset(msg)

  if (msg.content.startsWith('++privacy')) privacy(msg)

  if (msg.content.startsWith('++info'))
    info(msg).then((embed) => msg.channel.send(embed))

  if (msg.content.startsWith('++help'))
    help(msg).then((embed) => msg.channel.send(embed))

  if (msg.content.startsWith('++list')) utilList(msg)

  if (msg.content.startsWith('++streak')) utilStreak(msg)

  if (msg.content.startsWith('++profile')) utilProfile(msg)

  if (msg.content.startsWith('++buttons')) button(disbut, msg)
})

//============== button click listener ====================
client.on('clickButton', async (button) => {
  if (button.id === 'getStreak') {
    button.defer()
    getStreak(button)
  }

  if (button.id === 'getInfo')
    info(button).then((embed) =>
      button.reply.send('', { embed: embed, ephemeral: true })
    )

  if (button.id === 'getHelp')
    help(button).then((embed) =>
      button.reply.send('', { embed: embed, ephemeral: true })
    )

  if (button.id === 'getProfile') {
    button.defer()
    getProfile(button)
  }

  if (button.id === 'getList') {
    button.defer()
    getList(button)
  }
})

//server start
stayOn()

//the TOKEN of discord BOT
//obtained from discord developer portal
client.login(process.env.TOKEN)
