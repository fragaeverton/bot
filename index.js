// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const venom = require('venom-bot');
const GROUP_ID = require('./prop.js');
let products = [];
let rgex_clear = /CLEAR/;
let rgex_view = /VIEW/;
let rgex_delete = /DELETE/;

venom.create({
  session: 'session-name' //name of session
})
.then((client) => {
  start(client);
})
.catch((erro) => {
  console.log(erro);
});


function start(client) {
  
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

  client.onMessage((message) => {
    if (/*message.body === '.'*/ message.from == GROUP_ID && message.isGroupMsg === false) { 
      let response = analyze(message);
      //let reply = generateReply();
      sendMessage(client, message, response);
      
    }
  });
}

function analyze({body}){
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

function sendMessage(client, msg, reply){
  client
    .sendText(msg.from, reply)
    .then((result) => {
      //console.log('Result: ', result); //return object success
    })
    .catch((erro) => {
      console.error('Error when sending: ', erro); //return object error
    });
}