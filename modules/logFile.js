const fs = require('fs');

function writeFile(content){

    const filePath = 'log.json';
    content += "\n//////\n";
    fs.appendFile(filePath, content, (err) => {
      if (err) {
        console.error('Error appending to file:', err);
        return;
      }
    });
  }


  module.exports = { writeFile };