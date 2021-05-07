const Database = require('@replit/database')
const db = new Database()

const privacy = async (msg) => {
  if (msg.mentions.users.first() === undefined)
    open(msg)
  else
    isOpen(msg)
}

const open = async (msg) => {
  setting = msg.content.split("++privacy")[1].trim()
  db.get(msg.author.id+"").then(logs => {
    if(logs){
      msg.react(setting=="off"?'🔓':'🔒')
      if(setting == "off"){
        logs.open=true;
        db.set(msg.author.id+"", logs).then(()=>
          msg.reply( `Your privacy is turned off. Anyone can tag and see your logs`)
        )
      } else if(setting == "on"){
        logs.open=false;
        db.set(msg.author.id+"", logs).then(()=>
          msg.reply( `Your privacy is turned on. No one can tag and check your logs except you`)
        )
      } else
        msg.reply( `Your privacy settings are currently ${logs.open?`off. Anyone can tag and see your logs`:`on. No one can tag and check your logs except you`}`)
    } else {
      msg.reply('Sorry you must start your first log in order to change your privacy settings.')
    }
  })
}

const isOpen = async (msg)=>{
  user = msg.mentions.users.first()
  db.get(user.id+"").then(logs=>{
    if(logs){
      if(logs.open)
        msg.reply(`The account of **${user.username}** is open. You can check out their list of logs by \`++list {@mention}\``)
      else
        msg.reply(`Sorry Sir, **${user.username}**'s account is hidden. You cannot check their list.`)
    } else msg.reply(`Sorry mate **${user.username}** is not in our database`)
  })
}

module.exports = {
  privacy
}