const Discord = require('discord.js');
//const fetch = require('node-fetch')
const keepAlive = require('./server')
const Database = require("@replit/database")

const utility = require('./utility')

const db = new Database()
const client = new Discord.Client();

//db.getAll()
//db.get('691267340846759978').then(console.log)

db.list().then(keys => {
  keys.forEach(key => {
    db.get(key).then(logs => {
        if(logs.userName==='Nishi#9040'){
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

// const obj = {
//          username,
//         info: [{logged: "logg", 
//               date: 1}],
//         startDate: Date.now()
//         open:true
//         }
//db.set('abs', obj)

//============utility methods=============
const add = async (msg, logg) => {
  userId = msg.author.id;
  userName = msg.author.tag;
  db.get(userId+"").then(logs => {
    if (logs!=null && typeof logs['info'] !== 'undefined' && logs['info'].length > 0) {
      var milli = Date.now() - logs["startDate"];
      var days = Math.floor(1 + milli / (1000*3600*24));

      console.log(`${userName}: new Log`);
      //logs['open']=true;
      logs["info"].push({logged: logg, date: days})
      db.set(msg.author.id+"", logs);
      
      //msg.channel.send(`You have successfully logged in for day ${days}`)
      utility.embedder(msg, `You have successfully logged in for day ${days}\nYay you did it! Remember to log next day 🥰`)
      if(!logs['open']){
        msg.delete().then(console.log('Msg deleted')).catch(console.error);
      }
    } else {
      console.log("add else")
      const obj = {
        userName,
        info: [
          {
            logged: logg, 
              date: 1
          }
        ],
        startDate: Date.now(),
        open : true
      }
      db.set(userId+"", obj).then(() => {
      console.log(`Start log by ${userName}`);
        utility.embedder(msg, `You have successfully logged in for day 1`); 
      })
    }
  })
}

const update = async (msg, logg) => {
  userId = msg.author.id;
  userName = msg.author.tag;
  db.get(userId+"").then(logs => {
    if (typeof logs['info'] !== 'undefined' && logs['info'].length > 0) {
      var milli = Date.now() - logs["startDate"];
      var day = Math.floor(1 + milli / (1000*3600*24));

      console.log(`${userName}: new Log`);

      logs['info'] = logs['info'].filter(log => log['date']!=day)
      console.log(`deleted for day ${day}`)
      logs["info"].push({logged: logg, date: day})
      db.set(msg.author.id+"", logs);
      
      utility.embedder(msg, `You have successfully logged in for day ${day}`)
    } else {
      const obj = {
        userName,
        info: [{logged: logg, 
              date: 1}],
        startDate: Date.now(),
        open : true
        }
      db.set(userId+"", obj).then(() => {
      console.log(`Start log by ${userName}`);
        utility.embedder(msg, `You didnt have any logs. Logging your first DayOfCode!!`);
      })
    }
  })
}

const del = async (msg, day) => {
  userId = msg.author.id;
  userName = msg.author.tag;
  db.get(userId+"").then(logs => {
    if (typeof logs['info'] !== 'undefined' && logs['info'].length > 0) {
      logs['info'] = logs['info'].filter(log => log['date']!=day)

      db.set(msg.author.id+"", logs);
      
      msg.reply(`You have successfully deleted all the logs for day ${day}`)

    } else {
      msg.reply(`You have no active logs. Pls start logging by \`++add {log}\``)
    }
  })
}

const delAll = async (msg) => {
  db.get(msg.author.id+"").then(logs => {
    db.delete(msg.author.id+"");
    msg.reply(`All your data has been deleted.`)
  }).catch(err=>{
    console.log('Delete all error')
    msg.reply('There was some issue during resetting your data.')
  })
}

const open = async (msg, setting) => {
  userId = msg.author.id;
  userName = msg.author.tag;
  db.get(userId+"").then(logs => {
    if(setting == "off"){
      logs['open']=true;
      db.set(userId+"", logs).then(()=>{
        msg.reply( `Your privacy is turned off. Anyone can tag and see your logs`);
      })
    } else if(setting == "on"){
      logs['open']=false;
      db.set(userId+"", logs).then(()=>{
        msg.reply( `Your privacy is turned on. No one can tag and check your logs except you`);
      })
    } else {
      if(logs['open']){
        msg.reply( `Your privacy settings are currently off. Anyone can tag and see your logs`);
      } else {
        msg.reply( `Your privacy settings are currently on. No one can tag and check your logs except you`);
      }
    }
  }).catch(err=>{
    console.log(err)
    msg.channel.send('Sorry you must start your first log in in order to change your privacy settings.')
  })
}

const isOpen = async (msg, user)=>{
  db.get(user.id+"").then(logs=>{
    if(logs['open']){
      utility.embedder(msg, `The account of **${user.username}** is open. You can check out their list of logs by \`++list {@mention}\``)
    } else {
      utility.embedder(msg, `Sorry Sir, **${user.username}**'s account is hidden. You cannot check their list.`)
    }
  })
  .catch(err=>{
    console.log(err)
    utility.embedder(msg, `Sorry mate **${user.username}** is not in our database`)
  })
}

const streak = async (msg, user, logs, startDate) => {
  str = await utility.calculateStreak(logs, startDate)
  if(str)
    utility.embedder(msg, `Current streak for **${user.username}** is ${str}`)
  else
    utility.embedder(msg, `Hey mate you must add something to today's log, or else your streak will become \`0\` !!`)
}


//============= bot online listener ==============
client.on('ready', () => {
  console.log(`The Bot is online as ${client.user.tag}!`)
  client.user.setPresence({
    activity: {
      name: '++help with discord.js' },
      status: 'online',
      type: 'LISTENING',
      url: 'https://discord.com/api/oauth2/authorize?client_id=838101838845706300&permissions=2148002880&scope=bot',
      emoji: '😉',
      createdTimestamp: 1619965800000
  })
  .catch(console.error);
})

//============== message listener ====================
client.on('message', msg => {
  if(msg.author.bot||!msg.content.startsWith("++")) return;

  console.log("arree");
  console.log(msg.author.id+" "+msg.author.tag)
  if(msg.content.startsWith("++add")){
    newLog = msg.content.split("++add")[1];
    add(msg, newLog.trim());
    //msg.channel.send("Yay you did it! Remember to log next day 🥰");
  }

  if(msg.content.startsWith("++list")){
    if(msg.mentions.users.first()===undefined){
      console.log(`Listing for ${msg.author.tag}`)
      db.get(msg.author.id+"").then(logs=>{
        if (logs!=null && typeof logs['info'] !== 'undefined' && logs['info'].length > 0) {
          utility.listAll(msg, logs['info'], logs['open'])
        } else {
          utility.embedder(msg, `Bro khali h ${msg.author}`)
        }
      }).catch(err => {
        console.log(err)
        msg.reply(`Sorry, some due to some internal error your request could not be processed. Pls try again.`)
      })
    } else {
      user = msg.mentions.users.first()
      console.log(`Listing for ${user.tag}`)
      db.get(user.id+"").then(logs=>{
        if (logs!=null && typeof logs['info'] !== 'undefined' && logs['info'].length > 0) {
          if(logs['open']){
            utility.listAll(msg, logs['info'], logs['open'])
          } else {
            msg.channel.send(`Sorry bro, ${user.username} is hidden.`)
          }
        } else {
          msg.channel.send(`Bro khali h ${user.username}`)
        }
      })
    }
  }

  if(msg.content.startsWith("++update")){
    upd = msg.content.split("++update")[1];
    //day = parseInt(upd[0]);
    //if(upd[1]!=' ' || day==NaN){
      //msg.reply(`Buddy! wrong Format plz sahi se use kro`);
      //return;
    //}
    //logg = upd.substring(2);
    update(msg, upd.trim());
    msg.channel.send(`You have successfully updated your log for today`)
  }

  if(msg.content.startsWith("++del")){
    index = parseInt(msg.content.split("++del ")[1]);
    del(msg, index);
    msg.channel.send("Man you deleted you log for day "+index);
  }

  if(msg.content.startsWith("++privacy")){
    if(msg.mentions.users.first()===undefined){
      setting = msg.content.split("++privacy ")[1]
      open(msg, setting)
      msg.react(setting=="off"?'🔓':'🔒')
    } else {
      user = msg.mentions.users.first()
      isOpen(msg, user)
    }
  }

  if(msg.content.startsWith("++reset")){
    let filter = m => m.author.id === msg.author.id
    msg.channel.send(`Are you sure you want to delete all logs?\nPlease enter \`yes\` or \`no\`:`).then(() => {
      msg.channel.awaitMessages(filter, {
          max: 1,
          time: 10000,
          errors: ['time']
        })
        .then(message => {
          message = message.first()
          if (message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y') {
            delAll(msg)
          } else if (message.content.toUpperCase() == 'NO' || message.content.toUpperCase() == 'N') {
            message.channel.send(`Delete Process Terminated`)
          } else {
            message.channel.send(`Terminated: Due Invalid Response`)
          }
        })
        .catch(message => {
            msg.channel.send('Buddy Timeout! Pls try again.');
        });
    })
  }

  if(msg.content.startsWith("++streak")){
    if(msg.mentions.users.first()===undefined){
      console.log(`Streak for ${msg.author.tag}`)
      db.get(msg.author.id+"").then(logs=>{
        if (logs!=null && typeof logs['info'] !== 'undefined' && logs['info'].length > 0) {
          streak(msg, msg.author, logs.info, logs.startDate)
        } else {
          utility.embedder(msg, `Sorry, **${msg.author.tag}**, you dont have any current logs. Use \`++add {log}\` to start logging.`)
        }
      }).catch(err=>{
        console.log(err)
        utility.embedder(msg, `${msg.author.tag}, how can i show your streaks when you didnt start any logging.`)
      })
    } else {
      user = msg.mentions.users.first()
      console.log(`streak for ${user.tag}`)
      db.get(user.id+"").then(logs=>{
        if (logs!=null && typeof logs['info'] !== 'undefined' && logs['info'].length > 0) {
          streak(msg, user, logs.info, logs.startDate)
        } else {
          utility.embedder(msg, `${user.username} has no active logs, cannot calculate streak!`)
        }
      }).catch(err=>{
        console.log(err)
        utility.embedder(msg, `how can i show *${user.username}*'s streaks when they didnt start any logging.`)
      })
    }
  }

  if(msg.content.startsWith("++profile")){
    if(msg.mentions.users.first()===undefined){
      db.get(msg.author.id).then(logs=>{
        utility.profile(msg, msg.author, logs)
      }).catch(err=>{
        console.log(err)
        msg.reply(`You don't have any logs currently. Start logging with us to check out your profile.`)
      })
    } else {
      user = msg.mentions.users.first()
      db.get(user.id+"").then(logs=>{
        utility.profile(msg, user, logs)
      }).catch(err=>{
        console.log(err)
        utility.embedder(msg, `how can i show *${user.username}*'s profile when they didnt start any logging.`)
      })
    }
  }

  if(msg.content.startsWith("++info")){
    const embed = new Discord.MessageEmbed()
    .setTitle('~Info about me~')
    .setColor('0x0000ff')
    .setDescription('Whenever You start your first log, i will capture the time to be your start time. For each 24 days from that time your days will be calculated.\nAs:\nFor 24 hours it will be day 1.\nNext 24 hours will be day 2(no matter when you log afterwards).\n**There is no option to add in previous day** (and why would you log in previous day anyway).\nYou can also use multiple \`++add\` to push your current day logs together!\n\nUse \`++help\` to know more about my functionalities.')

    msg.channel.send(embed)
  }

  if(msg.content.startsWith("++help")){
    const embed = new Discord.MessageEmbed().setTitle('All commands you can use!').setColor('0x00ff00').setDescription(`Log your daily activities with these easy commands!!\n*Remember you cannot edit any logs of previous days. Hence choose wisely!*`).addFields(
		{ name: '\`++add {log}\`', value: 'can add multiple logs for the same day!', inline:true },
	//	{ name: '\u200B', value: '\u200B' },
		{ name: '\`++list\`', value: 'to list all the logs', inline:true},
    { name: '\`++list {userTag}\`', value: 'to list the logs of the specified user.(logs will be shown only if the person has privacy turned off.)', inline:true},
    { name: '\`++privacy {on|off|null|userTag}\`', value: 'to set your privacy setting on or off. Or null to check your current settings.\n*Also when your privacy is on, the logs you \`++add\` will automatically be deleted so no need to worry!*\nTag another user to check there privacy!!', inline:true},
    { name: '\`++update {log}\`', value: 'to remove all logs of today and set the specified log as the only log.', inline:true},
		{ name: '\`++del {day_no}\`', value: 'it deletes all the logs for the day specified in the arguments.', inline:true},
    {name: '\`++streak {userTag|null}\`', value: 'To get the current streak for your or someone\'s DaysOfCode!', inline:true},
    {name: '\`++info\`', value: 'Show information about I work.', inline:true},
    {name: '\`++profile {null|userTag}\`', value:'Show information about your account or someone else\'s Logger account.', inline:true }
	)
    msg.channel.send(embed)
  }

})

keepAlive()
client.login(process.env.TOKEN);
