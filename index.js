const Discord = require('discord.js');
//const fetch = require('node-fetch')
const keepAlive = require('./server')
const Database = require("@replit/database")

const db = new Database()
const client = new Discord.Client();
//db.getAll()
//db.get('691267340846759978').then(console.log)
db.list().then(keys => {
  //keys.forEach(item => console.log(item))
  keys.forEach(key => {
    //db.get(key).then(data=> console.log(key+"\n"+JSON.stringify(data)))
    db.get(key).then(logs => {
      //eight = new Date("2021-05-02T14:30:00Z")
      //console.log(eight.getTime())
      // if(logs.userName=="jeesu#8980"){
      //    logs.info.splice(1, 1)
      //   logs.startDate=1620052200647
      //   db.set(key, logs)
      // }
      console.log(logs)
    })
  })
});

//db.delete('abs');
// const obj = {
//         info: [{logged: "logg", 
//               date: 1}],
//         startDate: Date.now()
//         }
//db.set('abs', obj)

const embedder = async (msg, str) => {
  const embed = new Discord.MessageEmbed()
    .setColor("#"+Math.floor(Math.random()*16777215).toString(16))
    .setDescription(str)
  msg.channel.send(embed)
}

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
      embedder(msg, `You have successfully logged in for day ${days}\nYay you did it! Remember to log next day 🥰`)
      if(!logs['open']){
        msg.delete().then(console.log('Msg deleted')).catch(console.error);
      }
    } else {
      console.log("add else")

      const obj = {
        userName,
        info: [{logged: logg, 
              date: 1}],
        startDate: Date.now(),
        open : true
        }
      db.set(userId+"", obj).then(() => {
      console.log(`Start log by ${userName}`);
        embedder(msg, `You have successfully logged in for day 1`); 
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
      
      embedder(msg, `You have successfully logged in for day ${day}`)
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
        msg.channel.send(`You didnt have any logs. Logging your first DayOfCode!!`);
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
      
      msg.channel.send(`You have successfully deleted all the logs for day ${day}`)

    } else {
      msg.channel.send("You have no active logs. Pls start logging by ++add {log}")
    }
  })
}

const delAll = async (msg) => {
  db.get(msg.author.id+"").then(logs => {
    db.delete(msg.author.id+"");
    msg.reply(`All your data has been deleted.`)
  }).catch(err=>{
    console.log('Delete all error')
    msg.channel.send('There was some during resetting your data.')
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
      embedder(msg, `The account of **${user.username}** is open. You can check out their list of logs by \`++list {@mention}\``)
    } else {
      embedder(msg, `Sorry Sir, **${user.username}**'s account is hidden. You cannot check their list.`)
    }
  })
  .catch(err=>{
    console.log(err)
    embedder(msg, `Sorry mate **${user.username}** is not in our database`)
  })
}

const listAll = async (msg, logs)=>{
  n = logs.length
  display = ""
  prev = -1
  while(n--){
    if(logs[n].date!=prev){
      prev=logs[n].date;
      display += "**Day#"+logs[n].date+"**"
    }
    display+= " - "+logs[n].logged+"\n";
  }
  //msg.channel.send(display);
  embedder(msg, display);
}

const streak = async (msg, user, logs, startDate) => {
  var milli = Date.now() - startDate;
  var day = Math.floor(1 + milli / (1000*3600*24));
  
  str=1
  n=logs.length-1
  if(day!=logs[n].date){
    embedder(msg, `Hey mate you must add something to today's log, or else your streak will become \`0\` !!`)
  } else {
    while(n--){
      if(day-logs[n].date==1){
        last=logs[n].date
        str++
      } else if(day-logs[n].date==0){
        continue
      } else break;
    }
    embedder(msg, `Current streak for **${user.username}** is ${str}`)
  }
}

client.on('ready', () => {
  console.log(`The Bot is online as ${client.user.tag}!`)
})

client.on('message', msg => {
  if(msg.author.bot) return;

  console.log("arree");
  console.log(msg.author.id+" "+msg.author.tag)
  if(msg.content.startsWith("++add")){
    newLog = msg.content.split("++add ")[1];
    add(msg, newLog);
    //msg.channel.send("Yay you did it! Remember to log next day 🥰");
  }

  if(msg.content.startsWith("++list")){
    console.log(msg.mentions.users.first())
    if(msg.mentions.users.first()===undefined){
      console.log(`Listing for ${msg.author.tag}`)
      db.get(msg.author.id+"").then(logs=>{
        if (logs!=null && typeof logs['info'] !== 'undefined' && logs['info'].length > 0) {
          listAll(msg, logs['info'])
          //msg.channel.send(JSON.stringify(logs['info']))
        } else {
          embedder(msg, `Bro khali h ${msg.author}`)
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
          if(logs['open']==true){
            listAll(msg, logs['info'])
            //msg.channel.send(JSON.stringify(logs['info']))
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
    upd = msg.content.split("++update ")[1];
    //day = parseInt(upd[0]);
    //if(upd[1]!=' ' || day==NaN){
      //msg.reply(`Buddy! wrong Format plz sahi se use kro`);
      //return;
    //}
    //logg = upd.substring(2);
    update(msg, upd);
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
    console.log(msg.mentions.users.first())
    if(msg.mentions.users.first()===undefined){
      console.log(`Streak for ${msg.author.tag}`)
      db.get(msg.author.id+"").then(logs=>{
        if (logs!=null && typeof logs['info'] !== 'undefined' && logs['info'].length > 0) {
          streak(msg, msg.author, logs.info, logs.startDate)
        } else {
          embedder(msg, `Sorry, **${msg.author.tag}**, you dont have any current logs. Use \`++add {log}\` to start logging.`)
        }
      }).catch(err=>{
        console.log(err)
        embedder(msg, `${msg.author.tag}, how can i show your streaks when you didnt start any logging.`)
      })
    } else {
      user = msg.mentions.users.first()
      console.log(`streak for ${user.tag}`)
      db.get(user.id+"").then(logs=>{
        if (logs!=null && typeof logs['info'] !== 'undefined' && logs['info'].length > 0) {
          streak(msg, user, logs.info, logs.startDate)
        } else {
          embedder(msg, `${user.username} has no active logs, cannot calculate streak!`)
        }
      }).catch(err=>{
        console.log(err)
        embedder(msg, `how can i show *${user.username}*'s streaks when they didnt start any logging.`)
      })
    }
  }



  if(msg.content.startsWith("++help")){
    const embed = new Discord.MessageEmbed().setTitle('All commands you can use!').setColor('0x00ff00').setDescription(`Log your daily activities with these easy commands!!\n*Remember you cannot edit any logs of previous days. Hence choose wisely!*`).addFields(
		{ name: '\`++add {log}\`', value: 'can add multiple logs for the same day!' },
	//	{ name: '\u200B', value: '\u200B' },
		{ name: '\`++list\`', value: 'to list all the logs', inline:true},
    { name: '\`++list {userTag}\`', value: 'to list the logs of the specified user.(logs will be shown only if the person has privacy turned off.)', inline:true},
    { name: '\`++privacy {on|off|null|userTag}\`', value: 'to set your privacy setting on or off. Or null to check your current settings.\n*Also when your privacy is on, the logs you \`++add\` will automatically be deleted so no need to worry!*\nTag another user to check there privacy!!', inline:true},
    { name: '\`++update {log}\`', value: 'to remove all logs of today and set the specified log as the only log.', inline:true},
		{ name: '\`++del {day_no}\`', value: 'it deletes all the logs for the day specified in the arguments.', inline:true},
    {name: '\`++streak {userTag|null}\`', value: 'To get the current streak for your or someone\'s DaysOfCode!', inline:true}
	)
    msg.channel.send(embed)
  }

})

keepAlive()
client.login(process.env.TOKEN);
