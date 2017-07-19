const config = require('./config.js')
const db = require('./db.js')
const getGreetings = require('./intents/greetings.js')
const getInsults = require('./intents/insults.js')
const listTheRules = require('./intents/rules.js')
const restify = require('restify')
const builder = require('botbuilder')
const recast = require('recastai')
const recastClient = new recast.Client(config.recast)
var request = require('request');

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
    // session.send(`Hello: ${session.message.text}`);
    console.log(res)
     session.sendTyping();
     var address = JSON.stringify(session.message)
     console.log(address)
     const intent = res.intent();
     console.log(res)
     db.addFriend(session.message.user.id,session.message.user.name)
     //session.send(`Intent: ${intent.slug}`)
     if (intent!=null){
       session.send(`INTENT: ${intent.slug}`)
       if (intent.slug === 'goodbyes') {
         session.send(`(wave) ${session.message.text} (wave)`)
       }
       if (intent.slug === 'greeting') {
         session.send(getGreetings() + ` ${session.message.user.name}`)
       }
       if (intent.slug === 'insults') {
         session.send(getInsults())
       }
       if (intent.slug === 'rules') {
         session.send(listTheRules())
       }
       if (intent.slug === 'mimi') {
         session.send(`Mimi I love you`)
       }
       if (intent.slug === 'coco') {
         session.send(`Hey Carine,me & Bach loves you so mush `)
       }
       if (intent.slug === 'nabil') {
         session.send(`Nabbouuull HAPPY Birthday`)
       }
       if (intent.slug === 'capitals') {
         var url = (JSON.stringify("https://restcountries.eu/rest/v2/name/" + res.entities[0].raw)).replace(/[^a-zA-Z0-9-_. :/]/g, '');
         console.log(url);
         request(url, function (error, response, body) {
           if (!error && response.statusCode == 200) {
             data = JSON.parse(body)
             console.log(data);
             console.log(data[0].capital)
             capital = data[0].capital;
             console.log(capital);
             console.log(res.entities[0].raw);
             session.send(capital)
           }else{
             console.log(error);
           }
         });
       }
       //session.send(`${res.action.reply}`)
       db.getFriends();
     }
     else {
       session.send(`Hello ${session.message.user.name} :)`)
       console.log("not known intent")
       console.log(res)
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
//db.insertUser(obj2);
//db.getUsers();
