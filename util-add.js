const Database = require('@replit/database')
const db = new Database()
//util functions for calculations, response and stuff
const { embedder } = require('./utility')

const add = async (msg) => {
  newLog = msg.content.split('++add')[1].trim()
  if (newLog === '') return embedder(msg, `Cannot add empty log.`)
  db.get(msg.author.id + '').then((logs) => {
    if (logs && typeof logs.info !== 'undefined') {
      var milli = Date.now() - logs.startDate
      var days = Math.floor(1 + milli / (1000 * 3600 * 24))

      logs.info.push({ logged: newLog, date: days })
      db.set(msg.author.id + '', logs).then(() => {
        embedder(
          msg,
          `${msg.author}, you have successfully logged in for day ${days}\nYay you did it! Remember to log next day 🥰`
        )
      })

      if (!logs.open && msg.channel.type !== 'dm')
        msg.delete().then(console.log('Msg deleted')).catch(console.error)
    } else {
      db.set(msg.author.id + '', {
        userName: msg.author.tag,
        info: [
          {
            logged: newLog,
            date: 1,
          },
        ],
        startDate: Date.now(),
        open: true,
      }).then(() => {
        embedder(msg, `Logging your first DayOfCode!!`)
      })
    }
  })
}

const update = async (msg) => {
  newLog = msg.content.split('++update')[1].trim()
  if (newLog === '') return embedder(msg, `Cannot add empty log.`)
  db.get(msg.author.id + '').then((logs) => {
    if (logs && typeof logs.info !== 'undefined') {
      var milli = Date.now() - logs.startDate
      var day = Math.floor(1 + milli / (1000 * 3600 * 24))

      logs.info = logs.info.filter((log) => log.date != day)
      logs.info.push({ logged: newLog, date: day })
      db.set(msg.author.id + '', logs).then(() =>
        embedder(
          msg,
          `${msg.author}, you have successfully updated your logs for day ${day}`
        )
      )

      if (!logs.open && msg.channel.type !== 'dm')
        msg.delete().then(console.log('Msg deleted')).catch(console.error)
    } else
      db.set(msg.author.id + '', {
        userName: msg.author.tag,
        info: [{ logged: newLog, date: 1 }],
        startDate: Date.now(),
        open: true,
      }).then(() => {
        embedder(msg, `You didnt have any logs. Logging your first DayOfCode!!`)
      })
  })
}

module.exports = {
  add,
  update,
}
