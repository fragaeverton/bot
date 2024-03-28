const venom = require('venom-bot');
const { trackState, lookupPreviousMessages } = require('./sessionHandlers');
const { startApp } = require('./app');
const { BOT_SESSION, GENERAL_SESSION } = require('./constants.js');

async function initializeSessions() {
  try {
    let session1 = await createSession(BOT_SESSION);
    start(session1);   
  } catch (error) {
    console.error("Error creating sessions:", error);
  }
}

async function createSession(name) {
  try {
    const client = await venom.create({
      session: name //name of session
    });
    return client;
  } catch (error) {
    console.error("Error creating session:", error);
  }
}

function start(client) {
  trackState(client);
  lookupPreviousMessages(client);
  startApp(client); 
}

module.exports = { initializeSessions };