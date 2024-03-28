
let { getShopList, setShopList } = require('./variables');
const { GROUP_ID, ADM_ID, isLive} = require('../prop.js');
let { getUrl, postUrl } = require('./http');
let { sendMessage, sendPreview } = require('./messageDelivery.js');
let { rgex_contentBetweenObject, link_insertNickname, link_productsWithoutNickname, link_searchProductsByName } = require('./constants');

function clearShopList(){
    setShopList([]);
    return viewShopList();
}

function viewShopList(){
    return {text:printFormatted(), method: 'sendMessage'};
}

function deleteItemFromShopList(body){
    let target = body.replace("$DELETE ", "").toUpperCase();
    setShopList(getShopList().filter(e => e !== target));
    return viewShopList();
}

function insertNickname(client, message){
    if(message.from == ADM_ID){
        let property = JSON.parse(message.quotedMsg.title.match(rgex_contentBetweenObject)[0]);
        let obj = {
            name: message.body,
            productId: property.id
        }
        postUrl(link_insertNickname, obj, function(error, response){                 
            sendMessage(client, message, error ? `$${response.status}` : `$Nickname "*${response.data.name.toUpperCase()}*" has been created!`);
        });
    }
    return {text:"", method: null};
}


function showProductsWithoutNickname(client, message){
    if(message.from == ADM_ID){
        getUrl(link_productsWithoutNickname, {}, function(error, response){ 
            if(error){
                sendMessage(client, message, "$500");
            }else{       
                response.data.forEach(e => sendPreview(client, message, e));
            }       
        });
    }
    return {text:"", method: null};
}

function showProductsByName(client, message){    
    if(message.from == ADM_ID){
        getUrl(link_searchProductsByName + message.body.replace("$SEARCH ", ""), {}, function(error, response){ 
            if(error){
                console.log(error)
                sendMessage(client, message, "$500");
            }else{       
                response.data.forEach(e => sendPreview(client, message, e));
            }       
        });
    }
    return {text:"", method: null};
}

function insertProductShopList(body){    
    let arr = body.split(/\n|,/).map(item => item.trim().toUpperCase());
    setShopList(getShopList().concat(arr));
    return viewShopList();
}


function printFormatted(){
    let reply = "";
    getShopList().forEach(e=> {if(e != "") reply += e + "\n"});
    if(getShopList().length ==0){
        reply = "*Your list is empty*";
    }
    return reply;
}


module.exports = {
    clearShopList,
    viewShopList,
    deleteItemFromShopList,
    insertNickname,
    showProductsWithoutNickname,
    showProductsByName,
    insertProductShopList
}