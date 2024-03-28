const express = require('express');
const { initializeSessions } = require('./sessions');
const { handleRequests } = require('./requests');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Express server is running!');
});

// Start the Express server
app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
  initializeSessions(); // Start initializing sessions once the server is up
  //handleRequests(); // Start handling incoming requests
});