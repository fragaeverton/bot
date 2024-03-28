const { BOT_SESSION } = require('./constants.js');
const GROUP_ID = require('../prop.js');

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


function sendPreview(client, msg, item){
    //writeFile(JSON.stringify(currSession, null, 2));
    client
      .sendLinkPreview(msg.from, item.url, `${item.name} - ${item.shop.name}\n<Object>${JSON.stringify(item, null, 2)}</Object>`)
      .then((result) => {
        //console.log('Result: ', result); //return object success
      })
      .catch((erro) => {
        console.log("error")
        //console.error('Error when sending: ', erro); //return object error
      });
  }
  

module.exports = { sendMessage, sendPreview };