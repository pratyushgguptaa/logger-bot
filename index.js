//strict mode is not for me right now 😬

//requiring modules
const Discord = require('discord.js')

//server module which will be pinged to keep the server ON
const stayOn = require('./server')

//to interact with the repl.it database
const Database = require('@replit/database')

//these are all the utility functions
//for all the required stuff have been divided
//(took even more time than actual coding)
const { add, update } = require('./util-add')
const { del, reset } = require('./util-del')
const { privacy } = require('./util-privacy')
const { info, help } = require('./util-description')
const { utilProfile, utilStreak, utilList } = require('./util-check')

//instantiating the database object and
//the discord bot to get started
const db = new Database()
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
        name: '++help with discord.js',
        type: 'LISTENING',
        url:
          'https://discord.com/api/oauth2/authorize?client_id=838101838845706300&permissions=2148002880&scope=bot',
      },
    })
    .then(console.log)
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

  if (msg.content.startsWith('++info')) info(msg)

  if (msg.content.startsWith('++help')) help(msg)

  if (msg.content.startsWith('++list')) utilList(msg)

  if (msg.content.startsWith('++streak')) utilStreak(msg)

  if (msg.content.startsWith('++profile')) utilProfile(msg)
})

//server start
stayOn()

//the TOKEN of discord BOT
//obtained from discord developer portal
client.login(process.env.TOKEN)
