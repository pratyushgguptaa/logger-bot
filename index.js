//requiring modules
const Discord = require('discord.js')
const stayOn = require('./server')

//to interact with the repl.it database
const Database = require('@replit/database')


const { add, update } = require('./util-add')
const { del, reset } = require('./util-del')
const { privacy } = require('./util-privacy')
const { info, help } = require('./util-description')
const { utilProfile , utilStreak, utilList } = require('./util-check')

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



//db.getAll()
//db.get('691267340846759978').then(console.log)

db.list().then(keys => {
  keys.forEach(key => {
    db.get(key).then(logs => {
      if (logs.userName === 'Nishi#9040') {
        //logs.info.splice(0, 1)
        logs['startDate'] = 1620138600489
        db.set(key, logs)
        //   })
        //  })
      }
      console.log(logs)
    })
  })
});

//============= bot online listener ==============
client.on('ready', () => {
  console.log(`The Bot is online as ${client.user.tag}!`)
  client.user.setPresence({
    status: 'online',
    activity: {
      name: '++help with discord.js',
      type: 'LISTENING',
      url: 'https://discord.com/api/oauth2/authorize?client_id=838101838845706300&permissions=2148002880&scope=bot'
    }
  }).then(console.log)
    .catch(console.error);
})

//============== message listener ====================
client.on('message', msg => {
  if (msg.author.bot || !msg.content.startsWith("++")) return;

  console.log(msg.author.id + " " + msg.author.tag)

  if (msg.content.startsWith("++add"))
    add(msg)

  if (msg.content.startsWith("++update"))
    update(msg)

  if (msg.content.startsWith("++del"))
    del(msg)

  if (msg.content.startsWith("++reset"))
    reset(msg)

  if (msg.content.startsWith("++privacy"))
    privacy(msg)

  if (msg.content.startsWith("++info"))
    info(msg)

  if (msg.content.startsWith("++help"))
    help(msg)

  if (msg.content.startsWith("++list"))
    utilList(msg)

  if (msg.content.startsWith("++streak"))
    utilStreak(msg)

  if (msg.content.startsWith("++profile"))
    utilProfile(msg)

})

stayOn()
client.login(process.env.TOKEN)