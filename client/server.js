// Instastore
// client/server.js
// Anthony Krivonos
// 10/16/2017

// Global Imports
const express = require('express');
const cors = require('cors');
const app = express();

// Local Imports
const environment = require('../environment.js');

// Local Variables
let port = process.env.PORT || environment.client.port || '8081';

app.use(cors());
app.use('/', express.static(environment.client.app_dir));

app.listen(port, () => {
      console.log(`Instastore client listening on port ${port}.`);
});
