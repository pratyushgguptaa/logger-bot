const express = require('express')

const server = express()

//routing all requests through here
server.all('/', (req, res) => {
  res.send('Bot is running baby')
})

//repl.it waits for one hour until any activity
//after which it shuts down the application
//hence, the uptime robot is scheduled
//which pings at every 5 minutes to keep alive the server
function stayOn() {
  server.listen(3000, () => {
    console.log('Server is ready')
  })
}

module.exports = stayOn
