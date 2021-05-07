const Database = require('@replit/database')
const db = new Database()

const del = async (msg) => {
  day = parseInt(msg.content.split("++del")[1].trim())
  userId = msg.author.id;
  userName = msg.author.tag;
  db.get(userId+"").then(logs => {
    if (typeof logs.info !== 'undefined' && logs.info.length > 0) {
      logs.info = logs.info.filter(log => log.date!=day)
      
      db.set(msg.author.id+"", logs);
    
      msg.reply(`You have successfully deleted all the logs for day ${day}`)

    } else
      msg.reply(`You have no active logs. Pls start logging by \`++add {log}\``)
  })
}

const delAll = async (msg) => {
  db.get(msg.author.id+"").then(() => {
    db.delete(msg.author.id+"").then(() =>
      msg.reply(`All your data has been deleted.`)
    )
  }).catch(() =>
    msg.reply('There was some issue during resetting your data. Please try again.')
  )
}

const reset = async (msg) => {
  let filter = m => m.author.id === msg.author.id
    msg.channel.send(`Are you sure you want to delete all logs?\nPlease enter \`yes\` or \`no\`:`).then(() => {
      msg.channel.awaitMessages(filter, {
          max: 1,
          time: 10000,
          errors: ['time']
        })
        .then(message => {
          message = message.first()
          if (message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y')
            delAll(msg)
          else if (message.content.toUpperCase() == 'NO' || message.content.toUpperCase() == 'N')
            message.channel.send(`Delete Process Terminated`)
          else
            message.channel.send(`Terminated: Due to Invalid Response`)
        })
        .catch(() => {
            msg.channel.send('Buddy Timeout! Please try again.');
        });
    })
}

module.exports = {
  del,
  reset
}