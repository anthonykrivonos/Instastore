// Instastore
// database/server.js
// Anthony Krivonos
// 10/16/2017

// Global Imports
const express = require('express');
const app = express();

// Local Imports
const environment = require('../environment.js');
const file = require('./file.js');
const object = require('../object.js');

// Local Variables
let port = process.env.PORT || environment.database.port || '8082';

app.use(bodyParser.json());

// Read Function

app.get('/read/:file/:address', function (req, res) {
      let params = req.params;
      if (params.file == null || params.address == null)
            return res.status(500).send('Invalid URI for READ operation.');
      res.status(200).json(file.read(params.file, params.address));
});

app.listen(port, () => {
      console.log(`Instastore client listening on port ${port}.`);
});
