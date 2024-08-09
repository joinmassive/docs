const sharp = require('sharp');

sharp('input.jpg')
  .resize(200)
  .toFile('output.jpg', (err, info) => {
    if (err) throw err;
    console.log(info);
  });