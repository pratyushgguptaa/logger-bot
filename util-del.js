const Database = require('@replit/database')
const db = new Database()

/**
 * To delete the records of any specified day from the logs
 * of the author of the message
 * if the number in the message cannot be parsed to int
 * it replies accordingly
 * @param {Message} msg Discord Message with prefix '++del'
 */
const del = async (msg) => {
  day = parseInt(msg.content.split('++del')[1].trim()) || 0
  if (day < 1) {
    //if day entered is less than 1 or NaN
    msg.reply(`Please enter a valid day number`)
    return
  }
  //get the record of the author of the message
  db.get(msg.author.id + '').then((logs) => {
    //check if the logs are defined and not empty
    if (typeof logs.info !== 'undefined' && logs.info.length > 0) {
      //filter out the day to be removed
      logs.info = logs.info.filter((log) => log.date != day)

      //update the record with the filtered logs
      db.set(msg.author.id + '', logs)

      msg.reply(`You have successfully deleted all the logs for day ${day}`)
    } else
      msg.reply(`You have no active logs. Pls start logging by \`++add {log}\``)
  })
}
/**
 * To delete the record from the database with the key as the id of the
 * author of the message passed and reply accordingly
 * @param {Message} msg Discord message which has been approved for
 * deletion of the record associated with the author of the message
 */
const delAll = async (msg) =>
  db
    .get(msg.author.id + '')
    .then(() =>
      db
        .delete(msg.author.id + '')
        .then(() => msg.reply(`All your data has been deleted.`))
    )
    .catch(() =>
      msg.reply(
        'There was some issue during resetting your data. Please try again.'
      )
    )

/**
 * To confirm with the message author to resest his/her information and
 * all the logs present in the database
 * It waits for 10 seconds for a reply from the author and acts accordingly
 * @param {Message} msg Discord Message with prefix '++reset'
 */
const reset = async (msg) => {
  //filter to avoid reading messages from different users/bots
  let filter = (m) => m.author.id === msg.author.id
  msg.channel
    .send(
      `Are you sure you want to delete all logs?\nPlease enter \`yes\` or \`no\`:`
    )
    .then(() => {
      msg.channel
        //Similar to createMessageCollector but in promise form.
        //Resolves with a collection of messages that pass the specified filter.
        .awaitMessages(filter, {
          max: 1, //only one message to be read
          time: 10000, // and for 10 seconds only
          errors: ['time'], //stop/end reason to cause the promise to reject
        })
        .then((message) => {
          //when getting a response
          message = message.first()
          if (
            message.content.toUpperCase() == 'YES' ||
            message.content.toUpperCase() == 'Y'
          )
            //Deleting all the records for author
            delAll(msg)
          else if (
            message.content.toUpperCase() == 'NO' ||
            message.content.toUpperCase() == 'N'
          )
            message.channel.send(`Delete Process Terminated`)
          else message.channel.send(`Terminated: Due to Invalid Response`)
        })
        //catch the error thrown on timeout
        .catch(() => {
          msg.channel.send('Buddy Timeout! Please try again.')
        })
    })
}

module.exports = {
  del,
  reset,
}
