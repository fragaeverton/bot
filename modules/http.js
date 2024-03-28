const axios = require('axios');

function getUrl(url, obj, callback){
    axios
    .get(url)
    .then((response) => {
        if (callback) {
            callback(null, response);
        }
    })
    .catch((error) => {
        if (callback) {
            callback(error, null); 
        }
    })

}

function postUrl(url, obj, callback){
    axios
    .post(url, obj)
    .then((response) => {
        if (callback) {
            callback(null, response);
        }
    })
    .catch((error) => {
        if (callback) {
            callback(error, null); 
        }
    })

}

module.exports = { getUrl, postUrl };