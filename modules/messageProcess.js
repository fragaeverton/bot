let { clearShopList, viewShopList, deleteItemFromShopList, insertNickname, showProductsWithoutNickname, showProductsByName, insertProductShopList } = require('./messageTreatment.js');
let { getShopList, setShopList } = require('./variables');
let { rgex_delete, rgex_clear, rgex_view, rgex_nickname, rgex_search } = require('./constants');
const { GROUP_ID, ADM_ID, isLive} = require('../prop.js');

function analyze(client, message, callback){
    let body = message.body;
    switch(true){
        case rgex_clear.test(body):
            callback(clearShopList(), client);
            break;
        case rgex_view.test(body):
            callback(viewShopList(), client);
            break;
        case rgex_delete.test(body):
            callback(deleteItemFromShopList(body), client);
            break;
        case message.hasOwnProperty("quotedMsg"):
            callback(insertNickname(client, message), client);
            break;
        case rgex_nickname.test(body):
            callback(showProductsWithoutNickname(client, message), client);
            break;
        case rgex_search.test(body):
            callback(showProductsByName(client, message), client);
            break;
        default:
            if(isLive) client.from = GROUP_ID; // SHOPPING LIST MUST GO TO THE GROUP
            callback(insertProductShopList(body), client);
    }
}


function printFormatted(){
    let reply = "";
    getShopList().forEach(e=> {if(e != "") reply += e + "\n"});
    if(getShopList().length ==0){
        reply = "*Your list is empty*";
    }
    return reply;
}

module.exports = { analyze };
  
