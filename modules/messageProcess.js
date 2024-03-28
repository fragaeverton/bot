let { sendMessage, sendStock } = require('./messageHandlers');
let { getProducts, setProducts } = require('./variables');
let { getUrl, postUrl } = require('./http');
let { rgex_delete, rgex_clear, rgex_view, rgex_nickname, rgex_contentBetweenObject, rgex_search } = require('./constants');
const { GROUP_ID, ADM_ID, isLive} = require('../prop.js');

function analyze(client, message){
    let body = message.body;
    switch(true){
        case rgex_clear.test(body):
            setProducts([]);
            sendMessage(client, message, printFormatted());
            break;
        case rgex_view.test(body):
            sendMessage(client, message, printFormatted());
            break;
        case rgex_delete.test(body):
            let target = body.replace("$DELETE ", "").toUpperCase();
            setProducts(getProducts().filter(e => e !== target));
            sendMessage(client, message, printFormatted());
            break;
        case message.hasOwnProperty("quotedMsg"):
            if(message.from == ADM_ID){
                let property = JSON.parse(message.quotedMsg.title.match(rgex_contentBetweenObject)[0]);
                let obj = {
                    name: message.body,
                    productId: property.id
                }
                postUrl('http://localhost:8080/nicknames', obj, function(error, response){                 
                    sendMessage(client, message, error ? `$${response.status}` : `$Nickname "*${response.data.name.toUpperCase()}*" has been created!`);
                });
            }
            break;
        case rgex_nickname.test(body):
            if(message.from == ADM_ID){
                getUrl('http://localhost:8080/products/without-nicknames', {}, function(error, response){ 
                    if(error){
                        sendMessage(client, message, "$500");
                    }else{       
                        response.data.forEach(e => sendStock(client, message, e));
                    }       
                });
            }
            break;
        case rgex_search.test(body):
            if(message.from == ADM_ID){
                getUrl('http://localhost:8080/products/search?name=' + body.replace("$SEARCH ", ""), {}, function(error, response){ 
                    if(error){
                        sendMessage(client, message, "$500");
                    }else{       
                        response.data.forEach(e => sendStock(client, message, e));
                    }       
                });
            }
            break;
        default:
            let arr = body.split(/\n|,/).map(item => item.trim().toUpperCase());
            setProducts(getProducts().concat(arr));
            if(isLive) client.from = GROUP_ID; // SHOPPING LIST MUST GO TO THE GROUP 
            sendMessage(client, message, printFormatted());
    }
}


function printFormatted(){
    let reply = "";
    getProducts().forEach(e=> {if(e != "") reply += e + "\n"});
    if(getProducts().length ==0){
        reply = "*Your list is empty*";
    }
    return reply;
}

module.exports = { analyze };
  
