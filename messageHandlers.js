const axios = require('axios');
const fs = require('fs');
const { BOT_SESSION } = require('./constants');
const GROUP_ID = require('./prop.js');

function sendMessage(client, msg, reply) {
  //writeFile(JSON.stringify(currSession, null, 2));
  client
    .sendText(msg.from, reply)
    .then((result) => {
      //console.log('Result: ', result); //return object success
    })
    .catch((erro) => {
      console.log("error")
      //console.error('Error when sending: ', erro); //return object error
    });
}


function sendStock(client, msg, {url, name, shop}){
    //writeFile(JSON.stringify(currSession, null, 2));
    client
      .sendLinkPreview(msg.from, url, `${name} - ${shop.name}`)
      .then((result) => {
        //console.log('Result: ', result); //return object success
      })
      .catch((erro) => {
        console.log("error")
        //console.error('Error when sending: ', erro); //return object error
      });
  }
  

module.exports = { sendMessage, sendStock };