const express = require('express');
const app = express();

const mongoose = require('mongoose');

require('dotenv').config();

const port = process.env.PORT || 5000;

// plbg9DNqSAXQ1kkI



async function main() {
  await mongoose.connect(process.env.DB_URL);

  app.use('/', (req, res) => {
    res.send('Nad Nasfdsfsf!');
  });  
}

main().then(()=>console.log("Mongodb connect successfuly")).catch(err => console.log(err));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
