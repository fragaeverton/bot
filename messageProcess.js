let { sendMessage, sendStock } = require('./messageHandlers');
let { getProducts, setProducts } = require('./variables');
const axios = require('axios');
let { rgex_delete, rgex_clear, rgex_view, rgex_nickname } = require('./constants');

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
        case rgex_nickname.test(body):
            axios
            .get('http://localhost:8080/products/without-nicknames')
            .then((response) => {
                response.data.forEach(e => sendStock(client, message, e));
            })
            .catch((result) => {
            })
            break;
        default:
            let arr = body.split(/\n|,/).map(item => item.trim().toUpperCase());
            setProducts(getProducts().concat(arr));
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
  
