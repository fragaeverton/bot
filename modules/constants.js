const BOT_SESSION = 'bot-session';
const GENERAL_SESSION = 'general-whatsapp';
const rgex_clear = /\$CLEAR/;
const rgex_view = /\$VIEW/;
const rgex_delete = /\$DELETE/;
const rgex_nickname = /\$NICKNAMES/;
const rgex_search = /\$SEARCH/;
const rgex_contentBetweenObject = /(?<=<Object>)([\s\S]*?)(?=<\/Object>)/;

module.exports = { BOT_SESSION, GENERAL_SESSION, rgex_clear, rgex_view, rgex_delete, rgex_nickname, rgex_contentBetweenObject, rgex_search };