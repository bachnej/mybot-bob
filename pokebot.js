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
var Flickr = require("node-flickr");
var keys = {"api_key": config.flickrKey}
flickr = new Flickr(keys);

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
     //db.addFriend(session.message.user.id,session.message.user.name)
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
       if (intent.slug === 'url') {
         session.send(`${res.source}`)

         request.get(`${res.source}`,options,function(err,resp,body){
            if(err) {
              console.log(err);
            }
          });
         session.send(`url invoked with status code` + resp.statusCode)
       }
       if (intent.slug === 'flickr') {
         topic = session.message.text.replace('flickr','').trim().toLowerCase();
         console.log(topic);
         flickr.get("photos.search", {"text":topic, "sort":"relevance"}, function(err, result){
            if (err) return console.error(err);
            index = Math.floor(Math.random() * Object.keys(result.photos).length) + 1;
            console.log(result.photos);
            console.log(index);
            var photo = result.photos.photo[index];
            if(typeof photo !== 'undefined' && photo){
              var url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_c.jpg";
              session.send(url);
            }else {
              session.send("Sorry i cannot flickr that");
            }
          });
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
       //db.getFriends();
     }
     else {
       session.send(`Hello ${session.message.user.name} :)`)
       console.log("not known intent")
       console.log(res)
     }

   })
   .catch((err) => session.send(` ${err} I need some sleep right now... Talk to me later!`))
})

// Server Init
const server = restify.createServer()
var portnumber = process.env.PORT || 8080
server.listen(portnumber)
console.log("listning to port " + portnumber)
server.post('/', connector.listen())
//db.insertUser(obj2);
//db.getUsers();
var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

app.set('port', 5000)

// Process urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Bonjour, Je suis votre Facebook Messenger Bot')
})

app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'Bot_Messenger_App') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})


// End Point

app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            if (text === 'salut') {
                sendGenericMessage(sender)
                continue
            }
            sendTextMessage(sender, "Bot: " + text.substring(0, 200))
        }
        if (event.postback) {
            text = JSON.stringify(event.postback)
            sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
            continue
        }
    }
    res.sendStatus(200)
})

var token = "EAAU6bUxOrIYBAGt9uqgYGX2HwlxycaD3Uhv7M3gSGUxalu2MsqSDZAhruN5Ve6gXJdu7zhPv4Ry3sU4mRCc5pHIi8bSRUbaVvJVEL0qNHNyVyFZBYGpcCZBdCgHPeWILbe6RFwBuTh80ytfmpXQp2g4QVhFFQ54lbIdDZAZBCngZDZD"

// Echo back messages

function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}
