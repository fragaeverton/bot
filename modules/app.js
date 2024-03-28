
const { analyze } = require('./messageProcess.js');
let { sendMessage, sendPreview } = require('./messageDelivery.js');
const { GROUP_ID, ADM_ID} = require('../prop.js');

function startApp(client){    
  
    //LISTEN TO ONCOMING MESSAGES
    client.onMessage((message) => {
        if (message.from == GROUP_ID || message.from == ADM_ID/*&& message.isGroupMsg === false*/) {
            analyze(client, message, (reply, client)=> {  
                switch(reply.method){
                    case 'sendMessage':
                        sendMessage(client, message, reply.text);
                        break;
                    case 'sendPreview':
                        sendPreview(client, message, reply.text);
                        break;
                }
            });     
            //writeFile(JSON.stringify(message, null, 2));
        }
    });


}

module.exports = { startApp };