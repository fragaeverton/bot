// Supports ES6


const express = require('express');
const app = express();
const port = 3000;

const axios = require('axios');

const fs = require('fs');

// import { create, Whatsapp } from 'venom-bot';
const venom = require('venom-bot');
const GROUP_ID = require('./prop.js');
let products = [];
let stock = [];
const BOT_SESSION = 'bot-session', GENERAL_SESSION = 'general-whatsapp';
let botSession, generalSession = '';
let currSession = BOT_SESSION;
let rgex_clear = /CLEAR/;
let rgex_view = /VIEW/;
let rgex_delete = /DELETE/;
let rgex_nickname = /NICKNAMES/;

//CREATE SESSIONS
async function initializeSessions() {
  try {
    botSession = await createSession(BOT_SESSION);
    start(botSession);
    /*generalSession =  await createSession(GENERAL_SESSION);
    start(generalSession);*/
  } catch (error) {
    console.error("Error creating sessions:", error);
  }
}

async function createSession(name) {
  try {
    const client = await venom.create({
      session: name //name of session
    });
    return client;
  } catch (error) {
    console.error("Error creating session:", error);
  }
}

function start(client) {

  trackState(client);

  lookupPreviousMessages(client);

  listenReceivedMessages(client);
  
}

function trackState(client){
  
  client.onStateChange((state) => {
    console.log('State changed: ', state);
    // force whatsapp take over
    if ('CONFLICT'.includes(state)) client.useHere();
    // detect disconnect on whatsapp
    if ('UNPAIRED'.includes(state)) console.log('logout');
  });

  let time = 0;
  client.onStreamChange((state) => {
    console.log('State Connection Stream: ' + state);
    clearTimeout(time);
    if (state === 'DISCONNECTED' || state === 'SYNCING') {
      time = setTimeout(() => {
        client.close();
      }, 80000);
    }
  });

  // function to detect incoming call
  client.onIncomingCall(async (call) => {
    console.log(call);
    client.sendText(call.peerJid, "Sorry, I still can't answer calls");
  });

}

function lookupPreviousMessages(client){
  if(client.session === BOT_SESSION){
    client
    .getAllMessagesInChat(GROUP_ID)
    .then((result) => {
      let msg = result[result.length - 1].body;
      if(msg!="*Your list is empty*"){
        products = msg.split("\n").map(item => item.toUpperCase());
      }
    })
    .catch((erro) => {
    });
  }
}

function listenReceivedMessages(client){

  client.onMessage((message) => {
    if (message.from == GROUP_ID && message.isGroupMsg === false) {
      currSession = botSession; 
      let response = analyze(message);
      //let reply = generateReply();
      sendMessage(message, response);      
    }else{
      currSession = generalSession; 
    }
  });

}

function analyze(message){
  let body = message.body;
  switch(true){
    case rgex_clear.test(body):
      products = [];
      break;
    case rgex_view.test(body):
      break;
    case rgex_delete.test(body):
      let target = body.replace("DELETE ", "").toUpperCase();
      products = products.filter(e => e !== target);
      break;
    case rgex_nickname.test(body):
      showStock(message);
      break;
    default:
      let arr = body.split(/\n|,/).map(item => item.trim().toUpperCase());
      products = products.concat(arr);
  }
  return printFormatted();
}

function printFormatted(){
  let reply = "";
  products.forEach(e=> {if(e != "")reply += e + "\n"});
  if(products.length ==0){
    reply = "*Your list is empty*";
  }
  return reply;
}

function generateReply(){

}
async function showStock(message){
  try {
    const response = await axios.get('http://localhost:8080/products/without-nicknames');
    response.data.forEach(e => sendImage(message, e));    
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function sendMessage(msg, reply){
  //writeFile(JSON.stringify(currSession, null, 2));
  currSession
    .sendText(msg.from, reply)
    .then((result) => {
      //console.log('Result: ', result); //return object success
    })
    .catch((erro) => {
      console.log("error")
      //console.error('Error when sending: ', erro); //return object error
    });
}

function sendImage(msg, {url, name, shop}){
  //writeFile(JSON.stringify(currSession, null, 2));
  console.log(shop)
  currSession
    .sendLinkPreview(msg.from, url, `${name} - ${shop.name}`)
    .then((result) => {
      //console.log('Result: ', result); //return object success
    })
    .catch((erro) => {
      console.log("error")
      //console.error('Error when sending: ', erro); //return object error
    });
}

function writeFile(content){

  const filePath = 'log.json';
  content += "\n//////\n";
  fs.appendFile(filePath, content, (err) => {
    if (err) {
      console.error('Error appending to file:', err);
      return;
    }
  });
}

app.get('/', (req, res) => {
  res.send('Express server is running!');
});

// Start the Express server
app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
  initializeSessions(); // Start initializing sessions once the server is up
});
