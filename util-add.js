const Database = require('@replit/database')
const db = new Database()

//getting only the embedder function
const { embedder } = require('./utility')

//to calculate totalDays from startDate till now
const { totalDays } = require('./util-functions')

/**
 * To add the given log into the record of the sender
 * @param {Message} msg Discord Message prefix '++add'
 * @returns {Promise<Message>|<Message[]>} the new DIscord Message sent from the bot
 */
const add = async (msg) => {
  /**
   * to first clear out the newLog
   * @type {string}
   */
  newLog = msg.content.split('++add')[1].trim()
  //if empty string return
  if (newLog === '') return embedder(msg, `Cannot add empty log.`)

  /**
   * gets the record with the specified key
   * then checking if logs is not null and
   * logs.info is not undefined
   */
  db.get(msg.author.id + '').then((logs) => {
    if (logs && typeof logs.info !== 'undefined') {
      //if exists, push into the list and set as new record
      /**
       * get the current day number
       * @type {number}
       */
      var day = await totalDays(logs.startDate)

      logs.info.push({ logged: newLog, date: day })
      db.set(msg.author.id + '', logs).then(() => {
        embedder(
          msg,
          `${msg.author}, you have successfully logged in for day ${day}\nYay you did it! Remember to log next day 🥰`
        )
      })

      /**
       * deleteing the log message if hidden account
       * and not in DMChannel of Discord
       */
      if (!logs.open && msg.channel.type !== 'dm')
        msg.delete().then(console.log('Msg deleted')).catch(console.error)
    } else {
      //for creating of a new record
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

/**
 * To clear out all the logs of current day for the author of the message
 * And add only the log present in the content with prefix '++update '
 * @param {Message} msg Discord Message with prefix '++update'
 * @return {Promise<Message>|<Message[]>} the new DIscord Message sent from the bot
 */
const update = async (msg) => {
  /**
   * to first clear out the newLog
   * @type {string}
   */
  newLog = msg.content.split('++update')[1].trim()
  if (newLog === '') return embedder(msg, `Cannot add empty log.`)
  db.get(msg.author.id + '').then((logs) => {
    if (logs && typeof logs.info !== 'undefined') {
      //if exists, push into the list and set as new record
      /**
       * get the current day number
       * @type {number}
       */
      var day = await totalDays(logs.startDate)

      /**
       * filter out all the logs of current day
       * and then push into the list a new record
       */
      logs.info = logs.info.filter((log) => log.date != day)
      logs.info.push({ logged: newLog, date: day })
      db.set(msg.author.id + '', logs).then(() =>
        embedder(
          msg,
          `${msg.author}, you have successfully updated your logs for day ${day}`
        )
      )
      /**
       * deleteing the log message if hidden account
       * and not in DMChannel of Discord
       */
      if (!logs.open && msg.channel.type !== 'dm')
        msg.delete().then(console.log('Msg deleted')).catch(console.error)
    }
    //create a new record for the user
    else
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
