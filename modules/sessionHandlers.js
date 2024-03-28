const { BOT_SESSION, GENERAL_SESSION } = require('./constants.js');
let { getShopList, setShopList } = require('./variables');
let { writeFile } = require('./logFile.js');
const { GROUP_ID, ADM_ID} = require('../prop.js');

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
            analyzePreviousMsgs(result, 1);
        })
        .catch((erro) => {
        });
        function analyzePreviousMsgs(msgs, index){
            let msg = msgs[msgs.length - index].body;
            if(msg!="*Your list is empty*" ){
                if(/^(?!(\$|https:)).*$/.test(msg)){
                    setShopList(msg.split("\n").map(item => item.toUpperCase()));
                }else{
                    analyzePreviousMsgs(msgs,++index);
                }
            }
        }
    }
}


module.exports = { trackState, lookupPreviousMessages };