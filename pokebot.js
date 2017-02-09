const config = require('./config.js')
const getGreetings = require('./intents/greetings.js')
const restify = require('restify')
const builder = require('botbuilder')
const recast = require('recastai')
const recastClient = new recast.Client(config.recast)
// Connection to Microsoft Bot Framework
const connector = new builder.ChatConnector({
  appId: config.appId,
  appPassword: config.appPassword,
})
const bot = new builder.UniversalBot(connector)

// Event when Message received
bot.dialog('/', (session) => {
  recastClient.textRequest(session.message.text)
   .then(res => {
     const intent = res.intent()
     session.send(`Intent: ${intent.slug}`)
     if (intent.slug === 'greeting') {
       console.log("123")
       console.log(getGreetings())
       session.send(getGreetings())
     }
   })
   .catch(() => session.send('I need some sleep right now... Talk to me later!'))
})

// Server Init
const server = restify.createServer()
var portnumber = 8080
server.listen(portnumber)
console.log("listning to port " + portnumber)
server.post('/', connector.listen())
